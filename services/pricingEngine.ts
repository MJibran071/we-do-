import { Booking, DemandForecast } from '../types';

export interface PricingRule {
  id: string;
  name: string;
  priority: number;
  condition: {
    type: 'occupancy' | 'days_until' | 'day_of_week' | 'season' | 'event';
    operator: 'less_than' | 'greater_than' | 'equals' | 'between';
    value: any;
  };
  action: {
    type: 'percentage' | 'fixed' | 'multiply';
    value: number;
  };
  active: boolean;
}

export interface CompetitorPrice {
  id: string;
  name: string;
  price: number;
  date: Date;
  url?: string;
}

export interface PriceRecommendation {
  basePrice: number;
  recommendedPrice: number;
  confidence: number;
  factors: {
    name: string;
    impact: number;
    description: string;
  }[];
  appliedRules: string[];
}

class PricingEngine {
  private rules: PricingRule[] = [];
  private historicalData: Map<string, number[]> = new Map();

  // Initialize with rules
  setRules(rules: PricingRule[]) {
    this.rules = rules.sort((a, b) => b.priority - a.priority);
  }

  // Calculate optimal price
  calculatePrice(params: {
    basePrice: number;
    date: Date;
    bookings: Booking[];
    competitors?: CompetitorPrice[];
    entityId: string;
  }): PriceRecommendation {
    const { basePrice, date, bookings, competitors, entityId } = params;
    
    let price = basePrice;
    const factors: PriceRecommendation['factors'] = [];
    const appliedRules: string[] = [];

    // Factor 1: Occupancy rate
    const occupancy = this.calculateOccupancy(date, bookings);
    if (occupancy < 0.3) {
      price *= 0.85;
      factors.push({
        name: 'Low Occupancy',
        impact: -15,
        description: `Only ${Math.round(occupancy * 100)}% booked`
      });
    } else if (occupancy > 0.8) {
      price *= 1.2;
      factors.push({
        name: 'High Demand',
        impact: 20,
        description: `${Math.round(occupancy * 100)}% booked`
      });
    }

    // Factor 2: Days until booking
    const daysUntil = Math.floor((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysUntil < 7) {
      price *= 0.9;
      factors.push({
        name: 'Last Minute',
        impact: -10,
        description: `Only ${daysUntil} days away`
      });
    } else if (daysUntil > 90) {
      price *= 1.1;
      factors.push({
        name: 'Early Bird',
        impact: 10,
        description: `${daysUntil} days in advance`
      });
    }

    // Factor 3: Day of week
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 5 || dayOfWeek === 6) { // Friday/Saturday
      price *= 1.15;
      factors.push({
        name: 'Weekend Premium',
        impact: 15,
        description: 'High demand day'
      });
    }

    // Factor 4: Seasonal demand
    const month = date.getMonth();
    if ([5, 6, 7].includes(month)) { // Summer
      price *= 1.25;
      factors.push({
        name: 'Peak Season',
        impact: 25,
        description: 'Summer high season'
      });
    } else if ([11, 0].includes(month)) { // Winter holidays
      price *= 1.2;
      factors.push({
        name: 'Holiday Season',
        impact: 20,
        description: 'Holiday premium'
      });
    }

    // Factor 5: Competitor pricing
    if (competitors && competitors.length > 0) {
      const avgCompetitorPrice = competitors.reduce((sum, c) => sum + c.price, 0) / competitors.length;
      const competitorDiff = ((price - avgCompetitorPrice) / avgCompetitorPrice) * 100;
      
      if (competitorDiff > 20) {
        price *= 0.95;
        factors.push({
          name: 'Competitive Adjustment',
          impact: -5,
          description: `${Math.round(competitorDiff)}% above market`
        });
      } else if (competitorDiff < -20) {
        price *= 1.05;
        factors.push({
          name: 'Value Opportunity',
          impact: 5,
          description: `${Math.round(Math.abs(competitorDiff))}% below market`
        });
      }
    }

    // Factor 6: Historical performance
    const historicalAvg = this.getHistoricalAverage(entityId, date);
    if (historicalAvg && Math.abs(price - historicalAvg) > historicalAvg * 0.3) {
      const adjustment = historicalAvg > price ? 1.05 : 0.95;
      price *= adjustment;
      factors.push({
        name: 'Historical Trend',
        impact: adjustment > 1 ? 5 : -5,
        description: `Based on past performance`
      });
    }

    // Apply custom rules
    this.rules.filter(r => r.active).forEach(rule => {
      if (this.evaluateCondition(rule.condition, { date, occupancy, daysUntil })) {
        const before = price;
        price = this.applyAction(price, rule.action);
        const impact = ((price - before) / before) * 100;
        
        factors.push({
          name: rule.name,
          impact: Math.round(impact),
          description: `Custom rule applied`
        });
        appliedRules.push(rule.id);
      }
    });

    // Calculate confidence based on data availability
    let confidence = 0.7;
    if (competitors && competitors.length > 2) confidence += 0.1;
    if (historicalAvg) confidence += 0.1;
    if (bookings.length > 10) confidence += 0.1;

    return {
      basePrice,
      recommendedPrice: Math.round(price),
      confidence: Math.min(confidence, 1),
      factors,
      appliedRules
    };
  }

  // Demand forecasting
  forecastDemand(params: {
    startDate: Date;
    endDate: Date;
    bookings: Booking[];
    entityId: string;
  }): DemandForecast[] {
    const { startDate, endDate, bookings } = params;
    const forecasts: DemandForecast[] = [];
    
    const current = new Date(startDate);
    while (current <= endDate) {
      const occupancy = this.calculateOccupancy(current, bookings);
      const basePrice = 100; // Default base price
      const recommendation = this.calculatePrice({
        basePrice,
        date: current,
        bookings,
        entityId: params.entityId
      });

      let demandLevel: 'High' | 'Medium' | 'Low' = 'Medium';
      if (occupancy > 0.7) demandLevel = 'High';
      else if (occupancy < 0.3) demandLevel = 'Low';

      forecasts.push({
        date: current.toISOString().split('T')[0],
        demandLevel,
        suggestedPrice: recommendation.recommendedPrice,
        event: this.detectEvent(current)
      });

      current.setDate(current.getDate() + 1);
    }

    return forecasts;
  }

  // Helper: Calculate occupancy for a date
  private calculateOccupancy(date: Date, bookings: Booking[]): number {
    const dateStr = date.toISOString().split('T')[0];
    const bookedCount = bookings.filter(b => {
      const checkIn = new Date(b.checkIn).toISOString().split('T')[0];
      const checkOut = new Date(b.checkOut).toISOString().split('T')[0];
      return dateStr >= checkIn && dateStr < checkOut;
    }).length;

    // Assume 10 units for now (should be configurable)
    return Math.min(bookedCount / 10, 1);
  }

  // Helper: Evaluate rule condition
  private evaluateCondition(condition: PricingRule['condition'], context: any): boolean {
    const { type, operator, value } = condition;
    let actual: any;

    switch (type) {
      case 'occupancy':
        actual = context.occupancy;
        break;
      case 'days_until':
        actual = context.daysUntil;
        break;
      case 'day_of_week':
        actual = context.date.getDay();
        break;
      default:
        return false;
    }

    switch (operator) {
      case 'less_than':
        return actual < value;
      case 'greater_than':
        return actual > value;
      case 'equals':
        return actual === value;
      case 'between':
        return actual >= value[0] && actual <= value[1];
      default:
        return false;
    }
  }

  // Helper: Apply pricing action
  private applyAction(price: number, action: PricingRule['action']): number {
    switch (action.type) {
      case 'percentage':
        return price * (1 + action.value / 100);
      case 'fixed':
        return price + action.value;
      case 'multiply':
        return price * action.value;
      default:
        return price;
    }
  }

  // Helper: Get historical average
  private getHistoricalAverage(entityId: string, date: Date): number | null {
    const key = `${entityId}-${date.getMonth()}`;
    const data = this.historicalData.get(key);
    if (!data || data.length === 0) return null;
    return data.reduce((sum, val) => sum + val, 0) / data.length;
  }

  // Helper: Detect special events
  private detectEvent(date: Date): string | undefined {
    const month = date.getMonth();
    const day = date.getDate();

    // Major holidays
    if (month === 11 && day === 25) return 'Christmas';
    if (month === 0 && day === 1) return 'New Year';
    if (month === 6 && day === 4) return 'Independence Day';
    if (month === 10 && day >= 22 && day <= 28) return 'Thanksgiving Week';

    return undefined;
  }

  // Store historical data
  addHistoricalData(entityId: string, date: Date, price: number) {
    const key = `${entityId}-${date.getMonth()}`;
    const data = this.historicalData.get(key) || [];
    data.push(price);
    this.historicalData.set(key, data);
  }
}

export const pricingEngine = new PricingEngine();

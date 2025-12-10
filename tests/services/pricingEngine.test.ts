import { describe, it, expect, beforeEach } from 'vitest';
import { pricingEngine } from '../../services/pricingEngine';
import { Booking, BookingStatus, Platform } from '../../types';

describe('PricingEngine', () => {
  const mockBookings: Booking[] = [
    {
      id: 'b1',
      userId: 'u1',
      guestName: 'Test Guest',
      checkIn: new Date('2024-06-15'),
      checkOut: new Date('2024-06-20'),
      status: BookingStatus.Confirmed,
      paymentStatus: 'Paid',
      platform: Platform.Airbnb,
      totalPrice: 500,
      guests: 2
    }
  ];

  it('should calculate base price recommendation', () => {
    const recommendation = pricingEngine.calculatePrice({
      basePrice: 100,
      date: new Date('2024-06-15'),
      bookings: [],
      entityId: 'apt1'
    });

    expect(recommendation.basePrice).toBe(100);
    expect(recommendation.recommendedPrice).toBeGreaterThan(0);
    expect(recommendation.confidence).toBeGreaterThan(0);
    expect(recommendation.factors).toBeDefined();
  });

  it('should apply high demand pricing', () => {
    const highDemandBookings = Array(9).fill(null).map((_, i) => ({
      ...mockBookings[0],
      id: `b${i}`,
      checkIn: new Date('2024-06-15'),
      checkOut: new Date('2024-06-20')
    }));

    const recommendation = pricingEngine.calculatePrice({
      basePrice: 100,
      date: new Date('2024-06-16'),
      bookings: highDemandBookings,
      entityId: 'apt1'
    });

    expect(recommendation.recommendedPrice).toBeGreaterThan(100);
    expect(recommendation.factors.some(f => f.name === 'High Demand')).toBe(true);
  });

  it('should apply low occupancy discount', () => {
    const recommendation = pricingEngine.calculatePrice({
      basePrice: 100,
      date: new Date('2024-06-15'),
      bookings: [],
      entityId: 'apt1'
    });

    expect(recommendation.factors.some(f => f.impact < 0)).toBe(true);
  });

  it('should apply weekend premium', () => {
    const saturday = new Date('2024-06-15'); // Assuming this is a Saturday
    const recommendation = pricingEngine.calculatePrice({
      basePrice: 100,
      date: saturday,
      bookings: [],
      entityId: 'apt1'
    });

    // Weekend premium should be applied if it's Friday or Saturday
    if (saturday.getDay() === 5 || saturday.getDay() === 6) {
      expect(recommendation.factors.some(f => f.name === 'Weekend Premium')).toBe(true);
    }
  });

  it('should forecast demand', () => {
    const forecasts = pricingEngine.forecastDemand({
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-06-07'),
      bookings: mockBookings,
      entityId: 'apt1'
    });

    expect(forecasts.length).toBe(7);
    expect(forecasts[0]).toHaveProperty('date');
    expect(forecasts[0]).toHaveProperty('demandLevel');
    expect(forecasts[0]).toHaveProperty('suggestedPrice');
  });

  it('should consider competitor pricing', () => {
    const competitors = [
      { id: 'c1', name: 'Competitor 1', price: 150, date: new Date() },
      { id: 'c2', name: 'Competitor 2', price: 160, date: new Date() }
    ];

    const recommendation = pricingEngine.calculatePrice({
      basePrice: 200,
      date: new Date('2024-06-15'),
      bookings: [],
      competitors,
      entityId: 'apt1'
    });

    expect(recommendation.factors.some(f => f.name.includes('Competitive'))).toBe(true);
  });
});

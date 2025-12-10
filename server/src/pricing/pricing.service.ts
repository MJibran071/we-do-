
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PricingRule } from './pricing-rule.entity';
import { GeminiService } from '../gemini/gemini.service';
import { OperationsService } from '../operations/operations.service';

@Injectable()
export class PricingService {
  constructor(
    @InjectRepository(PricingRule)
    private ruleRepo: Repository<PricingRule>,
    private readonly geminiService: GeminiService,
    private readonly opsService: OperationsService
  ) {}

  async getRules() {
    return this.ruleRepo.find();
  }

  async optimizePricing(location: string, dateRange: string[]) {
    // 1. Get current occupancy stats
    const bookings = await this.opsService.getBookings();
    // Simplified occupancy calc
    const occupancyRate = bookings.length > 50 ? 0.8 : 0.4; 

    // 2. Call Gemini for Market Analysis & Event detection
    // Real implementation would pull external data, here we ask Gemini to simulate/infer based on date
    const forecast = await this.geminiService.analyzePricingStrategy(location, dateRange, occupancyRate);
    
    return forecast;
  }
}

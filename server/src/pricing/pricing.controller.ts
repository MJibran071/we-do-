
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('pricing')
@UseGuards(AuthGuard('jwt'))
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Get('rules')
  async getRules() {
    return this.pricingService.getRules();
  }

  @Post('optimize')
  async optimize(@Body() body: { location: string; dates: string[] }) {
    return this.pricingService.optimizePricing(body.location, body.dates);
  }
}

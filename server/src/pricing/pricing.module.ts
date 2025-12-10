
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricingRule } from './pricing-rule.entity';
import { PricingService } from './pricing.service';
import { PricingController } from './pricing.controller';
import { GeminiModule } from '../gemini/gemini.module';
import { OperationsModule } from '../operations/operations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PricingRule]),
    GeminiModule,
    OperationsModule
  ],
  controllers: [PricingController],
  providers: [PricingService],
})
export class PricingModule {}


import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { Budget } from './budget.entity';
import { FinOpsService } from './finops.service';
import { FinOpsController } from './finops.controller';
import { GeminiModule } from '../gemini/gemini.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Budget]),
    GeminiModule
  ],
  controllers: [FinOpsController],
  providers: [FinOpsService],
  exports: [FinOpsService]
})
export class FinOpsModule {}

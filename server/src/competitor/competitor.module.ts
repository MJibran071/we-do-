
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competitor } from './competitor.entity';
import { PriceSnapshot } from './price-snapshot.entity';
import { CompetitorService } from './competitor.service';
import { CompetitorController } from './competitor.controller';
import { GeminiModule } from '../gemini/gemini.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Competitor, PriceSnapshot]),
    GeminiModule
  ],
  controllers: [CompetitorController],
  providers: [CompetitorService],
  exports: [CompetitorService]
})
export class CompetitorModule {}

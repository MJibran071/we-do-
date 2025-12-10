
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Competitor } from './competitor.entity';
import { PriceSnapshot } from './price-snapshot.entity';
import { GeminiService } from '../gemini/gemini.service';

@Injectable()
export class CompetitorService {
  private readonly logger = new Logger(CompetitorService.name);

  constructor(
    @InjectRepository(Competitor)
    private competitorRepo: Repository<Competitor>,
    @InjectRepository(PriceSnapshot)
    private snapshotRepo: Repository<PriceSnapshot>,
    private readonly geminiService: GeminiService,
  ) {}

  async trackCompetitor(url: string) {
    // 1. Analyze Initial Data
    const analysis = await this.geminiService.analyzeCompetitorPage(url);

    // 2. Create Competitor
    let competitor = await this.competitorRepo.findOne({ where: { websiteUrl: url } });
    if (!competitor) {
        competitor = this.competitorRepo.create({
            name: analysis.name,
            websiteUrl: url,
            businessType: analysis.businessType,
            strengths: analysis.strengths,
            weaknesses: analysis.weaknesses,
            sentimentScore: analysis.sentimentScore,
            lastAnalyzed: new Date()
        });
        competitor = await this.competitorRepo.save(competitor);
    }

    // 3. Save Initial Prices
    if (analysis.currentPrices && analysis.currentPrices.length > 0) {
        for (const p of analysis.currentPrices) {
            const snapshot = this.snapshotRepo.create({
                competitor,
                productName: p.productName,
                price: p.price,
                currency: 'USD' // Default
            });
            await this.snapshotRepo.save(snapshot);
        }
    }

    return competitor;
  }

  async refreshAnalysis(id: string) {
      const competitor = await this.competitorRepo.findOne({ where: { id } });
      if (!competitor) throw new Error('Competitor not found');

      const analysis = await this.geminiService.analyzeCompetitorPage(competitor.websiteUrl);
      
      // Update entity
      competitor.strengths = analysis.strengths;
      competitor.weaknesses = analysis.weaknesses;
      competitor.sentimentScore = analysis.sentimentScore;
      competitor.lastAnalyzed = new Date();
      await this.competitorRepo.save(competitor);

      // Add new price snapshots
      if (analysis.currentPrices) {
          for (const p of analysis.currentPrices) {
              const snapshot = this.snapshotRepo.create({
                  competitor,
                  productName: p.productName,
                  price: p.price,
                  currency: 'USD'
              });
              await this.snapshotRepo.save(snapshot);
          }
      }

      return competitor;
  }

  async getAll() {
      return this.competitorRepo.find({ relations: ['snapshots'] });
  }

  async getInsights() {
      const competitors = await this.getAll();
      const avgSentiment = competitors.reduce((sum, c) => sum + (c.sentimentScore || 0), 0) / (competitors.length || 1);
      
      // Simple aggregation for demo
      return {
          totalCompetitors: competitors.length,
          averageMarketSentiment: avgSentiment,
          recentMoves: competitors.map(c => ({ 
              name: c.name, 
              updated: c.lastAnalyzed, 
              notableWeakness: c.weaknesses 
          }))
      };
  }
}

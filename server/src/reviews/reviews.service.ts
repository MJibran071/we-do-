
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { GeminiService } from '../gemini/gemini.service';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);

  constructor(
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,
    private readonly geminiService: GeminiService
  ) {}

  async findAll() {
    return this.reviewRepo.find({ order: { date: 'DESC' } });
  }

  async create(data: Partial<Review>) {
    // Auto-analyze sentiment if not provided
    if (!data.sentiment && data.content) {
        const analysis = await this.geminiService.analyzeMessage(data.content);
        data.sentiment = analysis.sentiment;
        // Mocking tag extraction for now, could be added to GeminiService
        data.tags = analysis.sentiment === 'Negative' ? ['Complaint'] : ['Praise'];
    }

    const review = this.reviewRepo.create(data);
    return this.reviewRepo.save(review);
  }

  async reply(id: string, replyContent: string) {
    await this.reviewRepo.update(id, {
        reply: replyContent,
        replyDate: new Date()
    });
    return this.reviewRepo.findOne({ where: { id } });
  }

  async getTrends() {
      const reviews = await this.findAll();
      return this.geminiService.analyzeReviewTrends(reviews);
  }
}

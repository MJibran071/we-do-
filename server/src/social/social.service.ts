
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialPost } from './social-post.entity';
import { GeminiService } from '../gemini/gemini.service';

@Injectable()
export class SocialService {
  constructor(
    @InjectRepository(SocialPost)
    private postRepo: Repository<SocialPost>,
    private readonly geminiService: GeminiService
  ) {}

  async getPosts() {
    return this.postRepo.find({ order: { scheduledFor: 'ASC' } });
  }

  async generateCampaign(theme: string, businessType: string, count: number = 3) {
    // 1. Generate text content
    const postsData = await this.geminiService.generateSocialCampaign(theme, businessType, count);
    
    const savedPosts = [];
    const baseDate = new Date();

    for (let i = 0; i < postsData.length; i++) {
        const post = postsData[i];
        
        // 2. Generate Image (optional, mocked for speed or routed via GeminiService to Imagen)
        const imageUrl = await this.geminiService.generateMarketingImage(`Social media photo for ${theme}: ${post.visualDescription}`);

        const scheduledDate = new Date(baseDate);
        scheduledDate.setDate(baseDate.getDate() + (i * 2)); // Every other day

        const newPost = this.postRepo.create({
            platform: 'Instagram',
            content: post.caption,
            imageUrl: imageUrl || 'https://via.placeholder.com/400',
            scheduledFor: scheduledDate,
            status: 'Draft'
        });
        savedPosts.push(await this.postRepo.save(newPost));
    }

    return savedPosts;
  }
}


import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class UsageService {
  private readonly logger = new Logger(UsageService.name);
  private redis: Redis;

  // Plan Limits
  private readonly LIMITS = {
    'Starter': { messages: 50, properties: 1 },
    'Growth': { messages: 500, properties: 10 },
    'Agency': { messages: 10000, properties: 100 }
  };

  constructor(private configService: ConfigService) {
    this.redis = new Redis(this.configService.get<string>('REDIS_URI'));
  }

  private getKey(userId: string) {
    const date = new Date();
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    return `usage:${userId}:${monthKey}`;
  }

  async incrementMessageCount(userId: string) {
    const key = this.getKey(userId);
    await this.redis.hincrby(key, 'messages', 1);
    await this.redis.expire(key, 60 * 60 * 24 * 32); // Expire after ~1 month
  }

  async getUsage(userId: string) {
    const key = this.getKey(userId);
    const messages = await this.redis.hget(key, 'messages');
    return {
      messages: parseInt(messages || '0', 10)
    };
  }

  async checkLimit(userId: string, planId: string, metric: 'messages' | 'properties'): Promise<boolean> {
    // Admin bypass
    if (planId === 'Admin') return true;

    const limit = this.LIMITS[planId]?.[metric] || 0;
    
    if (metric === 'messages') {
        const usage = await this.getUsage(userId);
        if (usage.messages >= limit) {
            this.logger.warn(`User ${userId} exceeded message limit (${usage.messages}/${limit})`);
            return false;
        }
    }
    
    // For properties, we would typically check the DB count, 
    // but here we can assume the service calling this handles that logic or we check a redis counter
    
    return true;
  }
}

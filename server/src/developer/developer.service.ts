
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from './api-key.entity';
import * as crypto from 'crypto';

@Injectable()
export class DeveloperService {
  constructor(
    @InjectRepository(ApiKey)
    private apiKeyRepo: Repository<ApiKey>,
  ) {}

  async createKey(userId: string, name: string) {
    const key = `sk_live_${crypto.randomBytes(24).toString('hex')}`;
    const newKey = this.apiKeyRepo.create({
      userId,
      name,
      key,
    });
    return this.apiKeyRepo.save(newKey);
  }

  async getKeys(userId: string) {
    return this.apiKeyRepo.find({ where: { userId } });
  }

  async validateKey(key: string): Promise<ApiKey | null> {
    const apiKey = await this.apiKeyRepo.findOne({ where: { key, isActive: true } });
    if (apiKey) {
      // Async update last used
      this.apiKeyRepo.update(apiKey.id, { lastUsedAt: new Date() });
    }
    return apiKey;
  }

  async revokeKey(id: string, userId: string) {
    return this.apiKeyRepo.update({ id, userId }, { isActive: false });
  }
}

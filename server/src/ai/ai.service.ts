
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiModelConfig } from './ai-model-config.entity';
import { User } from '../users/user.entity';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    @InjectRepository(AiModelConfig)
    private modelRepo: Repository<AiModelConfig>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) { }

  async findAll() {
    return this.modelRepo.find({ order: { isActive: 'DESC', name: 'ASC' } });
  }

  async create(config: Partial<AiModelConfig>) {
    const model = this.modelRepo.create(config);
    return this.modelRepo.save(model);
  }

  async update(id: string, config: Partial<AiModelConfig>) {
    await this.modelRepo.update(id, config);
    return this.modelRepo.findOne({ where: { id } });
  }

  async delete(id: string) {
    return this.modelRepo.delete(id);
  }

  // Dynamic Routing Logic
  async getBestModel(capability: string = 'text'): Promise<AiModelConfig | null> {
    // 1. Try to find an active model with the specific capability
    let model = await this.modelRepo.createQueryBuilder('m')
      .where('m.isActive = :active', { active: true })
      .andWhere('m.capabilities LIKE :cap', { cap: `%${capability}%` })
      .orderBy('m.costPer1kTokens', 'ASC') // Cost optimization strategy
      .getOne();

    // 2. Fallback to any active model
    if (!model) {
      model = await this.modelRepo.findOne({
        where: { isActive: true },
        order: { updatedAt: 'DESC' }
      });
    }

    if (!model) {
      this.logger.warn(`No active AI models found for capability: ${capability}`);
    }

    return model;
  }

  // Task Assignment Methods
  async getTaskAssignments(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    return user?.taskAssignments || null;
  }

  async updateTaskAssignments(userId: string, assignments: any) {
    await this.userRepo.update(userId, { taskAssignments: assignments });
    const user = await this.userRepo.findOne({ where: { id: userId } });
    return user?.taskAssignments || null;
  }
}

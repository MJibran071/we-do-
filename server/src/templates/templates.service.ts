
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageTemplate } from './template.entity';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(MessageTemplate)
    private templateRepo: Repository<MessageTemplate>,
  ) { }

  async findAll(userId: string) {
    // Return templates created by user OR global templates (logic can be adjusted based on team sharing rules)
    return this.templateRepo.find({
      order: { category: 'ASC', title: 'ASC' }
    });
  }

  async create(data: Partial<MessageTemplate>) {
    const template = this.templateRepo.create(data);
    return this.templateRepo.save(template);
  }

  async update(id: string, data: Partial<MessageTemplate>) {
    await this.templateRepo.update(id, data);
    return this.templateRepo.findOne({ where: { id } });
  }

  async delete(id: string) {
    return this.templateRepo.delete(id);
  }
}

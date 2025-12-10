
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { QueueService } from '../queue/queue.service';

@Injectable()
export class CrmService {
  private readonly logger = new Logger(CrmService.name);

  constructor(
    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,
    private readonly queueService: QueueService
  ) {}

  async findAll() {
    return this.customerRepo.find({ order: { lastInteraction: 'DESC' } });
  }

  async findOne(id: string) {
    return this.customerRepo.findOne({ where: { id } });
  }

  async createOrUpdate(data: Partial<Customer>) {
    let customer = await this.customerRepo.findOne({ 
        where: [
            { email: data.email },
            { phone: data.phone }
        ] 
    });

    if (customer) {
        Object.assign(customer, data);
        customer.lastInteraction = new Date();
    } else {
        customer = this.customerRepo.create({
            ...data,
            lastInteraction: new Date(),
            createdAt: new Date()
        });
    }

    const saved = await this.customerRepo.save(customer);
    
    // Trigger AI Analysis asynchronously
    await this.queueService.addJob('analyze_customer', { customerId: saved.id });
    
    return saved;
  }

  async updateAiAnalysis(id: string, tags: string[], segment: string, summary: string) {
      await this.customerRepo.update(id, { tags, segment, aiSummary: summary });
  }
}

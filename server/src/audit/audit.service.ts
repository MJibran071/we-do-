
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepo: Repository<AuditLog>,
  ) {}

  async log(action: string, resource: string, userId?: string, details?: any, ipAddress?: string) {
    const log = this.auditRepo.create({
      action,
      resource,
      userId,
      details,
      ipAddress,
    });
    return this.auditRepo.save(log);
  }

  async getLogs(limit = 50) {
    return this.auditRepo.find({
      order: { timestamp: 'DESC' },
      take: limit,
    });
  }
}


import { Injectable, OnModuleInit, Logger, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Booking } from './booking.entity';
import { MaintenanceIssue } from './maintenance.entity';
import { AiTool } from '../agent/ai-tool.decorator';
import { Type } from '@google/genai';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

export { Booking } from './booking.entity';
export { MaintenanceIssue } from './maintenance.entity';

@Injectable()
export class OperationsService implements OnModuleInit {
  private readonly logger = new Logger(OperationsService.name);
  private redis: Redis;

  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
    @InjectRepository(MaintenanceIssue)
    private maintenanceRepo: Repository<MaintenanceIssue>,
    private eventEmitter: EventEmitter2,
    private configService: ConfigService
  ) {
      this.redis = new Redis(this.configService.get<string>('REDIS_URI'));
  }

  async onModuleInit() {
      await this.initSeed();
  }

  private async initSeed() {
      const count = await this.bookingRepo.count();
      if (count === 0) {
          const now = new Date();
          const booking = this.bookingRepo.create({
              id: 'b1', 
              guestName: 'Sarah Jenkins',
              checkIn: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
              checkOut: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4),
              status: 'Confirmed', 
              totalPrice: 450, 
              platform: 'Airbnb', 
              cleaningStatus: 'Scheduled'
          });
          await this.bookingRepo.save(booking);
      }
  }

  @AiTool({
    description: "Get all current bookings",
    parameters: { type: Type.OBJECT, properties: {} }
  })
  async getBookings(): Promise<Booking[]> {
    return this.bookingRepo.find({ order: { checkIn: 'ASC' } });
  }

  @AiTool({
    description: "Create a new booking with conflict check",
    parameters: { type: Type.OBJECT, properties: {} }
  })
  async createBooking(data: Partial<Booking>): Promise<Booking> {
      const resourceId = data.apartmentId || data.restaurantId || 'global';
      const lockKey = `lock:booking:${resourceId}:${new Date(data.checkIn).toISOString().split('T')[0]}`;
      
      // Distributed Lock: SET NX PX
      const acquired = await this.redis.set(lockKey, 'locked', 'PX', 5000, 'NX');
      
      if (!acquired) {
          throw new ConflictException('Booking conflict: Resource locked by another process.');
      }

      try {
          // Double check database for overlapping dates
          const overlap = await this.bookingRepo.createQueryBuilder('b')
            .where('b.apartmentId = :aptId OR b.restaurantId = :restId', { aptId: data.apartmentId, restId: data.restaurantId })
            .andWhere('b.checkIn < :end AND b.checkOut > :start', { start: data.checkIn, end: data.checkOut })
            .getOne();

          if (overlap) {
              throw new ConflictException('Booking conflict: Dates overlap with existing booking.');
          }

          const booking = this.bookingRepo.create({
              id: `b-${Date.now()}`,
              ...data,
              status: 'Confirmed'
          });
          const saved = await this.bookingRepo.save(booking);
          this.eventEmitter.emit('booking.created', saved);
          return saved;
      } finally {
          await this.redis.del(lockKey);
      }
  }

  @AiTool({
    description: "Get all maintenance issues",
    parameters: { type: Type.OBJECT, properties: {} }
  })
  async getMaintenanceIssues(): Promise<MaintenanceIssue[]> {
    return this.maintenanceRepo.find({ order: { reportedAt: 'DESC' } });
  }

  @AiTool({
    description: "Create a new maintenance issue ticket",
    parameters: {
      type: Type.OBJECT,
      properties: {
        issue: { type: Type.STRING, description: "Description of the maintenance problem" },
        location: { type: Type.STRING, description: "Location where the issue is occurring" },
        priority: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] }
      },
      required: ['issue']
    }
  })
  async createMaintenanceIssue(issueData: Partial<MaintenanceIssue>): Promise<MaintenanceIssue> {
    const newIssue = this.maintenanceRepo.create({
      id: `maint-${Date.now()}`,
      issue: issueData.issue || 'Reported Issue',
      location: issueData.location || 'General',
      priority: issueData.priority || 'Medium',
      status: 'Open',
      ...issueData,
      reportedAt: new Date()
    });
    const saved = await this.maintenanceRepo.save(newIssue);
    
    this.eventEmitter.emit('maintenance.created', saved);
    
    return saved;
  }

  async updateMaintenanceStatus(id: string, status: string, assignedTo?: string) {
    const updates: any = { status };
    if (assignedTo) updates.assignedTo = assignedTo;
    await this.maintenanceRepo.update(id, updates);
    const updated = await this.maintenanceRepo.findOne({ where: { id } });
    
    this.eventEmitter.emit('maintenance.updated', updated);
    
    return updated;
  }
}

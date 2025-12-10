
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shift } from './shift.entity';
import { OperationsService } from '../operations/operations.service';
import { GeminiService } from '../gemini/gemini.service';

@Injectable()
export class HrService {
  constructor(
    @InjectRepository(Shift)
    private shiftRepo: Repository<Shift>,
    private readonly operationsService: OperationsService,
    private readonly geminiService: GeminiService
  ) {}

  async getShifts() {
    return this.shiftRepo.find({ order: { startTime: 'ASC' } });
  }

  async createShift(data: Partial<Shift>) {
    const shift = this.shiftRepo.create(data);
    return this.shiftRepo.save(shift);
  }

  async generateSmartSchedule(startDate: string, endDate: string) {
    // 1. Get Demand Data
    const bookings = await this.operationsService.getBookings();
    
    // Filter bookings in range
    const start = new Date(startDate);
    const end = new Date(endDate);
    const relevantBookings = bookings.filter(b => 
        new Date(b.checkIn) >= start && new Date(b.checkIn) <= end
    );

    // 2. Ask AI to plan shifts
    const schedule = await this.geminiService.generateStaffSchedule(relevantBookings, start, end);

    // 3. Save Shifts
    const shifts = [];
    for (const s of schedule) {
        const shift = this.shiftRepo.create({
            role: s.role,
            startTime: new Date(s.start),
            endTime: new Date(s.end),
            employeeName: 'Unassigned', // To be filled by manager
            status: 'Open'
        });
        shifts.push(await this.shiftRepo.save(shift));
    }

    return shifts;
  }
}

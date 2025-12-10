
import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { HrService } from './hr.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('hr')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class HrController {
  constructor(private readonly hrService: HrService) {}

  @Get('shifts')
  async getShifts() {
    return this.hrService.getShifts();
  }

  @Post('shifts')
  @Roles('Admin', 'Manager')
  async createShift(@Body() body: any) {
    return this.hrService.createShift(body);
  }

  @Post('generate-schedule')
  @Roles('Admin', 'Manager')
  async generateSchedule(@Body() body: { start: string; end: string }) {
    return this.hrService.generateSmartSchedule(body.start, body.end);
  }
}


import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('reports')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('financial')
  @Roles('Admin', 'Owner')
  async getFinancialReport(@Query('start') start: string, @Query('end') end: string) {
      const url = await this.reportsService.generateFinancialPDF(new Date(start), new Date(end));
      return { url };
  }

  @Get('bookings')
  @Roles('Admin', 'Owner', 'Agent')
  async getBookingsCsv() {
      const url = await this.reportsService.generateBookingsCSV();
      return { url };
  }
}

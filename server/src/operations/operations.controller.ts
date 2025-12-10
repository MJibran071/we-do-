
import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { OperationsService, MaintenanceIssue } from './operations.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('operations')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Get('bookings')
  @Roles('Admin', 'Agent', 'Owner')
  async getBookings() {
    return this.operationsService.getBookings();
  }

  @Get('maintenance')
  @Roles('Admin', 'Agent', 'Maintenance', 'Owner')
  async getMaintenanceIssues() {
    return this.operationsService.getMaintenanceIssues();
  }

  @Post('maintenance')
  @Roles('Admin', 'Agent', 'Maintenance')
  async createTicket(@Body() body: Partial<MaintenanceIssue>) {
    return this.operationsService.createMaintenanceIssue(body);
  }

  @Patch('maintenance/:id')
  @Roles('Admin', 'Maintenance') // Agents usually report, Maintenance resolves
  async updateTicket(
    @Param('id') id: string, 
    @Body() body: { status: MaintenanceIssue['status'], assignedTo?: string }
  ) {
    return this.operationsService.updateMaintenanceStatus(id, body.status, body.assignedTo);
  }
}

import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HealthcareService } from './healthcare.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('healthcare')
@Controller('api/healthcare')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class HealthcareController {
  constructor(private readonly healthcareService: HealthcareService) {}

  // ==================== PRACTICES ====================

  @Post('practices')
  @ApiOperation({ summary: 'Create a new practice' })
  @ApiResponse({ status: 201, description: 'Practice created successfully' })
  async createPractice(@Request() req, @Body() data: any) {
    return this.healthcareService.createPractice(req.user.id, data);
  }

  @Get('practices')
  @ApiOperation({ summary: 'Get all practices for user' })
  @ApiResponse({ status: 200, description: 'Returns all practices' })
  async getPractices(@Request() req) {
    return this.healthcareService.getPractices(req.user.id);
  }

  @Get('practices/:id')
  @ApiOperation({ summary: 'Get practice by ID' })
  @ApiResponse({ status: 200, description: 'Returns practice details' })
  async getPractice(@Param('id') id: string, @Request() req) {
    return this.healthcareService.getPractice(id, req.user.id);
  }

  @Put('practices/:id')
  @ApiOperation({ summary: 'Update practice' })
  @ApiResponse({ status: 200, description: 'Practice updated successfully' })
  async updatePractice(@Param('id') id: string, @Request() req, @Body() data: any) {
    return this.healthcareService.updatePractice(id, req.user.id, data);
  }

  @Get('practices/:id/stats')
  @ApiOperation({ summary: 'Get practice statistics' })
  @ApiResponse({ status: 200, description: 'Returns practice stats' })
  async getPracticeStats(@Param('id') id: string, @Request() req) {
    return this.healthcareService.getPracticeStats(id, req.user.id);
  }

  // ==================== PATIENTS ====================

  @Post('practices/:practiceId/patients')
  @ApiOperation({ summary: 'Create a new patient' })
  @ApiResponse({ status: 201, description: 'Patient created successfully' })
  async createPatient(@Param('practiceId') practiceId: string, @Request() req, @Body() data: any) {
    return this.healthcareService.createPatient(practiceId, req.user.id, data);
  }

  @Get('practices/:practiceId/patients')
  @ApiOperation({ summary: 'Get all patients for practice' })
  @ApiResponse({ status: 200, description: 'Returns all patients' })
  async getPatients(@Param('practiceId') practiceId: string, @Request() req) {
    return this.healthcareService.getPatients(practiceId, req.user.id);
  }

  @Get('practices/:practiceId/patients/:id')
  @ApiOperation({ summary: 'Get patient by ID' })
  @ApiResponse({ status: 200, description: 'Returns patient details' })
  async getPatient(@Param('practiceId') practiceId: string, @Param('id') id: string, @Request() req) {
    return this.healthcareService.getPatient(id, practiceId, req.user.id);
  }

  @Put('practices/:practiceId/patients/:id')
  @ApiOperation({ summary: 'Update patient' })
  @ApiResponse({ status: 200, description: 'Patient updated successfully' })
  async updatePatient(@Param('practiceId') practiceId: string, @Param('id') id: string, @Request() req, @Body() data: any) {
    return this.healthcareService.updatePatient(id, practiceId, req.user.id, data);
  }

  // ==================== APPOINTMENTS ====================

  @Post('practices/:practiceId/appointments')
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({ status: 201, description: 'Appointment created successfully' })
  async createAppointment(@Param('practiceId') practiceId: string, @Request() req, @Body() data: any) {
    return this.healthcareService.createAppointment(practiceId, req.user.id, data);
  }

  @Get('practices/:practiceId/appointments')
  @ApiOperation({ summary: 'Get appointments for practice' })
  @ApiResponse({ status: 200, description: 'Returns appointments' })
  async getAppointments(
    @Param('practiceId') practiceId: string,
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.healthcareService.getAppointments(practiceId, req.user.id, start, end);
  }

  @Put('practices/:practiceId/appointments/:id')
  @ApiOperation({ summary: 'Update appointment' })
  @ApiResponse({ status: 200, description: 'Appointment updated successfully' })
  async updateAppointment(@Param('practiceId') practiceId: string, @Param('id') id: string, @Request() req, @Body() data: any) {
    return this.healthcareService.updateAppointment(id, practiceId, req.user.id, data);
  }

  // ==================== PRESCRIPTIONS ====================

  @Post('practices/:practiceId/appointments/:appointmentId/prescriptions')
  @ApiOperation({ summary: 'Create a prescription' })
  @ApiResponse({ status: 201, description: 'Prescription created successfully' })
  async createPrescription(
    @Param('practiceId') practiceId: string,
    @Param('appointmentId') appointmentId: string,
    @Request() req,
    @Body() data: any,
  ) {
    return this.healthcareService.createPrescription(appointmentId, practiceId, req.user.id, data);
  }

  @Get('practices/:practiceId/appointments/:appointmentId/prescriptions')
  @ApiOperation({ summary: 'Get prescriptions for appointment' })
  @ApiResponse({ status: 200, description: 'Returns prescriptions' })
  async getPrescriptions(
    @Param('practiceId') practiceId: string,
    @Param('appointmentId') appointmentId: string,
    @Request() req,
  ) {
    return this.healthcareService.getPrescriptions(appointmentId, practiceId, req.user.id);
  }

  // ==================== LAB ORDERS ====================

  @Post('practices/:practiceId/appointments/:appointmentId/lab-orders')
  @ApiOperation({ summary: 'Create a lab order' })
  @ApiResponse({ status: 201, description: 'Lab order created successfully' })
  async createLabOrder(
    @Param('practiceId') practiceId: string,
    @Param('appointmentId') appointmentId: string,
    @Request() req,
    @Body() data: any,
  ) {
    return this.healthcareService.createLabOrder(appointmentId, practiceId, req.user.id, data);
  }

  @Put('practices/:practiceId/lab-orders/:id')
  @ApiOperation({ summary: 'Update lab order' })
  @ApiResponse({ status: 200, description: 'Lab order updated successfully' })
  async updateLabOrder(@Param('practiceId') practiceId: string, @Param('id') id: string, @Request() req, @Body() data: any) {
    return this.healthcareService.updateLabOrder(id, practiceId, req.user.id, data);
  }
}

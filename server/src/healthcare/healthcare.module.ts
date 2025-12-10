import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthcareController } from './healthcare.controller';
import { HealthcareService } from './healthcare.service';
import { Practice } from './practice.entity';
import { Patient } from './patient.entity';
import { Appointment } from './appointment.entity';
import { MedicalRecord } from './medical-record.entity';
import { Prescription } from './prescription.entity';
import { LabOrder } from './lab-order.entity';
import { AuditModule } from '../audit/audit.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Practice,
      Patient,
      Appointment,
      MedicalRecord,
      Prescription,
      LabOrder,
    ]),
    AuditModule,
    NotificationsModule,
  ],
  controllers: [HealthcareController],
  providers: [HealthcareService],
  exports: [HealthcareService],
})
export class HealthcareModule {}

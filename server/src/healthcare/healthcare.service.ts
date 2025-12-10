import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan, MoreThan } from 'typeorm';
import { Practice } from './practice.entity';
import { Patient } from './patient.entity';
import { Appointment, AppointmentStatus, AppointmentType } from './appointment.entity';
import { MedicalRecord } from './medical-record.entity';
import { Prescription, PrescriptionStatus } from './prescription.entity';
import { LabOrder, LabOrderStatus } from './lab-order.entity';
import { AuditService } from '../audit/audit.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class HealthcareService {
  constructor(
    @InjectRepository(Practice)
    private practiceRepository: Repository<Practice>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(MedicalRecord)
    private medicalRecordRepository: Repository<MedicalRecord>,
    @InjectRepository(Prescription)
    private prescriptionRepository: Repository<Prescription>,
    @InjectRepository(LabOrder)
    private labOrderRepository: Repository<LabOrder>,
    private auditService: AuditService,
    private notificationsService: NotificationsService,
  ) { }

  // ==================== PRACTICES ====================

  async createPractice(userId: string, data: Partial<Practice>): Promise<Practice> {
    const practice = this.practiceRepository.create({
      ...data,
      userId,
    });
    const saved = await this.practiceRepository.save(practice);
    await this.auditService.log('practice.created', 'practice', userId, { practiceId: saved.id });
    return saved;
  }

  async getPractices(userId: string): Promise<Practice[]> {
    return this.practiceRepository.find({
      where: { userId, isActive: true },
      relations: ['patients', 'appointments'],
    });
  }

  async getPractice(id: string, userId: string): Promise<Practice> {
    const practice = await this.practiceRepository.findOne({
      where: { id, userId },
      relations: ['patients', 'appointments'],
    });
    if (!practice) {
      throw new NotFoundException('Practice not found');
    }
    return practice;
  }

  async updatePractice(id: string, userId: string, data: Partial<Practice>): Promise<Practice> {
    const practice = await this.getPractice(id, userId);
    Object.assign(practice, data);
    const updated = await this.practiceRepository.save(practice);
    await this.auditService.log('practice.updated', 'practice', userId, { practiceId: id });
    return updated;
  }

  // ==================== PATIENTS ====================

  async createPatient(practiceId: string, userId: string, data: Partial<Patient>): Promise<Patient> {
    await this.getPractice(practiceId, userId); // Verify ownership

    const patient = this.patientRepository.create({
      ...data,
      practiceId,
    });
    const saved = await this.patientRepository.save(patient);

    // HIPAA Audit Log
    await this.auditService.log('patient.created', 'patient', userId, {
      practiceId,
      patientId: saved.id,
      patientName: saved.name,
    });

    return saved;
  }

  async getPatients(practiceId: string, userId: string): Promise<Patient[]> {
    await this.getPractice(practiceId, userId); // Verify ownership

    const patients = await this.patientRepository.find({
      where: { practiceId, isActive: true },
      relations: ['appointments', 'medicalRecords'],
      order: { createdAt: 'DESC' },
    });

    // HIPAA Audit Log
    await this.auditService.log('patients.accessed', 'patient', userId, {
      practiceId,
      count: patients.length,
    });

    return patients;
  }

  async getPatient(id: string, practiceId: string, userId: string): Promise<Patient> {
    await this.getPractice(practiceId, userId); // Verify ownership

    const patient = await this.patientRepository.findOne({
      where: { id, practiceId },
      relations: ['appointments', 'medicalRecords'],
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // HIPAA Audit Log
    await this.auditService.log('patient.accessed', 'patient', userId, {
      practiceId,
      patientId: id,
      patientName: patient.name,
    });

    return patient;
  }

  async updatePatient(id: string, practiceId: string, userId: string, data: Partial<Patient>): Promise<Patient> {
    const patient = await this.getPatient(id, practiceId, userId);
    Object.assign(patient, data);
    const updated = await this.patientRepository.save(patient);

    // HIPAA Audit Log
    await this.auditService.log('patient.updated', 'patient', userId, {
      practiceId,
      patientId: id,
      changes: Object.keys(data),
    });

    return updated;
  }

  // ==================== APPOINTMENTS ====================

  async createAppointment(practiceId: string, userId: string, data: Partial<Appointment>): Promise<Appointment> {
    await this.getPractice(practiceId, userId); // Verify ownership

    // Validate patient belongs to practice
    const patient = await this.patientRepository.findOne({
      where: { id: data.patientId, practiceId },
    });
    if (!patient) {
      throw new BadRequestException('Patient not found in this practice');
    }

    // Check for conflicts
    const conflicts = await this.appointmentRepository.count({
      where: {
        practiceId,
        startTime: Between(data.startTime, data.endTime),
        status: AppointmentStatus.CONFIRMED,
      },
    });

    if (conflicts > 0) {
      throw new BadRequestException('Time slot already booked');
    }

    const appointment = this.appointmentRepository.create({
      ...data,
      practiceId,
    });
    const saved = await this.appointmentRepository.save(appointment);

    // Update patient's next appointment
    patient.nextAppointment = saved.startTime;
    await this.patientRepository.save(patient);

    // Send confirmation
    await this.notificationsService.sendEmail(
      patient.email,
      'Appointment Confirmed',
      `Your appointment is scheduled for ${saved.startTime.toLocaleString()}`,
    );

    await this.auditService.log('appointment.created', 'appointment', userId, {
      practiceId,
      appointmentId: saved.id,
      patientId: patient.id,
    });

    return saved;
  }

  async getAppointments(practiceId: string, userId: string, startDate?: Date, endDate?: Date): Promise<Appointment[]> {
    await this.getPractice(practiceId, userId);

    const where: any = { practiceId };
    if (startDate && endDate) {
      where.startTime = Between(startDate, endDate);
    }

    return this.appointmentRepository.find({
      where,
      relations: ['patient', 'prescriptions', 'labOrders'],
      order: { startTime: 'ASC' },
    });
  }

  async updateAppointment(id: string, practiceId: string, userId: string, data: Partial<Appointment>): Promise<Appointment> {
    await this.getPractice(practiceId, userId);

    const appointment = await this.appointmentRepository.findOne({
      where: { id, practiceId },
      relations: ['patient'],
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    Object.assign(appointment, data);
    const updated = await this.appointmentRepository.save(appointment);

    // Notify patient of changes
    if (data.startTime || data.status === AppointmentStatus.CANCELLED) {
      await this.notificationsService.sendEmail(
        appointment.patient.email,
        'Appointment Update',
        `Your appointment has been updated.`,
      );
    }

    await this.auditService.log('appointment.updated', 'appointment', userId, {
      practiceId,
      appointmentId: id,
      changes: Object.keys(data),
    });

    return updated;
  }

  // ==================== PRESCRIPTIONS ====================

  async createPrescription(appointmentId: string, practiceId: string, userId: string, data: Partial<Prescription>): Promise<Prescription> {
    await this.getPractice(practiceId, userId);

    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId, practiceId },
      relations: ['patient'],
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    const prescription = this.prescriptionRepository.create({
      ...data,
      appointmentId,
    });
    const saved = await this.prescriptionRepository.save(prescription);

    // Notify patient
    await this.notificationsService.sendEmail(
      appointment.patient.email,
      'Prescription Ready',
      `Your prescription for ${saved.medication} has been sent to ${saved.pharmacy || 'your pharmacy'}.`,
    );

    await this.auditService.log('prescription.created', 'prescription', userId, {
      practiceId,
      appointmentId,
      prescriptionId: saved.id,
      medication: saved.medication,
    });

    return saved;
  }

  async getPrescriptions(appointmentId: string, practiceId: string, userId: string): Promise<Prescription[]> {
    await this.getPractice(practiceId, userId);

    return this.prescriptionRepository.find({
      where: { appointmentId },
      order: { createdAt: 'DESC' },
    });
  }

  // ==================== LAB ORDERS ====================

  async createLabOrder(appointmentId: string, practiceId: string, userId: string, data: Partial<LabOrder>): Promise<LabOrder> {
    await this.getPractice(practiceId, userId);

    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId, practiceId },
      relations: ['patient'],
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    const labOrder = this.labOrderRepository.create({
      ...data,
      appointmentId,
    });
    const saved = await this.labOrderRepository.save(labOrder);

    await this.auditService.log('lab_order.created', 'lab_order', userId, {
      practiceId,
      appointmentId,
      labOrderId: saved.id,
      testName: saved.testName,
    });

    return saved;
  }

  async updateLabOrder(id: string, practiceId: string, userId: string, data: Partial<LabOrder>): Promise<LabOrder> {
    await this.getPractice(practiceId, userId);

    const labOrder = await this.labOrderRepository.findOne({
      where: { id },
      relations: ['appointment', 'appointment.patient'],
    });

    if (!labOrder) {
      throw new NotFoundException('Lab order not found');
    }

    Object.assign(labOrder, data);
    const updated = await this.labOrderRepository.save(labOrder);

    // Notify patient when results are ready
    if (data.status === LabOrderStatus.COMPLETED && !labOrder.resultsNotified) {
      await this.notificationsService.sendEmail(
        labOrder.appointment.patient.email,
        'Lab Results Ready',
        `Your lab results for ${labOrder.testName} are now available.`,
      );
      updated.resultsNotified = true;
      await this.labOrderRepository.save(updated);
    }

    await this.auditService.log('lab_order.updated', 'lab_order', userId, {
      practiceId,
      labOrderId: id,
      changes: Object.keys(data),
    });

    return updated;
  }

  // ==================== REMINDERS ====================

  async sendAppointmentReminders(): Promise<void> {
    // Find appointments in next 24 hours that haven't been reminded
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = await this.appointmentRepository.find({
      where: {
        startTime: Between(new Date(), tomorrow),
        reminderSent: false,
        status: AppointmentStatus.CONFIRMED,
      },
      relations: ['patient', 'practice'],
    });

    for (const appointment of appointments) {
      await this.notificationsService.sendEmail(
        appointment.patient.email,
        'Appointment Reminder',
        `Reminder: You have an appointment tomorrow at ${appointment.startTime.toLocaleTimeString()} with ${appointment.practice.name}.`,
      );

      appointment.reminderSent = true;
      appointment.reminderSentAt = new Date();
      await this.appointmentRepository.save(appointment);
    }
  }

  // ==================== ANALYTICS ====================

  async getPracticeStats(practiceId: string, userId: string) {
    await this.getPractice(practiceId, userId);

    const totalPatients = await this.patientRepository.count({
      where: { practiceId, isActive: true },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointments = await this.appointmentRepository.count({
      where: {
        practiceId,
        startTime: Between(today, tomorrow),
      },
    });

    const pendingPrescriptions = await this.prescriptionRepository.count({
      where: { status: PrescriptionStatus.PENDING },
    });

    const pendingLabOrders = await this.labOrderRepository.count({
      where: { status: LabOrderStatus.ORDERED },
    });

    return {
      totalPatients,
      todayAppointments,
      pendingPrescriptions,
      pendingLabOrders,
    };
  }
}

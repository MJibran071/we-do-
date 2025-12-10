import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Practice } from './practice.entity';
import { Patient } from './patient.entity';
import { Prescription } from './prescription.entity';
import { LabOrder } from './lab-order.entity';

export enum AppointmentType {
  CONSULTATION = 'Consultation',
  FOLLOW_UP = 'Follow-up',
  PROCEDURE = 'Procedure',
  CHECKUP = 'Checkup',
  EMERGENCY = 'Emergency',
  TELEMEDICINE = 'Telemedicine',
}

export enum AppointmentStatus {
  SCHEDULED = 'Scheduled',
  CONFIRMED = 'Confirmed',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  NO_SHOW = 'No Show',
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  practiceId: string;

  @ManyToOne(() => Practice, practice => practice.appointments)
  @JoinColumn({ name: 'practiceId' })
  practice: Practice;

  @Column()
  patientId: string;

  @ManyToOne(() => Patient, patient => patient.appointments)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column({ type: 'enum', enum: AppointmentType })
  appointmentType: AppointmentType;

  @Column({ type: 'enum', enum: AppointmentStatus, default: AppointmentStatus.SCHEDULED })
  status: AppointmentStatus;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({ nullable: true })
  provider: string; // Doctor/Practitioner name

  @Column({ type: 'text', nullable: true })
  chiefComplaint: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'json', nullable: true })
  insuranceClaim: {
    claimNumber?: string;
    status: 'Pending' | 'Approved' | 'Denied' | 'Processing';
    amount?: number;
  };

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  copay: number;

  @Column({ default: false })
  reminderSent: boolean;

  @Column({ type: 'timestamp', nullable: true })
  reminderSentAt: Date;

  @OneToMany(() => Prescription, prescription => prescription.appointment)
  prescriptions: Prescription[];

  @OneToMany(() => LabOrder, labOrder => labOrder.appointment)
  labOrders: LabOrder[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

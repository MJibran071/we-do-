import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Appointment } from './appointment.entity';

export enum LabOrderStatus {
  ORDERED = 'Ordered',
  COLLECTED = 'Collected',
  PROCESSING = 'Processing',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

@Entity('lab_orders')
export class LabOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  appointmentId: string;

  @ManyToOne(() => Appointment, appointment => appointment.labOrders)
  @JoinColumn({ name: 'appointmentId' })
  appointment: Appointment;

  @Column()
  testName: string;

  @Column({ type: 'text', nullable: true })
  testCode: string;

  @Column({ type: 'enum', enum: LabOrderStatus, default: LabOrderStatus.ORDERED })
  status: LabOrderStatus;

  @Column({ type: 'text', nullable: true })
  results: string;

  @Column({ type: 'timestamp', nullable: true })
  collectedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ default: false })
  resultsNotified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

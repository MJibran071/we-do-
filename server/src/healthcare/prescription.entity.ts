import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Appointment } from './appointment.entity';

export enum PrescriptionStatus {
  PENDING = 'Pending',
  SENT = 'Sent',
  FILLED = 'Filled',
  CANCELLED = 'Cancelled',
}

@Entity('prescriptions')
export class Prescription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  appointmentId: string;

  @ManyToOne(() => Appointment, appointment => appointment.prescriptions)
  @JoinColumn({ name: 'appointmentId' })
  appointment: Appointment;

  @Column()
  medication: string;

  @Column()
  dosage: string;

  @Column()
  frequency: string;

  @Column()
  duration: string;

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @Column({ type: 'enum', enum: PrescriptionStatus, default: PrescriptionStatus.PENDING })
  status: PrescriptionStatus;

  @Column({ nullable: true })
  pharmacy: string;

  @Column({ type: 'int', default: 0 })
  refillsRemaining: number;

  @CreateDateColumn()
  createdAt: Date;
}

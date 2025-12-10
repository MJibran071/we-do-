import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from './patient.entity';

@Entity('medical_records')
export class MedicalRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  patientId: string;

  @ManyToOne(() => Patient, patient => patient.medicalRecords)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column({ type: 'date' })
  visitDate: Date;

  @Column()
  provider: string;

  @Column({ type: 'text', nullable: true })
  diagnosis: string;

  @Column({ type: 'text', nullable: true })
  treatment: string;

  @Column('simple-array', { nullable: true })
  prescriptions: string[];

  @Column('simple-array', { nullable: true })
  labResults: string[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: false })
  followUpRequired: boolean;

  @Column({ type: 'date', nullable: true })
  followUpDate: Date;

  @CreateDateColumn()
  createdAt: Date;
}

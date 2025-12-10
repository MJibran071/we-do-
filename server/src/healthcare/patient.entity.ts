import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Practice } from './practice.entity';
import { Appointment } from './appointment.entity';
import { MedicalRecord } from './medical-record.entity';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  practiceId: string;

  @ManyToOne(() => Practice, practice => practice.patients)
  @JoinColumn({ name: 'practiceId' })
  practice: Practice;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  insuranceProvider: string;

  @Column({ nullable: true })
  insuranceId: string;

  @Column('simple-array', { nullable: true })
  allergies: string[];

  @Column('simple-array', { nullable: true })
  medications: string[];

  @Column('simple-array', { nullable: true })
  medicalHistory: string[];

  @Column({ type: 'json', nullable: true })
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };

  @Column({ type: 'timestamp', nullable: true })
  lastVisit: Date;

  @Column({ type: 'timestamp', nullable: true })
  nextAppointment: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: true })
  marketingConsent: boolean;

  @OneToMany(() => Appointment, appointment => appointment.patient)
  appointments: Appointment[];

  @OneToMany(() => MedicalRecord, record => record.patient)
  medicalRecords: MedicalRecord[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

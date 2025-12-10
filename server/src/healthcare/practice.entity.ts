import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Patient } from './patient.entity';
import { Appointment } from './appointment.entity';

@Entity('practices')
export class Practice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string; // Owner of the practice

  @Column()
  name: string;

  @Column()
  specialty: string; // 'General Practice', 'Dental', 'Physical Therapy', etc.

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  licenseNumber: string;

  @Column({ nullable: true })
  npiNumber: string; // National Provider Identifier

  @Column('simple-array', { nullable: true })
  acceptedInsurance: string[];

  @Column({ type: 'text', nullable: true })
  officeHours: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Patient, patient => patient.practice)
  patients: Patient[];

  @OneToMany(() => Appointment, appointment => appointment.practice)
  appointments: Appointment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: string; // 'Lock', 'Thermostat', 'Sensor'

  @Column({ nullable: true })
  entityId: string; // ID of the Apartment or Restaurant

  @Column({ default: 'Online' })
  status: string;

  @Column('int', { default: 100 })
  batteryLevel: number;

  @Column({ type: 'jsonb', nullable: true })
  currentState: any; // e.g. { locked: true, temp: 72 }

  @Column({ type: 'jsonb', nullable: true })
  config: any; // e.g. { autoLockDelay: 60 }

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  lastSeen: Date;
}

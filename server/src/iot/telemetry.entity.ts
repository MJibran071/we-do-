
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity()
export class Telemetry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  deviceId: string;

  @Column({ type: 'jsonb' })
  data: any;

  @CreateDateColumn()
  timestamp: Date;
}

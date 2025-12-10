
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class CallSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  externalId: string; // Twilio Call SID

  @Column()
  callerNumber: string;

  @Column()
  direction: 'inbound' | 'outbound';

  @Column({ default: 'active' })
  status: 'active' | 'completed' | 'failed';

  @Column({ type: 'text', nullable: true })
  transcript: string;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ nullable: true })
  recordingUrl: string;

  @CreateDateColumn()
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime: Date;
}


import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Message } from './message.entity';

@Entity()
export class Thread {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'jsonb' })
  participants: any[];

  @Column({ type: 'jsonb', default: {} })
  metadata: {
    summary?: string;
    sentiment?: string;
    priority?: string;
    platform?: string;
    [key: string]: any;
  };

  @OneToMany(() => Message, (message) => message.thread, { cascade: true })
  messages: Message[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

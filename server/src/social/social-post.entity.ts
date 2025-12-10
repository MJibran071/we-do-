
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class SocialPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  platform: string; // 'Instagram', 'LinkedIn', 'Twitter'

  @Column('text')
  content: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: 'timestamp' })
  scheduledFor: Date;

  @Column({ default: 'Draft' })
  status: string; // 'Draft', 'Scheduled', 'Published'

  @CreateDateColumn()
  createdAt: Date;
}

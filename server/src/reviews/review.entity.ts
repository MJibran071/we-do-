
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  author: string;

  @Column({ nullable: true })
  avatar: string;

  @Column('int')
  rating: number; // 1-5

  @Column('text')
  content: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column()
  platform: string; // 'Airbnb', 'Google', 'Yelp', etc.

  @Column()
  entityId: string; // The apartment or restaurant ID

  @Column({ nullable: true })
  sentiment: string; // 'Positive', 'Negative', etc.

  @Column('text', { nullable: true })
  reply: string;

  @Column({ type: 'timestamp', nullable: true })
  replyDate: Date;

  @Column('simple-array', { nullable: true })
  tags: string[]; // AI extracted tags

  @CreateDateColumn()
  createdAt: Date;
}


import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { PriceSnapshot } from './price-snapshot.entity';

@Entity()
export class Competitor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  websiteUrl: string;

  @Column({ nullable: true })
  businessType: string; // e.g. 'Property', 'Restaurant'

  @Column({ type: 'text', nullable: true })
  strengths: string; // AI Summary

  @Column({ type: 'text', nullable: true })
  weaknesses: string; // AI Summary

  @Column({ type: 'float', nullable: true })
  sentimentScore: number; // 0 to 1

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  lastAnalyzed: Date;

  @OneToMany(() => PriceSnapshot, (snapshot) => snapshot.competitor)
  snapshots: PriceSnapshot[];
}

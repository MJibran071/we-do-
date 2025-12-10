
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalSpend: number;

  @Column({ type: 'int', default: 0 })
  visitCount: number;

  @Column('simple-array', { nullable: true })
  tags: string[]; // e.g. ["VIP", "Vegan", "Big Spender"]

  @Column({ nullable: true })
  segment: string; // "High Value", "At Risk", "New"

  @Column({ type: 'text', nullable: true })
  aiSummary: string; // AI generated persona summary

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  lastInteraction: Date;
}

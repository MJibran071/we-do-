
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity()
export class Budget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // e.g. "Marketing Q1"

  @Column('decimal', { precision: 12, scale: 2 })
  limitAmount: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  spentAmount: number;

  @Column()
  period: 'monthly' | 'quarterly' | 'yearly';

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.budget)
  transactions: Transaction[];
}

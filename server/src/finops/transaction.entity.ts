
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Budget } from './budget.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column()
  type: 'income' | 'expense';

  @Column({ nullable: true })
  category: string; // e.g. 'Utilities', 'Marketing', 'Payroll'

  @Column()
  description: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ default: 'pending' })
  status: 'pending' | 'cleared' | 'flagged';

  @Column({ nullable: true })
  vendor: string;

  @Column({ nullable: true })
  anomalyReason: string; // Populated by AI if flagged

  @ManyToOne(() => Budget, (budget) => budget.transactions, { nullable: true })
  budget: Budget;

  @CreateDateColumn()
  createdAt: Date;
}

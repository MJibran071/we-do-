
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  type: string; // 'Lease', 'Vendor', 'Insurance'

  @Column({ nullable: true })
  vendorName: string;

  @Column({ type: 'date', nullable: true })
  startDate: string;

  @Column({ type: 'date', nullable: true })
  expiryDate: string;

  @Column({ nullable: true })
  renewalTerms: string; // 'Auto-renew', 'Manual'

  @Column({ nullable: true })
  documentUrl: string; // Link to stored PDF

  @Column('decimal', { nullable: true, precision: 10, scale: 2 })
  value: number;

  @Column({ default: 'Active' })
  status: 'Active' | 'Expired' | 'Pending';

  @CreateDateColumn()
  createdAt: Date;
}


import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PricingRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // e.g. "Weekend Surge"

  @Column()
  condition: string; // e.g. "occupancy > 80"

  @Column()
  action: string; // e.g. "increase_by_percent"

  @Column('float')
  value: number; // e.g. 10.0

  @Column({ default: true })
  isActive: boolean;
}

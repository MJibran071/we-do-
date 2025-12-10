
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Competitor } from './competitor.entity';

@Entity()
export class PriceSnapshot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productName: string; // e.g. "Standard Room", "Cheeseburger"

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  currency: string;

  @CreateDateColumn()
  capturedAt: Date;

  @ManyToOne(() => Competitor, (competitor) => competitor.snapshots, { onDelete: 'CASCADE' })
  competitor: Competitor;
}

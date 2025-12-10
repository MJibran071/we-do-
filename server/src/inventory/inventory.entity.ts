
import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class InventoryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  category: string; // e.g. 'Kitchen', 'Toiletries'

  @Column('int')
  quantity: number;

  @Column('int')
  minThreshold: number;

  @Column()
  unit: string; // e.g. 'units', 'kg', 'boxes'

  @Column({ nullable: true })
  supplier: string;

  @Column({ nullable: true })
  supplierEmail: string;

  @UpdateDateColumn()
  lastRestocked: Date;
}

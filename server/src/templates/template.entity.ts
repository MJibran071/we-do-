
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class MessageTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column()
  category: string;

  @Column('simple-array', { nullable: true })
  imageUrls: string[];

  // If null, it's a global template. If set, it belongs to a specific property/restaurant.
  @Column({ nullable: true })
  entityId: string;

  @Column({ nullable: true })
  userId: string; // The creator

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

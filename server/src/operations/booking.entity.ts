
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Booking {
  @PrimaryColumn()
  id: string;

  @Column()
  guestName: string;

  @Column({ type: 'timestamp' })
  checkIn: Date;

  @Column({ type: 'timestamp' })
  checkOut: Date;

  @Column()
  status: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Column()
  platform: string;

  @Column({ nullable: true })
  cleaningStatus: string;

  @Column({ nullable: true })
  apartmentId: string;

  @Column({ nullable: true })
  restaurantId: string;
}

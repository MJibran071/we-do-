
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Shift {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  employeeId: string;

  @Column()
  employeeName: string;

  @Column()
  role: string; // 'Cleaner', 'Server', 'Reception'

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({ default: 'Scheduled' })
  status: string; // 'Scheduled', 'Completed', 'Open'
}

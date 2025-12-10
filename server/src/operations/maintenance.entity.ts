
import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class MaintenanceIssue {
  @PrimaryColumn()
  id: string;

  @Column()
  issue: string;

  @Column()
  location: string;

  @Column()
  priority: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  assignedTo: string;

  @Column({ nullable: true })
  apartmentId: string;

  @Column({ nullable: true })
  restaurantId: string;

  @CreateDateColumn()
  reportedAt: Date;
}


import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Hashed

  @Column({ nullable: true })
  name: string;

  @Column({ default: 'Agent' })
  role: string; // 'Admin', 'Agent', 'Maintenance', 'Owner'

  @Column({ nullable: true })
  avatar: string;

  @Column('simple-json', { nullable: true })
  taskAssignments: {
    drafting: string;
    analysis: string;
    quickReplies: string;
    imageGeneration: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EmailAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  imapHost: string;

  @Column('int')
  imapPort: number;

  @Column()
  smtpHost: string;

  @Column('int')
  smtpPort: number;

  @Column()
  username: string;

  // In production, this MUST be encrypted
  @Column()
  password: string;

  @Column({ default: true })
  secure: boolean;

  @Column({ default: true })
  isActive: boolean;
}

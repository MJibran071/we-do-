
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class VaultSecret {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string; // The owner of this credential

  @Column()
  integrationId: string; // e.g., 'slack', 'stripe', or a UUID of a custom integration

  @Column()
  keyName: string; // e.g., 'api_key', 'client_secret'

  @Column('text')
  encryptedValue: string;

  @Column('text')
  iv: string; // Initialization Vector for AES decryption

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

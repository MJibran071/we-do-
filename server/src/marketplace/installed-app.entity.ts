
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { MarketplaceApp } from './marketplace-app.entity';

@Entity()
export class InstalledApp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  appId: string;

  @Column({ default: 'active' })
  status: string; // 'active', 'disconnected', 'error'

  @Column({ type: 'jsonb', default: {} })
  config: any; // Non-sensitive configuration values

  @CreateDateColumn()
  installedAt: Date;

  @ManyToOne(() => MarketplaceApp)
  @JoinColumn({ name: 'appId' })
  appDetails: MarketplaceApp;
}

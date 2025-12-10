
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class MarketplaceApp {
  @PrimaryColumn()
  id: string; // e.g. 'airbnb', 'stripe'

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  category: string; // 'Channel Manager', 'Messaging', 'Operations', etc.

  @Column()
  logoUrl: string;

  @Column()
  authType: string; // 'oauth2', 'apikey', 'basic', 'none'

  @Column({ type: 'jsonb', default: [] })
  configSchema: any; // Schema definition for frontend form generation
}

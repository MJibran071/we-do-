
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class AiModelConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // e.g. "Gemini 1.5 Pro - Production"

  @Column()
  provider: string; // 'Google Gemini', 'OpenAI', 'Anthropic', 'Custom'

  @Column()
  modelId: string; // e.g. 'gemini-1.5-pro-latest'

  @Column({ nullable: true })
  apiKey: string; // Store encrypted in production

  @Column({ nullable: true })
  endpoint: string; // For custom providers

  @Column('simple-array', { nullable: true })
  capabilities: string[]; // ['text', 'image', 'voice', 'function_calling']

  @Column('float', { default: 0 })
  costPer1kTokens: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

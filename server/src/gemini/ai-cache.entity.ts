
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class AiCache {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  prompt: string;

  @Column('text')
  response: string;

  // Uses pgvector's vector type. Dimension 768 is compatible with text-embedding-004
  @Column({ type: 'vector', length: 768 })
  embedding: number[];

  @CreateDateColumn()
  createdAt: Date;
}

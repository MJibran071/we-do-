
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class VectorDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column()
  category: string;

  // Uses pgvector's vector type. Dimension 768 is compatible with text-embedding-004
  @Column({ type: 'vector', length: 768 })
  embedding: number[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}

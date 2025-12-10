
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class AppAction {
  @PrimaryColumn()
  id: string; // e.g., 'slack.post_message'

  @Column()
  appName: string; // 'slack'

  @Column()
  actionName: string; // 'Post Message'

  @Column()
  description: string;

  @Column()
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';

  @Column()
  endpointUrl: string; // e.g. https://slack.com/api/chat.postMessage

  // JSON Schema defining what inputs this action needs
  @Column({ type: 'jsonb' })
  inputSchema: any; 

  @Column({ default: true })
  isActive: boolean;
}

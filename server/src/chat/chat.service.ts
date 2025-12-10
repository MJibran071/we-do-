
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Thread } from './thread.entity';
import { Message } from './message.entity';

export { Message } from './message.entity';
export { Thread } from './thread.entity';

@Injectable()
export class ChatService implements OnModuleInit {
  constructor(
    @InjectRepository(Thread)
    private threadRepo: Repository<Thread>,
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
  ) {}

  async onModuleInit() {
    await this.initSeed();
  }

  private async initSeed() {
    const count = await this.threadRepo.count();
    if (count === 0) {
        const now = new Date();
        const thread = this.threadRepo.create({
            id: 't1',
            participants: [{ id: 'u1', name: 'Sarah Jenkins' }],
            metadata: { platform: 'Airbnb', priority: 'High', summary: 'Check-in time inquiry', sentiment: 'Neutral' },
        });
        await this.threadRepo.save(thread);

        const message = this.messageRepo.create({
            id: 'm1', 
            threadId: 't1',
            senderId: 'u1', 
            content: "Hi! We're driving in a bit early. Is there any way we could check in around 1 PM?",
            timestamp: new Date(now.getTime() - 1000 * 60 * 5), 
            type: 'text'
        });
        await this.messageRepo.save(message);
    }
  }

  async getThread(threadId: string): Promise<Thread | undefined> {
    return this.threadRepo.findOne({
        where: { id: threadId },
        relations: ['messages'],
        order: { messages: { timestamp: 'ASC' } as any }
    });
  }

  async createThread(threadId: string, participants: any[]): Promise<Thread> {
    const thread = this.threadRepo.create({
      id: threadId,
      participants,
      metadata: {}
    });
    return this.threadRepo.save(thread);
  }

  async saveMessage(threadId: string, messageData: Partial<Message>): Promise<Message> {
    let thread = await this.threadRepo.findOne({ where: { id: threadId } });
    if (!thread) {
        thread = await this.createThread(threadId, [{ id: messageData.senderId, name: 'Unknown' }]);
    }

    const message = this.messageRepo.create({
        ...messageData,
        threadId,
        timestamp: new Date()
    } as Message);

    const savedMessage = await this.messageRepo.save(message);
    
    // Update thread updated_at
    await this.threadRepo.update(threadId, { updatedAt: new Date() });
    
    return savedMessage;
  }

  async updateThreadMetadata(threadId: string, updates: Partial<Thread['metadata']>) {
    const thread = await this.threadRepo.findOne({ where: { id: threadId } });
    if (thread) {
      const newMetadata = { ...thread.metadata, ...updates };
      thread.metadata = newMetadata;
      return this.threadRepo.save(thread);
    }
    return null;
  }

  async getAllThreads(): Promise<Thread[]> {
    return this.threadRepo.find({
        relations: ['messages'],
        order: { updatedAt: 'DESC' }
    });
  }

  // --- Full-Text Search ---
  async searchMessages(query: string): Promise<Message[]> {
    // Using Postgres to_tsvector for full-text search
    return this.messageRepo
      .createQueryBuilder('message')
      .where("to_tsvector('english', message.content) @@ plainto_tsquery('english', :query)", { query })
      .orderBy('message.timestamp', 'DESC')
      .getMany();
  }

  // --- Read Receipts ---
  async markThreadAsRead(threadId: string, userId: string) {
    // Update all unread messages in this thread that were NOT sent by this user
    await this.messageRepo
      .createQueryBuilder()
      .update(Message)
      .set({ readAt: new Date() })
      .where("threadId = :threadId", { threadId })
      .andWhere("senderId != :userId", { userId })
      .andWhere("readAt IS NULL")
      .execute();
  }
}

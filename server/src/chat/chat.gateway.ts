
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GeminiService } from '../gemini/gemini.service';
import { ChatService, Message } from './chat.service';
import { QueueService } from '../queue/queue.service';

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : '*';

@WebSocketGateway({
  cors: { origin: allowedOrigins },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private activeUsers = new Map<string, string[]>(); // ThreadId -> SocketIds
  private globalPresence = new Set<string>(); // Connected UserIds

  constructor(
    private readonly geminiService: GeminiService,
    private readonly chatService: ChatService,
    private readonly eventEmitter: EventEmitter2,
    private readonly queueService: QueueService
  ) {
      this.queueService.jobEvents.subscribe(job => {
          if (job.type === 'analyze_sentiment' && job.status === 'completed') {
              this.server.to('admin').emit('job_completed', job);
          }
      });
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
        this.globalPresence.add(userId);
        this.server.emit('global_presence', Array.from(this.globalPresence));
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
        this.globalPresence.delete(userId);
        this.server.emit('global_presence', Array.from(this.globalPresence));
    }

    this.activeUsers.forEach((users, room) => {
        const index = users.indexOf(client.id);
        if (index !== -1) {
            users.splice(index, 1);
            this.server.to(room).emit('presence_update', users);
        }
    });
  }

  @SubscribeMessage('join_thread')
  async handleJoinThread(@MessageBody() threadId: string, @ConnectedSocket() client: Socket) {
    client.join(threadId);
    
    if (!this.activeUsers.has(threadId)) this.activeUsers.set(threadId, []);
    this.activeUsers.get(threadId).push(client.id);
    this.server.to(threadId).emit('presence_update', this.activeUsers.get(threadId));

    const thread = await this.chatService.getThread(threadId);
    return { 
        event: 'joined_thread', 
        data: { 
            threadId, 
            history: thread ? thread.messages : [],
            metadata: thread ? thread.metadata : {}
        } 
    };
  }

  @SubscribeMessage('leave_thread')
  handleLeaveThread(@MessageBody() threadId: string, @ConnectedSocket() client: Socket) {
      client.leave(threadId);
      if (this.activeUsers.has(threadId)) {
          const users = this.activeUsers.get(threadId);
          const idx = users.indexOf(client.id);
          if (idx > -1) users.splice(idx, 1);
          this.server.to(threadId).emit('presence_update', users);
      }
  }

  @SubscribeMessage('mark_read')
  async handleMarkRead(@MessageBody() payload: { threadId: string, userId: string }) {
      await this.chatService.markThreadAsRead(payload.threadId, payload.userId);
      this.server.to(payload.threadId).emit('read_receipt', { 
          threadId: payload.threadId, 
          userId: payload.userId, 
          readAt: new Date() 
      });
  }

  @SubscribeMessage('typing')
  handleTyping(@MessageBody() payload: { threadId: string; isTyping: boolean }, @ConnectedSocket() client: Socket) {
    client.to(payload.threadId).emit('typing_status', {
      userId: client.id, 
      isTyping: payload.isTyping,
      threadId: payload.threadId
    });
  }

  @SubscribeMessage('send_message')
  async handleMessage(@MessageBody() payload: { threadId: string; content: string; senderId: string; type?: any; attachments?: string[] }) {
    const newMessage: any = {
      id: Date.now().toString(),
      senderId: payload.senderId,
      content: payload.content,
      timestamp: new Date(),
      type: payload.type || 'text',
      attachments: payload.attachments,
      threadId: payload.threadId
    };

    await this.chatService.saveMessage(payload.threadId, newMessage);
    this.server.to(payload.threadId).emit('new_message', newMessage);

    if (payload.type !== 'internal_note') {
        this.queueService.addJob('analyze_sentiment', { threadId: payload.threadId, content: payload.content });
        this.processAI(payload.threadId, payload.content);
    }
  }

  async processAI(threadId: string, content: string) {
    try {
        const analysis = await this.geminiService.analyzeMessage(content);
        await this.chatService.updateThreadMetadata(threadId, analysis);
        this.server.to(threadId).emit('thread_updated', { threadId, updates: analysis });

        const thread = await this.chatService.getThread(threadId);
        const historyContext = thread?.messages.map(m => `${m.senderId}: ${m.content}`).join('\n') || content;
        const quickReplies = await this.geminiService.generateQuickReplies(historyContext);
        this.server.to(threadId).emit('quick_replies', { threadId, replies: quickReplies });
        
        // Emit Event for Workflow Engine
        this.eventEmitter.emit('message.received', { threadId, content, metadata: analysis });

    } catch (error) {
        console.error("AI Processing Error:", error);
    }
  }
}

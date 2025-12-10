
import { Injectable, Logger } from '@nestjs/common';
import { GeminiService } from '../gemini/gemini.service';
import { OperationsService } from '../operations/operations.service';
import { FinOpsService } from '../finops/finops.service';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class CopilotService {
  private readonly logger = new Logger(CopilotService.name);

  constructor(
    private readonly geminiService: GeminiService,
    private readonly operationsService: OperationsService,
    private readonly finOpsService: FinOpsService,
    private readonly chatService: ChatService
  ) {}

  async processQuery(userId: string, query: string, clientContext: any = {}) {
    this.logger.log(`Processing Copilot query for user ${userId}: "${query}"`);

    // 1. Gather Real-time Data from Modules
    const [bookings, transactions, threads] = await Promise.all([
        this.operationsService.getBookings(),
        this.finOpsService.getTransactions(),
        this.chatService.getAllThreads()
    ]);

    // 2. Compute Aggregates (Server-side reduction to save context window)
    const confirmedBookings = bookings.filter(b => b.status === 'Confirmed');
    const revenue = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);
    const unreadThreads = threads.filter(t => 
        t.messages.length > 0 && t.messages[t.messages.length - 1].senderId !== 'me' // simplified unread check
    ).length;

    const serverContext = {
        stats: {
            totalBookings: bookings.length,
            confirmedBookings: confirmedBookings.length,
            totalRevenue: revenue,
            activeConversations: threads.length,
            unreadMessages: unreadThreads,
            occupancyRate: bookings.length > 0 ? (confirmedBookings.length / bookings.length).toFixed(2) : 0
        },
        recentActivity: {
            lastBooking: bookings[bookings.length - 1]?.guestName || 'None',
            lastTransaction: transactions[0]?.description || 'None'
        }
    };

    // 3. Merge Contexts
    const enrichedContext = {
        ...clientContext,
        systemData: serverContext
    };

    // 4. Consult AI
    return this.geminiService.askBusinessAnalyst(query, enrichedContext);
  }

  async processVoiceCommand(userId: string, audioBase64: string, mimeType: string, clientContext: any = {}) {
      // 1. Transcribe (Fastest Model)
      const transcription = await this.geminiService.transcribeAudio(audioBase64, mimeType);
      
      if (!transcription.text) {
          return { error: 'Could not understand audio' };
      }

      // 2. Parse Intent immediately with provided context
      const context = {
          user: userId,
          timestamp: new Date().toISOString(),
          ...clientContext // Inject client entities (apartments, etc.)
      };

      const command = await this.geminiService.parseVoiceCommand(transcription.text, context);

      return {
          transcript: transcription.text,
          command: command
      };
  }
}

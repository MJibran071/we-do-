
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { GeminiService } from '../gemini/gemini.service';
import { CrmService } from './crm.service';
import { ChatService } from '../chat/chat.service';

@Processor('tasks')
export class CrmProcessor extends WorkerHost {
  private readonly logger = new Logger(CrmProcessor.name);

  constructor(
      private readonly geminiService: GeminiService,
      private readonly crmService: CrmService,
      private readonly chatService: ChatService
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    if (job.name !== 'analyze_customer') return;

    const { customerId } = job.data.payload;
    this.logger.log(`Analyzing customer ${customerId}...`);

    const customer = await this.crmService.findOne(customerId);
    if (!customer) return;

    // Fetch conversation history if possible
    // For this demo, we assume we can link via email/name in chat threads
    // Real implementation would have a direct relation
    const threads = await this.chatService.getAllThreads(); 
    // This is a naive filter for demonstration
    const customerThreads = threads.filter(t => 
        t.participants.some(p => p.name === customer.name || p.email === customer.email)
    );

    const historyText = customerThreads
        .map(t => t.messages.map(m => m.content).join('\n'))
        .join('\n---\n');

    // Call Gemini
    const analysis = await this.geminiService.analyzeCustomerSegments(customer, historyText);

    // Update Customer
    await this.crmService.updateAiAnalysis(
        customerId, 
        analysis.tags, 
        analysis.segment, 
        analysis.summary
    );

    return { status: 'analyzed', segment: analysis.segment };
  }
}


import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { GeminiService } from '../gemini/gemini.service';
import { RagService } from '../rag/rag.service';
import * as fs from 'fs-extra';

@Processor('tasks')
export class QueueProcessor extends WorkerHost {
  private readonly logger = new Logger(QueueProcessor.name);

  constructor(
      private readonly geminiService: GeminiService,
      private readonly ragService: RagService
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);
    const { type, payload } = job.data;

    try {
      let result;

      switch (type) {
        case 'analyze_sentiment':
          this.logger.log(`Analyzing sentiment for thread ${payload.threadId}`);
          result = await this.geminiService.analyzeMessage(payload.content);
          break;
          
        case 'ingest_document':
          this.logger.log(`Ingesting document: ${payload.filePath}`);
          result = await this.ragService.ingestDocumentFromFile(payload.filePath, payload.mimeType, payload.category);
          // Optional: Cleanup temp file
          // await fs.remove(payload.filePath); 
          break;

        case 'sync_integration':
          this.logger.log(`Syncing integration data`);
          await new Promise(resolve => setTimeout(resolve, 1500));
          result = { success: true, syncedAt: new Date() };
          break;
          
        default:
          this.logger.warn(`Unknown job type: ${type}`);
          result = { skipped: true };
      }

      return { 
        type, 
        payload, 
        result 
      };
    } catch (error) {
      this.logger.error(`Job ${job.id} failed`, error);
      throw error;
    }
  }
}

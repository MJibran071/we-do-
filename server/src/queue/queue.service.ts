
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, QueueEvents } from 'bullmq';
import { Subject } from 'rxjs';
import { ConfigService } from '@nestjs/config';

export interface JobData {
  id?: string;
  type: 'analyze_sentiment' | 'generate_draft' | 'process_voice' | 'sync_integration' | 'analyze_customer' | 'ingest_document';
  payload: any;
  status?: string;
  result?: any;
}

@Injectable()
export class QueueService implements OnModuleInit {
  private readonly logger = new Logger(QueueService.name);
  public jobEvents = new Subject<JobData>();
  private queueEvents: QueueEvents;

  constructor(
    @InjectQueue('tasks') private taskQueue: Queue,
    private configService: ConfigService
  ) { }

  async onModuleInit() {
    const url = new URL(this.configService.get<string>('REDIS_URI'));

    this.queueEvents = new QueueEvents('tasks', {
      connection: {
        host: url.hostname,
        port: Number(url.port),
      }
    });

    this.queueEvents.on('completed', ({ jobId, returnvalue }) => {
      this.logger.debug(`Job ${jobId} completed`);
      // Reconstruct job data format expected by the frontend/gateway
      const result = returnvalue as any;
      this.jobEvents.next({
        id: jobId,
        type: result?.type,
        payload: result?.payload,
        status: 'completed',
        result: result?.result
      });
    });

    this.queueEvents.on('failed', ({ jobId, failedReason }) => {
      this.logger.error(`Job ${jobId} failed: ${failedReason}`);
      this.jobEvents.next({
        id: jobId,
        type: 'unknown' as any,
        payload: {},
        status: 'failed',
        result: { error: failedReason }
      });
    });
  }

  async addJob(type: JobData['type'], payload: any): Promise<string> {
    const job = await this.taskQueue.add(type, { type, payload });
    this.logger.log(`Added job ${job.id} of type ${type}`);
    return job.id;
  }
}
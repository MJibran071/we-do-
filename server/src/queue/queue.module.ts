
import { Module, Global, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueService } from './queue.service';
import { QueueProcessor } from './queue.processor';
import { GeminiModule } from '../gemini/gemini.module';
import { RagModule } from '../rag/rag.module';
import { StorageModule } from '../storage/storage.module';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'tasks',
    }),
    forwardRef(() => GeminiModule),
    forwardRef(() => RagModule),
    StorageModule
  ],
  providers: [QueueService, QueueProcessor],
  exports: [QueueService],
})
export class QueueModule { }

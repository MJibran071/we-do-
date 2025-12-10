
import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { OperationsModule } from '../operations/operations.module';
import { GeminiModule } from '../gemini/gemini.module';
import { ChatModule } from '../chat/chat.module';
import { RagModule } from '../rag/rag.module';
import { EmailSyncModule } from '../email-sync/email-sync.module';

@Module({
  imports: [OperationsModule, ChatModule, RagModule, GeminiModule, EmailSyncModule],
  providers: [SchedulerService],
})
export class SchedulerModule { }

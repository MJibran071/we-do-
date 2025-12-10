
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { GeminiModule } from '../gemini/gemini.module';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { WorkflowsModule } from '../workflows/workflows.module';
import { RagModule } from '../rag/rag.module';
import { Thread } from './thread.entity';
import { Message } from './message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Thread, Message]),
    WorkflowsModule,
    RagModule,
    GeminiModule
  ],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
  exports: [ChatService, ChatGateway],
})
export class ChatModule { }

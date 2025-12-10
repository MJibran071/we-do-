
import { Module } from '@nestjs/common';
import { CopilotService } from './copilot.service';
import { CopilotController } from './copilot.controller';
import { GeminiModule } from '../gemini/gemini.module';
import { OperationsModule } from '../operations/operations.module';
import { FinOpsModule } from '../finops/finops.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    GeminiModule,
    OperationsModule,
    FinOpsModule,
    ChatModule
  ],
  controllers: [CopilotController],
  providers: [CopilotService],
  exports: [CopilotService]
})
export class CopilotModule {}

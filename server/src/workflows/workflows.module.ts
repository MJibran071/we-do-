
import { Module, forwardRef } from '@nestjs/common';
import { WorkflowsController } from './workflows.controller';
import { WorkflowsService } from './workflows.service';
import { WorkflowListener } from './workflows.listener';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [forwardRef(() => ChatModule)],
  controllers: [WorkflowsController],
  providers: [WorkflowsService, WorkflowListener],
  exports: [WorkflowsService],
})
export class WorkflowsModule {}

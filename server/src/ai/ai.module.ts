
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiModelConfig } from './ai-model-config.entity';
import { User } from '../users/user.entity';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { AiTaskAssignmentController } from './ai-task-assignment.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([AiModelConfig, User])],
  controllers: [AiController, AiTaskAssignmentController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule { }

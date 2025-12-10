
import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { ChatModule } from '../chat/chat.module';
import { OperationsModule } from '../operations/operations.module';

@Module({
  imports: [ChatModule, OperationsModule],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}

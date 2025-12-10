
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrmService } from './crm.service';
import { CrmController } from './crm.controller';
import { Customer } from './customer.entity';
import { CrmProcessor } from './crm.processor';
import { GeminiModule } from '../gemini/gemini.module';
import { ChatModule } from '../chat/chat.module';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    GeminiModule,
    forwardRef(() => ChatModule),
    QueueModule
  ],
  controllers: [CrmController],
  providers: [CrmService, CrmProcessor],
  exports: [CrmService]
})
export class CrmModule {}


import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { ChatModule } from '../chat/chat.module';

import { WebhooksService } from './webhooks.service';

@Module({
  imports: [ChatModule],
  controllers: [WebhooksController],
  providers: [WebhooksService],
})
export class WebhooksModule { }

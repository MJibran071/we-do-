
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookSubscription } from './webhook-subscription.entity';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([WebhookSubscription])],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService]
})
export class EventsModule {}

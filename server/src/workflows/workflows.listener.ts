
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WorkflowsService } from './workflows.service';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class WorkflowListener {
  private readonly logger = new Logger(WorkflowListener.name);

  constructor(
    private readonly workflowsService: WorkflowsService,
    private readonly chatService: ChatService
  ) {}

  @OnEvent('message.received')
  async handleMessageReceived(payload: { threadId: string; content: string; metadata: any }) {
    this.logger.log(`Event detected: message.received for thread ${payload.threadId}`);
    
    await this.workflowsService.processEvent('message_received', payload, async (action) => {
        if (action.type === 'send_message') {
            await this.chatService.saveMessage(payload.threadId, {
                senderId: 'ai-bot',
                content: action.config.text,
                type: 'text'
            });
        }
        // Handle other actions (notify_team, etc)
    });
  }

  @OnEvent('booking.created')
  async handleBookingCreated(payload: any) {
      this.logger.log(`Event detected: booking.created`);
      await this.workflowsService.processEvent('booking_created', payload);
  }

  @OnEvent('maintenance.created')
  async handleMaintenanceCreated(payload: any) {
      this.logger.log(`Event detected: maintenance.created`);
      await this.workflowsService.processEvent('maintenance_reported', payload);
  }
}

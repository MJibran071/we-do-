
import { Controller, Get } from '@nestjs/common';
import { ChatService } from '../chat/chat.service';
import { OperationsService } from '../operations/operations.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly chatService: ChatService,
    private readonly operationsService: OperationsService
  ) {}

  @Get('overview')
  async getOverview() {
    const threads = await this.chatService.getAllThreads();
    const bookings = await this.operationsService.getBookings();
    const maintenance = await this.operationsService.getMaintenanceIssues();

    // Simple aggregation
    const totalMessages = threads.reduce((acc, t) => acc + t.messages.length, 0);
    const openIssues = maintenance.filter(i => i.status === 'Open').length;
    const confirmedBookings = bookings.filter(b => b.status === 'Confirmed').length;

    return {
      totalConversations: threads.length,
      totalMessages,
      openMaintenanceIssues: openIssues,
      confirmedBookings,
      lastUpdated: new Date()
    };
  }
}

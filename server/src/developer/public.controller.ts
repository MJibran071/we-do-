
import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiKeyGuard } from '../auth/api-key.guard';
import { OperationsService } from '../operations/operations.service';
import { ChatService } from '../chat/chat.service';

@Controller('v1')
@UseGuards(ApiKeyGuard)
export class PublicApiController {
  constructor(
    private readonly opsService: OperationsService,
    private readonly chatService: ChatService
  ) {}

  @Get('bookings')
  async getBookings() {
    return this.opsService.getBookings();
  }

  @Get('threads')
  async getThreads() {
    return this.chatService.getAllThreads();
  }
}

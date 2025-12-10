
import { Controller, Get, Post, Body, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { EventsService } from './events.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('events/webhooks')
@UseGuards(AuthGuard('jwt'))
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async getSubscriptions(@Request() req) {
    return this.eventsService.getSubscriptions(req.user.userId);
  }

  @Post()
  async createSubscription(
      @Request() req, 
      @Body() body: { url: string; events: string[] }
  ) {
    return this.eventsService.createSubscription(req.user.userId, body.url, body.events);
  }
}

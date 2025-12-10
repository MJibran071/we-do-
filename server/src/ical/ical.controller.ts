
import { Controller, Get, Post, Param, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { IcalService } from './ical.service';

@Controller('ical')
export class IcalController {
  constructor(private readonly icalService: IcalService) {}

  @Get(':entityId.ics')
  async getFeed(@Param('entityId') entityId: string, @Res() res: Response) {
    const icsContent = await this.icalService.generateFeed(entityId);
    
    res.set('Content-Type', 'text/calendar; charset=utf-8');
    res.set('Content-Disposition', `attachment; filename="calendar-${entityId}.ics"`);
    res.send(icsContent);
  }

  @Post('sync')
  async syncExternal(@Body('url') url: string) {
    return this.icalService.parseExternalFeed(url);
  }
}

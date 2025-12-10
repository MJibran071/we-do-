
import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { VoiceService } from './voice.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('voice')
export class VoiceController {
  constructor(private readonly voiceService: VoiceService) {}

  @Get('logs')
  @UseGuards(AuthGuard('jwt'))
  async getLogs() {
      return this.voiceService.getSessions();
  }

  @Post('webhook/twilio')
  async handleTwilioWebhook(@Body() body: any) {
      // Handle 'CallStatus' updates from Twilio
      const caller = body.From || 'Unknown';
      const sid = body.CallSid;
      const status = body.CallStatus; // 'ringing', 'in-progress', 'completed'

      if (status === 'ringing') {
          await this.voiceService.createSession(caller, 'inbound', sid);
      } else if (status === 'completed') {
          // Find session by external ID and close it
          // await this.voiceService.endSession(...)
      }

      return { status: 'ok' };
  }
}


import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OperationsService } from '../operations/operations.service';
import { GeminiService } from '../gemini/gemini.service';
import { ChatGateway } from '../chat/chat.gateway';
import { EmailSyncService } from '../email-sync/email-sync.service';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly operationsService: OperationsService,
    private readonly geminiService: GeminiService,
    private readonly chatGateway: ChatGateway,
    private readonly emailSyncService: EmailSyncService
  ) {}

  // Runs every morning at 8 AM
  @Cron('0 8 * * *') 
  async handleMorningBriefing() {
    console.log('Generating Morning Briefing...');
    const bookings = await this.operationsService.getBookings();
    const issues = await this.operationsService.getMaintenanceIssues();
    const briefingText = `Good morning. You have ${bookings.length} active bookings and ${issues.length} open maintenance issues today.`;
    const audioBase64 = await this.geminiService.synthesizeSpeech(briefingText);
    this.chatGateway.server.emit('morning_briefing_update', {
      text: briefingText,
      audio: audioBase64
    });
  }

  // Poll emails every 5 minutes
  @Cron(CronExpression.EVERY_5_MINUTES)
  async pollEmails() {
      console.log('Polling Emails...');
      await this.emailSyncService.pollAllAccounts();
  }
}

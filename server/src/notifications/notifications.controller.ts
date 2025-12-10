
import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly emailService: EmailService) {}

  @Post('email')
  async sendEmail(@Body() body: { to: string; subject: string; body: string }) {
    return this.emailService.sendEmail(body.to, body.subject, body.body);
  }

  @Post('receipt')
  async sendReceipt(@Body() body: { to: string; receiptData: any }) {
    return this.emailService.sendReceipt(body.to, body.receiptData);
  }
}

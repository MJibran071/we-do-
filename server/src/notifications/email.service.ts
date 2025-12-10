
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendEmail(to: string, subject: string, body: string, attachments?: any[]) {
    // Integration with SendGrid/Resend would go here.
    // Example: await sendgrid.send({ ... })
    
    this.logger.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`);
    this.logger.log(`[BODY]: ${body.substring(0, 50)}...`);
    
    return { success: true, messageId: `msg_${Date.now()}` };
  }

  async sendReceipt(to: string, receiptData: any) {
    const subject = `Receipt for ${receiptData.id}`;
    const body = `Thank you for your business! Your total was $${receiptData.total}.`;
    return this.sendEmail(to, subject, body);
  }
}


import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  async sendSms(to: string, message: string) {
    // In production, integrate Twilio/MessageBird here
    this.logger.log(`[MOCK SMS] To: ${to} | Message: ${message}`);
    return { success: true, sid: `sms_${Date.now()}` };
  }
}

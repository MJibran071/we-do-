
import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';

interface NotificationPayload {
    userId: string;
    type: 'booking_confirmed' | 'payment_failed' | 'maintenance_alert';
    channels?: ('email' | 'sms')[]; // Optional override
    data: any;
}

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    constructor(
        private readonly emailService: EmailService,
        private readonly smsService: SmsService
    ) { }

    async dispatch(payload: NotificationPayload) {
        // 1. Resolve User Preferences (Mocked)
        // In real app: const prefs = await userRepo.getNotificationPrefs(payload.userId);
        const prefs = { email: true, sms: payload.type === 'maintenance_alert' };

        const channels = payload.channels || [];
        if (channels.length === 0) {
            if (prefs.email) channels.push('email');
            if (prefs.sms) channels.push('sms');
        }

        this.logger.log(`Dispatching ${payload.type} to user ${payload.userId} via [${channels.join(', ')}]`);

        const results = [];

        // 2. Route to Channels
        if (channels.includes('email')) {
            const emailContent = this.generateEmailContent(payload.type, payload.data);
            // Assuming user email lookup happens here or passed in data
            const userEmail = payload.data.email || 'user@example.com';
            results.push(await this.emailService.sendEmail(userEmail, emailContent.subject, emailContent.body));
        }

        if (channels.includes('sms')) {
            const smsContent = this.generateSmsContent(payload.type, payload.data);
            const userPhone = payload.data.phone || '+15550000000';
            results.push(await this.smsService.sendSms(userPhone, smsContent));
        }

        return results;
    }

    async sendEmail(to: string, subject: string, body: string) {
        return this.emailService.sendEmail(to, subject, body);
    }

    private generateEmailContent(type: string, data: any) {
        switch (type) {
            case 'booking_confirmed':
                return { subject: 'Booking Confirmed!', body: `Your stay at ${data.property} is confirmed for ${data.date}.` };
            case 'payment_failed':
                return { subject: 'Action Required: Payment Failed', body: `We could not process payment for invoice ${data.invoiceId}.` };
            default:
                return { subject: 'Notification', body: JSON.stringify(data) };
        }
    }

    private generateSmsContent(type: string, data: any) {
        switch (type) {
            case 'booking_confirmed': return `We Do: Booking confirmed for ${data.date}. Check email for details.`;
            case 'maintenance_alert': return `We Do Alert: New urgent ticket assigned to you at ${data.location}.`;
            default: return `New notification from We Do.`;
        }
    }
}

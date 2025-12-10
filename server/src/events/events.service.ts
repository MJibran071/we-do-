
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebhookSubscription } from './webhook-subscription.entity';
import * as crypto from 'crypto';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(WebhookSubscription)
    private subscriptionRepo: Repository<WebhookSubscription>,
  ) {}

  async createSubscription(userId: string, url: string, events: string[]) {
    const secret = crypto.randomBytes(32).toString('hex');
    const sub = this.subscriptionRepo.create({
      userId,
      url,
      events,
      secret
    });
    return this.subscriptionRepo.save(sub);
  }

  async getSubscriptions(userId: string) {
    return this.subscriptionRepo.find({ where: { userId } });
  }

  async dispatch(eventName: string, payload: any) {
    // Find all active subscriptions for this event
    // In a real app, you'd filter by the userId associated with the resource
    // For this demo, we'll fetch all matching the event
    const subs = await this.subscriptionRepo.createQueryBuilder('sub')
      .where('sub.isActive = :active', { active: true })
      .andWhere('sub.events LIKE :event', { event: `%${eventName}%` })
      .getMany();

    this.logger.log(`Dispatching ${eventName} to ${subs.length} subscribers`);

    for (const sub of subs) {
        this.sendWebhook(sub, eventName, payload).catch(err => 
            this.logger.error(`Failed to send webhook to ${sub.url}`, err)
        );
    }
  }

  private async sendWebhook(sub: WebhookSubscription, event: string, payload: any) {
      const timestamp = Date.now();
      const body = JSON.stringify({
          id: `evt_${crypto.randomBytes(12).toString('hex')}`,
          event,
          created: timestamp,
          data: payload
      });

      const signature = crypto
        .createHmac('sha256', sub.secret)
        .update(`${timestamp}.${body}`)
        .digest('hex');

      await fetch(sub.url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'X-WeDo-Signature': signature,
              'X-WeDo-Timestamp': timestamp.toString()
          },
          body
      });
  }
}

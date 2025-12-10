
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Subscription } from './subscription.entity';
import { Buffer } from 'buffer';

@Injectable()
export class BillingService {
  private stripe: Stripe;
  private readonly logger = new Logger(BillingService.name);

  // Map Plan IDs to Stripe Price IDs
  private readonly PRICE_IDS = {
    'Growth': {
      monthly: 'price_growth_monthly_id', // Replace with env vars in prod
      yearly: 'price_growth_yearly_id'
    },
    'Agency': {
      monthly: 'price_agency_monthly_id',
      yearly: 'price_agency_yearly_id'
    }
  };

  constructor(
    private configService: ConfigService,
    @InjectRepository(Subscription)
    private subscriptionRepo: Repository<Subscription>
  ) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable must be set');
    }
    this.stripe = new Stripe(secretKey, { apiVersion: '2023-10-16' });
  }

  async getSubscription(userId: string) {
      let sub = await this.subscriptionRepo.findOne({ where: { userId } });
      if (!sub) {
          // Default to Starter
          sub = this.subscriptionRepo.create({ userId, planId: 'Starter', status: 'active' });
          await this.subscriptionRepo.save(sub);
      }
      return sub;
  }

  async createCheckoutSession(userId: string, planId: string, interval: 'monthly' | 'yearly') {
    const priceId = this.PRICE_IDS[planId]?.[interval];
    if (!priceId) {
        // Fallback for demo/mock environment if IDs aren't set
        if (process.env.NODE_ENV !== 'production') {
            this.logger.log(`[Mock] Creating checkout for ${planId} ${interval}`);
            return {
                url: `https://checkout.stripe.com/mock?plan=${planId}`,
                sessionId: 'mock_sess_' + Date.now()
            };
        }
        throw new BadRequestException('Invalid plan configuration');
    }

    // Get or Create Customer
    let subscription = await this.getSubscription(userId);
    let customerId = subscription.stripeCustomerId;

    if (!customerId) {
        // In real app, fetch user email
        const customer = await this.stripe.customers.create({ metadata: { userId } });
        customerId = customer.id;
        subscription.stripeCustomerId = customerId;
        await this.subscriptionRepo.save(subscription);
    }

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      // 'card' includes Apple Pay and Google Pay if configured in Stripe Dashboard
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/billing?success=true`,
      cancel_url: `${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/billing?canceled=true`,
      metadata: { userId, planId }
    });

    return { url: session.url, sessionId: session.id };
  }

  async createPortalSession(userId: string) {
    const subscription = await this.getSubscription(userId);
    if (!subscription.stripeCustomerId) {
        throw new BadRequestException('No billing account found');
    }

    const session = await this.stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/billing`,
    });

    return { url: session.url };
  }

  // Used for custom Payment Element implementations (Google/Apple Pay buttons)
  async createPaymentIntent(amount: number, currency: string = 'usd', userId: string) {
      // Amount in cents
      const paymentIntent = await this.stripe.paymentIntents.create({
          amount: Math.round(amount * 100),
          currency,
          automatic_payment_methods: {
              enabled: true,
          },
          metadata: { userId }
      });

      return {
          clientSecret: paymentIntent.client_secret,
          id: paymentIntent.id
      };
  }

  async handleWebhook(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    let event: Stripe.Event;

    try {
        if (!webhookSecret) throw new Error('Webhook Secret not configured');
        event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
        this.logger.error(`Webhook Error: ${err.message}`);
        throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session;
            await this.handleCheckoutSuccess(session);
            break;
        case 'payment_intent.succeeded':
            // Handle one-time payment success from Payment Element
            break;
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
            const subscription = event.data.object as Stripe.Subscription;
            await this.handleSubscriptionUpdate(subscription);
            break;
    }

    return { received: true };
  }

  private async handleCheckoutSuccess(session: Stripe.Checkout.Session) {
      const userId = session.metadata?.userId;
      const planId = session.metadata?.planId;
      if (!userId) return;

      const sub = await this.getSubscription(userId);
      if (session.subscription) {
          sub.stripeSubscriptionId = session.subscription as string;
      }
      sub.planId = planId || 'Growth';
      sub.status = 'active';
      await this.subscriptionRepo.save(sub);
      this.logger.log(`User ${userId} upgraded to ${planId}`);
  }

  private async handleSubscriptionUpdate(stripeSub: Stripe.Subscription) {
      const customerId = typeof stripeSub.customer === 'string' ? stripeSub.customer : stripeSub.customer.id;
      const sub = await this.subscriptionRepo.findOne({ where: { stripeCustomerId: customerId } });
      
      if (sub) {
          sub.status = stripeSub.status;
          sub.currentPeriodEnd = new Date(stripeSub.current_period_end * 1000);
          
          // Revert to Starter if canceled/unpaid
          if (['canceled', 'unpaid', 'incomplete_expired'].includes(stripeSub.status)) {
              sub.planId = 'Starter';
          }
          
          await this.subscriptionRepo.save(sub);
      }
  }
}

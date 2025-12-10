
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class GooglePayService {
  private stripe: Stripe;
  private readonly logger = new Logger(GooglePayService.name);

  constructor(private configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable must be set');
    }
    this.stripe = new Stripe(secretKey, { apiVersion: '2023-10-16' });
  }

  getMerchantConfig() {
    return {
      environment: this.configService.get('NODE_ENV') === 'production' ? 'PRODUCTION' : 'TEST',
      merchantId: this.configService.get('GOOGLE_PAY_MERCHANT_ID') || 'merchant-id-placeholder',
      merchantName: 'We Do Inc.',
      allowedPaymentMethods: ['CARD', 'TOKENIZED_CARD'],
      tokenizationSpecification: {
        type: 'PAYMENT_GATEWAY',
        parameters: {
          gateway: 'stripe',
          'stripe:version': '2023-10-16',
          'stripe:publishableKey': this.configService.get('STRIPE_PUBLISHABLE_KEY') || 'pk_test_mock'
        }
      }
    };
  }

  /**
   * Process a payment using a Google Pay Token (Direct integration)
   */
  async processPayment(token: string, amount: number, currency: string = 'usd', userId: string) {
    try {
      this.logger.log(`Processing Google Pay token for user ${userId}`);

      // 1. Create a Payment Method from the Google Pay Token
      // Note: In most web integrations, the frontend Stripe Element handles this.
      // This logic is for when you receive a raw Google Pay token string from a mobile app or direct integration.
      const paymentMethod = await this.stripe.paymentMethods.create({
        type: 'card',
        card: { token: token }, // Stripe can accept the Google Pay token directly as a 'token' in some legacy flows, or as a source
      });

      // 2. Create and Confirm Payment Intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Cents
        currency,
        payment_method: paymentMethod.id,
        confirm: true,
        metadata: {
          userId,
          source: 'google_pay_direct'
        },
        automatic_payment_methods: {
            enabled: true,
            allow_redirects: 'never' // Direct token flow usually implies no redirect
        }
      });

      return {
        success: true,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status
      };

    } catch (error) {
      this.logger.error(`Google Pay Processing Error: ${error.message}`);
      throw new BadRequestException(`Payment Failed: ${error.message}`);
    }
  }
}

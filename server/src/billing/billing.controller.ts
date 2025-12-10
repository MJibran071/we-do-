
import { Controller, Post, Body, UseGuards, Request, Headers, BadRequestException, Req, Get } from '@nestjs/common';
import { BillingService } from './billing.service';
import { PaypalService } from './paypal.service';
import { GooglePayService } from './google-pay.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('billing')
export class BillingController {
  constructor(
      private readonly billingService: BillingService,
      private readonly paypalService: PaypalService,
      private readonly googlePayService: GooglePayService
  ) {}

  @Post('checkout')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('Admin', 'Owner')
  async createCheckoutSession(@Request() req, @Body() body: { planId: string; interval: 'monthly' | 'yearly' }) {
    return this.billingService.createCheckoutSession(req.user.userId, body.planId, body.interval);
  }

  @Post('portal')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('Admin', 'Owner')
  async createPortalSession(@Request() req) {
    return this.billingService.createPortalSession(req.user.userId);
  }

  // --- PayPal Endpoints ---
  @Post('paypal/order')
  @UseGuards(AuthGuard('jwt'))
  async createPaypalOrder(@Body() body: { amount: string; currency?: string }) {
      return this.paypalService.createOrder(body.amount, body.currency);
  }

  @Post('paypal/capture')
  @UseGuards(AuthGuard('jwt'))
  async capturePaypalOrder(@Body() body: { orderId: string }) {
      return this.paypalService.captureOrder(body.orderId);
  }

  // --- Google Pay Endpoints ---
  @Get('google-pay/config')
  async getGooglePayConfig() {
      return this.googlePayService.getMerchantConfig();
  }

  @Post('google-pay/process')
  @UseGuards(AuthGuard('jwt'))
  async processGooglePay(@Request() req, @Body() body: { token: string; amount: number; currency?: string }) {
      return this.googlePayService.processPayment(body.token, body.amount, body.currency, req.user.userId);
  }

  // --- Stripe Payment Intent (for Custom Google/Apple Pay UI) ---
  @Post('payment-intent')
  @UseGuards(AuthGuard('jwt'))
  async createPaymentIntent(@Request() req, @Body() body: { amount: number; currency?: string }) {
      return this.billingService.createPaymentIntent(body.amount, body.currency, req.user.userId);
  }

  @Post('webhook')
  async handleWebhook(
      @Headers('stripe-signature') signature: string,
      @Req() req: any
  ) {
    if (!signature) throw new BadRequestException('Missing signature');
    return this.billingService.handleWebhook(signature, req.rawBody || req.body);
  }
}

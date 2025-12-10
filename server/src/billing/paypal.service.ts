
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as paypal from '@paypal/checkout-server-sdk';

@Injectable()
export class PaypalService {
  private environment: paypal.core.SandboxEnvironment | paypal.core.LiveEnvironment;
  private client: paypal.core.PayPalHttpClient;
  private readonly logger = new Logger(PaypalService.name);

  constructor(private configService: ConfigService) {
    const clientId = this.configService.get<string>('PAYPAL_CLIENT_ID');
    const clientSecret = this.configService.get<string>('PAYPAL_CLIENT_SECRET');
    
    if (!clientId || !clientSecret) {
      throw new Error('PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET must be set');
    }
    
    const isLive = this.configService.get<string>('NODE_ENV') === 'production';

    this.environment = isLive 
      ? new paypal.core.LiveEnvironment(clientId, clientSecret)
      : new paypal.core.SandboxEnvironment(clientId, clientSecret);
    
    this.client = new paypal.core.PayPalHttpClient(this.environment);
  }

  async createOrder(amount: string, currency: string = 'USD') {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: amount
        }
      }]
    });

    try {
      const response = await this.client.execute(request);
      return { id: response.result.id, links: response.result.links };
    } catch (e) {
      this.logger.error('PayPal Create Order Failed', e);
      throw e;
    }
  }

  async captureOrder(orderId: string) {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    try {
      const response = await this.client.execute(request);
      // In a real app, you would verify the amount and status here
      const capture = response.result.purchase_units[0].payments.captures[0];
      
      if (capture.status === 'COMPLETED') {
          return { success: true, captureId: capture.id };
      }
      return { success: false, status: capture.status };
    } catch (e) {
      this.logger.error('PayPal Capture Order Failed', e);
      throw e;
    }
  }
}


import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { PaypalService } from './paypal.service';
import { GooglePayService } from './google-pay.service';
import { UsageService } from './usage.service';
import { Subscription } from './subscription.entity';
import { QuotaGuard } from './quota.guard';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription]),
    ConfigModule
  ],
  controllers: [BillingController],
  providers: [BillingService, PaypalService, GooglePayService, UsageService, QuotaGuard],
  exports: [BillingService, PaypalService, GooglePayService, UsageService, QuotaGuard, TypeOrmModule],
})
export class BillingModule { }

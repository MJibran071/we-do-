
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_INTERCEPTOR } from '@nestjs/core';
import * as Joi from 'joi';

import { ChatModule } from './chat/chat.module';
import { OperationsModule } from './operations/operations.module';
import { WorkflowsModule } from './workflows/workflows.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { RagModule } from './rag/rag.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { HealthModule } from './health/health.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { QueueModule } from './queue/queue.module';
import { GeminiModule } from './gemini/gemini.module';
import { BillingModule } from './billing/billing.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuditModule } from './audit/audit.module';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { LoggerModule } from './common/logger/logger.module';
import { PerformanceInterceptor } from './common/interceptors/performance.interceptor';
import { CacheModule } from './common/cache/cache.module';
import { StorageModule } from './storage/storage.module';
import { ReportsModule } from './reports/reports.module';
import { DeveloperModule } from './developer/developer.module';
import { IcalModule } from './ical/ical.module';
import { EventsModule } from './events/events.module';
import { InventoryModule } from './inventory/inventory.module';
import { CrmModule } from './crm/crm.module';
import { EmailSyncModule } from './email-sync/email-sync.module';
import { HrModule } from './hr/hr.module';
import { PricingModule } from './pricing/pricing.module';
import { SocialModule } from './social/social.module';
import { FinOpsModule } from './finops/finops.module';
import { IotModule } from './iot/iot.module';
import { VoiceModule } from './voice/voice.module';
import { LegalModule } from './legal/legal.module';
import { CompetitorModule } from './competitor/competitor.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { AgentModule } from './agent/agent.module';
import { HealthcareModule } from './healthcare/healthcare.module';
import { AiModule } from './ai/ai.module';
import { RpcModule } from './rpc/rpc.module';
import { CopilotModule } from './copilot/copilot.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        PORT: Joi.number().default(3000),
        API_KEY: Joi.string().required(),
        REDIS_URI: Joi.string().uri().default('redis://localhost:6379'),
        DATABASE_URL: Joi.string().uri().default('postgres://user:password@localhost:5432/wedo'),
        JWT_SECRET: Joi.string().required().default('dev-secret-fallback'),
        ENCRYPTION_KEY: Joi.string().optional(),
      }),
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const redisUri = config.get<string>('REDIS_URI');
        return {
          throttlers: [{ ttl: 60000, limit: 100 }],
          storage: redisUri ? new ThrottlerStorageRedisService(redisUri) : undefined,
        };
      },
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const url = new URL(configService.get<string>('REDIS_URI'));
        return { connection: { host: url.hostname, port: Number(url.port) } };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get<string>('NODE_ENV') === 'production';
        return {
          type: 'postgres',
          url: configService.get<string>('DATABASE_URL'),
          autoLoadEntities: true,
          synchronize: !isProduction, // Only sync in development
          migrations: ['dist/migrations/*.js'],
          migrationsRun: isProduction, // Run migrations automatically in production
          migrationsTableName: 'migrations',
          // Connection pooling for better performance
          extra: {
            max: 20, // Maximum pool size
            min: 5,  // Minimum pool size
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
          },
          // Query optimization
          maxQueryExecutionTime: 5000, // Log slow queries (>5s)
          logging: isProduction ? ['error', 'warn'] : ['error', 'warn', 'query'],
          // SSL for production
          ssl: isProduction ? { rejectUnauthorized: false } : false,
        };
      },
      inject: [ConfigService],
    }),
    DatabaseModule,
    CacheModule,
    LoggerModule,
    AuthModule,
    UsersModule,
    QueueModule,
    ChatModule,
    OperationsModule,
    WorkflowsModule,
    AnalyticsModule,
    RagModule,
    WebhooksModule,
    HealthModule,
    SchedulerModule,
    GeminiModule,
    BillingModule,
    NotificationsModule,
    AuditModule,
    StorageModule,
    ReportsModule,
    DeveloperModule,
    IcalModule,
    EventsModule,
    InventoryModule,
    CrmModule,
    EmailSyncModule,
    HrModule,
    PricingModule,
    SocialModule,
    FinOpsModule,
    IotModule,
    VoiceModule,
    LegalModule,
    CompetitorModule,
    MarketplaceModule,
    AgentModule,
    HealthcareModule,
    AiModule,
    RpcModule,
    CopilotModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: PerformanceInterceptor,
    },
  ],
})
export class AppModule {}

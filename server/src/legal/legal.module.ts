
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from './contract.entity';
import { LegalService } from './legal.service';
import { LegalController } from './legal.controller';
import { GeminiModule } from '../gemini/gemini.module';
import { StorageModule } from '../storage/storage.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contract]),
    GeminiModule,
    StorageModule,
    NotificationsModule
  ],
  controllers: [LegalController],
  providers: [LegalService],
})
export class LegalModule {}

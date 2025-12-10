
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailSyncService } from './email-sync.service';
import { EmailSyncController } from './email-sync.controller';
import { EmailAccount } from './email-account.entity';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailAccount]),
    ChatModule
  ],
  controllers: [EmailSyncController],
  providers: [EmailSyncService],
  exports: [EmailSyncService],
})
export class EmailSyncModule {}

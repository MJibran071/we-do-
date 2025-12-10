
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKey } from './api-key.entity';
import { DeveloperService } from './developer.service';
import { DeveloperController } from './developer.controller';
import { PublicApiController } from './public.controller';
import { OperationsModule } from '../operations/operations.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApiKey]),
    OperationsModule,
    ChatModule
  ],
  controllers: [DeveloperController, PublicApiController],
  providers: [DeveloperService],
  exports: [DeveloperService]
})
export class DeveloperModule {}

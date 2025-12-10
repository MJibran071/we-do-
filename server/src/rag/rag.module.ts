
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RagService } from './rag.service';
import { RagController } from './rag.controller';
import { VectorDocument } from './vector.entity';

import { StorageModule } from '../storage/storage.module';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [TypeOrmModule.forFeature([VectorDocument]), StorageModule, forwardRef(() => QueueModule)],
  controllers: [RagController],
  providers: [RagService],
  exports: [RagService],
})
export class RagModule { }

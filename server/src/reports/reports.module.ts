
import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { StorageModule } from '../storage/storage.module';
import { OperationsModule } from '../operations/operations.module';

@Module({
  imports: [StorageModule, OperationsModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}

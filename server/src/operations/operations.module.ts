
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperationsController } from './operations.controller';
import { OperationsService } from './operations.service';
import { Booking } from './booking.entity';
import { MaintenanceIssue } from './maintenance.entity';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
      TypeOrmModule.forFeature([Booking, MaintenanceIssue]),
      EventsModule
  ],
  controllers: [OperationsController],
  providers: [OperationsService],
  exports: [OperationsService]
})
export class OperationsModule {}

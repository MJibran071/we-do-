
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './device.entity';
import { Telemetry } from './telemetry.entity';
import { IotService } from './iot.service';
import { IotController } from './iot.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Device, Telemetry]),
    NotificationsModule
  ],
  controllers: [IotController],
  providers: [IotService],
  exports: [IotService]
})
export class IotModule {}

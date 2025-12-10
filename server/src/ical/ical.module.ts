
import { Module } from '@nestjs/common';
import { IcalController } from './ical.controller';
import { IcalService } from './ical.service';
import { OperationsModule } from '../operations/operations.module';

@Module({
  imports: [OperationsModule],
  controllers: [IcalController],
  providers: [IcalService],
})
export class IcalModule {}

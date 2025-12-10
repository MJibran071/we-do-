
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shift } from './shift.entity';
import { HrService } from './hr.service';
import { HrController } from './hr.controller';
import { OperationsModule } from '../operations/operations.module';
import { GeminiModule } from '../gemini/gemini.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shift]),
    OperationsModule,
    GeminiModule
  ],
  controllers: [HrController],
  providers: [HrService],
})
export class HrModule {}

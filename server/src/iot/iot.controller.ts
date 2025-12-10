
import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { IotService } from './iot.service';
import { AuthGuard } from '@nestjs/passport';
import { Device } from './device.entity';

@Controller('iot')
@UseGuards(AuthGuard('jwt'))
export class IotController {
  constructor(private readonly iotService: IotService) {}

  @Get('devices')
  async getDevices() {
    return this.iotService.getDevices();
  }

  @Post('devices')
  async registerDevice(@Body() body: Partial<Device>) {
    return this.iotService.registerDevice(body);
  }

  @Patch('devices/:id/state')
  async updateState(@Param('id') id: string, @Body() state: any) {
    return this.iotService.updateState(id, state);
  }
}

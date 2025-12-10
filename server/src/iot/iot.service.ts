
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './device.entity';
import { Telemetry } from './telemetry.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class IotService {
  private readonly logger = new Logger(IotService.name);

  constructor(
    @InjectRepository(Device)
    private deviceRepo: Repository<Device>,
    @InjectRepository(Telemetry)
    private telemetryRepo: Repository<Telemetry>,
    private readonly notificationsService: NotificationsService
  ) {}

  async registerDevice(data: Partial<Device>) {
    const device = this.deviceRepo.create(data);
    return this.deviceRepo.save(device);
  }

  async getDevices() {
    return this.deviceRepo.find();
  }

  async updateState(deviceId: string, state: any) {
    const device = await this.deviceRepo.findOne({ where: { id: deviceId } });
    if (!device) throw new Error('Device not found');

    device.currentState = { ...device.currentState, ...state };
    device.lastSeen = new Date();
    
    // Save snapshot to telemetry
    const telemetry = this.telemetryRepo.create({
      deviceId,
      data: state
    });
    await this.telemetryRepo.save(telemetry);

    const savedDevice = await this.deviceRepo.save(device);
    
    // Check Automation Rules
    await this.checkRules(savedDevice);

    return savedDevice;
  }

  private async checkRules(device: Device) {
    // Example: Noise Alert
    if (device.type === 'Sensor' && device.currentState.noiseLevel > 80) {
        this.logger.warn(`Noise violation detected at ${device.name}`);
        await this.notificationsService.dispatch({
            userId: 'admin', // In real app, find owner of entityId
            type: 'maintenance_alert',
            data: { 
                location: device.name, 
                message: `Noise level exceeded threshold: ${device.currentState.noiseLevel}dB` 
            }
        });
    }

    // Example: Low Battery
    if (device.batteryLevel < 20) {
        // Log warning
        this.logger.warn(`Low battery for ${device.name}`);
    }
  }
}

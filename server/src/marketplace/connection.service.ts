
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InstalledApp } from './installed-app.entity';
import { VaultService } from './vault/vault.service';

@Injectable()
export class ConnectionService {
  private readonly logger = new Logger(ConnectionService.name);

  constructor(
    @InjectRepository(InstalledApp)
    private installedRepo: Repository<InstalledApp>,
    private readonly vaultService: VaultService
  ) {}

  async getUserApps(userId: string) {
    return this.installedRepo.find({ 
        where: { userId },
        relations: ['appDetails'] 
    });
  }

  async installApp(userId: string, appId: string, config: any, secrets: Record<string, string>) {
    this.logger.log(`User ${userId} installing app ${appId}`);

    // 1. Create/Update Installation Record
    let installation = await this.installedRepo.findOne({ where: { userId, appId } });
    
    if (installation) {
        installation.config = { ...installation.config, ...config };
        installation.status = 'active';
        installation.installedAt = new Date(); // Update timestamp
    } else {
        installation = this.installedRepo.create({
            userId,
            appId,
            config,
            status: 'active'
        });
    }
    
    await this.installedRepo.save(installation);

    // 2. Store Secrets Securely
    if (secrets) {
        for (const [key, value] of Object.entries(secrets)) {
            if (value && value.trim() !== '') {
                // Key name convention: {appId}_{fieldName} e.g. airbnb_clientSecret, or simplified based on context
                await this.vaultService.storeSecret(userId, appId, key, value);
            }
        }
    }

    return { success: true, installationId: installation.id };
  }

  async uninstallApp(userId: string, appId: string) {
      this.logger.log(`User ${userId} uninstalling app ${appId}`);
      // Note: We deliberately keep secrets in Vault for now to allow easy re-connection, 
      // or we could delete them here.
      return this.installedRepo.delete({ userId, appId });
  }
}

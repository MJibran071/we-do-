
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VaultSecret } from './vault.entity';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { Buffer } from 'buffer';

@Injectable()
export class VaultService {
  private readonly logger = new Logger(VaultService.name);
  private readonly algorithm = 'aes-256-cbc';
  // In production, this must come from a secure env var and be 32 bytes
  private readonly secretKey: Buffer;

  constructor(
    @InjectRepository(VaultSecret)
    private vaultRepo: Repository<VaultSecret>,
    private configService: ConfigService
  ) {
    const key = this.configService.get<string>('ENCRYPTION_KEY');
    if (!key) {
      throw new Error('ENCRYPTION_KEY environment variable must be set for vault encryption');
    }
    this.secretKey = crypto.scryptSync(key, 'salt', 32);
  }

  async storeSecret(userId: string, integrationId: string, keyName: string, value: string) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, iv);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Check if exists
    let secret = await this.vaultRepo.findOne({ where: { userId, integrationId, keyName } });
    if (!secret) {
      secret = this.vaultRepo.create({ userId, integrationId, keyName });
    }

    secret.encryptedValue = encrypted;
    secret.iv = iv.toString('hex');

    return this.vaultRepo.save(secret);
  }

  async getDecryptedSecret(userId: string, integrationId: string, keyName: string): Promise<string | null> {
    const secret = await this.vaultRepo.findOne({ where: { userId, integrationId, keyName } });
    if (!secret) return null;

    try {
      const iv = Buffer.from(secret.iv, 'hex');
      const decipher = crypto.createDecipheriv(this.algorithm, this.secretKey, iv);
      let decrypted = decipher.update(secret.encryptedValue, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      // Use structured logging instead of console.error
      this.logger.error(`Failed to decrypt secret for ${integrationId}`, {
        integrationId,
        error: error.message // Don't log full error object which might contain sensitive data
      });
      return null;
    }
  }
}

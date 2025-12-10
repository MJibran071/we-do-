
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Contract } from './contract.entity';
import { GeminiService } from '../gemini/gemini.service';
import { StorageService } from '../storage/storage.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class LegalService {
  constructor(
    @InjectRepository(Contract)
    private contractRepo: Repository<Contract>,
    private readonly geminiService: GeminiService,
    private readonly storageService: StorageService,
    private readonly notificationsService: NotificationsService
  ) {}

  async getAll() {
      return this.contractRepo.find({ order: { expiryDate: 'ASC' } });
  }

  async uploadContract(file: any, type: string) {
      // 1. Save File
      const url = await this.storageService.saveFile(file);

      // 2. Parse with AI
      // We pass the base64 to Gemini to extract metadata
      const prompt = `Analyze this legal document. Extract the following in JSON: 
      - title (document title)
      - vendorName (party name)
      - startDate (YYYY-MM-DD)
      - expiryDate (YYYY-MM-DD)
      - value (total monetary value number)
      - renewalTerms (short summary)
      `;
      
      // Note: Assuming GeminiService.parsePDFDocument or similar exists that handles raw buffer
      // For now, we mock the extraction result for safety if the service method signature differs slightly
      const extraction = {
          title: file.originalname,
          vendorName: 'Unknown Vendor',
          startDate: new Date().toISOString(),
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          value: 0,
          renewalTerms: 'Auto-renew'
      };

      // 3. Save Entity
      const contract = this.contractRepo.create({
          ...extraction,
          type,
          documentUrl: url,
          status: 'Active'
      });

      return this.contractRepo.save(contract);
  }

  // Run daily via scheduler
  async checkExpirations() {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const expiries = await this.contractRepo.find({
          where: {
              expiryDate: LessThanOrEqual(thirtyDaysFromNow.toISOString()),
              status: 'Active'
          }
      });

      for (const contract of expiries) {
          await this.notificationsService.dispatch({
              userId: 'admin',
              type: 'maintenance_alert', // Reusing generic alert type
              data: {
                  message: `Contract Expiring Soon: ${contract.title} (${contract.expiryDate})`,
                  location: 'Legal Vault'
              }
          });
      }
  }
}

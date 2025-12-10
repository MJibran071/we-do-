
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from './inventory.entity';
import { GeminiService } from '../gemini/gemini.service';
import { NotificationsService } from '../notifications/notifications.service';
import { Buffer } from 'buffer';
import { AiTool } from '../agent/ai-tool.decorator';
import { ExposeApi } from '../rpc/expose-api.decorator';
import { Type } from '@google/genai';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(
    @InjectRepository(InventoryItem)
    private inventoryRepo: Repository<InventoryItem>,
    private readonly geminiService: GeminiService,
    private readonly notificationsService: NotificationsService
  ) {}

  @AiTool({
    description: "List all inventory items and their stock levels",
    parameters: { type: Type.OBJECT, properties: {} }
  })
  @ExposeApi({ description: "Get full inventory list", method: 'GET' })
  async findAll() {
    return this.inventoryRepo.find();
  }

  @ExposeApi({ description: "Create new inventory item", roles: ['Admin', 'Manager'] })
  async create(item: Partial<InventoryItem>) {
    const newItem = this.inventoryRepo.create(item);
    return this.inventoryRepo.save(newItem);
  }

  @AiTool({
    description: "Update the stock quantity of an inventory item",
    parameters: {
      type: Type.OBJECT,
      properties: {
        itemName: { type: Type.STRING, description: "Name of the item to update (fuzzy match)" },
        quantity: { type: Type.NUMBER, description: "The new quantity amount" }
      },
      required: ['itemName', 'quantity']
    }
  })
  async updateStockTool(args: { itemName: string, quantity: number }) {
      const item = await this.inventoryRepo.findOne({ where: { name: args.itemName } });
      if (!item) return { error: `Item ${args.itemName} not found` };
      return this.updateStock(item.id, args.quantity);
  }

  async updateStock(id: string, quantity: number) {
    const item = await this.inventoryRepo.findOne({ where: { id } });
    if (!item) return null;

    item.quantity = quantity;
    const updated = await this.inventoryRepo.save(item);

    if (updated.quantity <= updated.minThreshold) {
      await this.triggerReorderAlert(updated);
    }

    return updated;
  }

  @ExposeApi({ description: "Force trigger a low stock check" })
  async checkLowStock() {
      const items = await this.inventoryRepo.createQueryBuilder('item')
        .where('item.quantity <= item.minThreshold')
        .getMany();
      return items;
  }

  async processImageCount(imageBuffer: Buffer, itemNames: string[]) {
    const base64Image = imageBuffer.toString('base64');
    const result = await this.geminiService.analyzeInventoryPhoto(base64Image, itemNames);
    
    if (result.items && result.items.length > 0) {
      for (const detected of result.items) {
        const item = await this.inventoryRepo.findOne({ where: { name: detected.name } });
        if (item) {
          item.quantity = detected.quantity;
          await this.inventoryRepo.save(item);
        }
      }
    }

    return result;
  }

  private async triggerReorderAlert(item: InventoryItem) {
    this.logger.warn(`Low stock alert: ${item.name} (${item.quantity} remaining)`);
    
    const draft = await this.geminiService.generateCampaignContent(
        `Draft a reorder email for ${item.name}. Supplier: ${item.supplier}. We need ${item.minThreshold * 3} units.`,
        'Supplier',
        'Procurement'
    );

    await this.notificationsService.dispatch({
        userId: 'admin',
        type: 'maintenance_alert',
        data: {
            location: 'Inventory Room',
            message: `Low stock: ${item.name}. Draft order created for ${item.supplier}.`,
            draftSubject: draft.subject,
            draftBody: draft.body
        }
    });
  }
}

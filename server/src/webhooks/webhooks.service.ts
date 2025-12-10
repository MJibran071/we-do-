import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';

export class Webhook {
  id: string;
  userId: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  headers: Record<string, string>;
  lastTriggered?: Date;
  createdAt: Date;
}

export class WebhookLog {
  id: string;
  webhookId: string;
  event: string;
  payload: any;
  response: any;
  statusCode: number;
  success: boolean;
  timestamp: Date;
}

@Injectable()
export class WebhooksService {
  private webhooks: Map<string, Webhook> = new Map();
  private logs: Map<string, WebhookLog[]> = new Map();

  async findAll(userId: string): Promise<Webhook[]> {
    return Array.from(this.webhooks.values())
      .filter(w => w.userId === userId);
  }

  async findOne(id: string, userId: string): Promise<Webhook> {
    const webhook = this.webhooks.get(id);
    if (!webhook || webhook.userId !== userId) {
      throw new NotFoundException('Webhook not found');
    }
    return webhook;
  }

  async create(dto: any, userId: string): Promise<Webhook> {
    const webhook: Webhook = {
      id: crypto.randomUUID(),
      userId,
      name: dto.name,
      url: dto.url,
      events: dto.events,
      secret: dto.secret || crypto.randomBytes(32).toString('hex'),
      isActive: true,
      headers: dto.headers || {},
      createdAt: new Date()
    };

    this.webhooks.set(webhook.id, webhook);
    return webhook;
  }

  async update(id: string, dto: any, userId: string): Promise<Webhook> {
    const webhook = await this.findOne(id, userId);
    
    Object.assign(webhook, {
      ...dto,
      id: webhook.id,
      userId: webhook.userId,
      createdAt: webhook.createdAt
    });

    this.webhooks.set(id, webhook);
    return webhook;
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.findOne(id, userId);
    this.webhooks.delete(id);
    this.logs.delete(id);
  }

  async test(id: string, userId: string): Promise<any> {
    const webhook = await this.findOne(id, userId);
    
    const testPayload = {
      event: 'webhook.test',
      timestamp: new Date().toISOString(),
      data: {
        message: 'This is a test webhook'
      }
    };

    return this.trigger(webhook, 'webhook.test', testPayload);
  }

  async trigger(webhook: Webhook, event: string, data: any): Promise<void> {
    if (!webhook.isActive || !webhook.events.includes(event)) {
      return;
    }

    const payload = {
      event,
      timestamp: new Date().toISOString(),
      data
    };

    const signature = this.generateSignature(payload, webhook.secret);

    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature,
          ...webhook.headers
        },
        body: JSON.stringify(payload)
      });

      const log: WebhookLog = {
        id: crypto.randomUUID(),
        webhookId: webhook.id,
        event,
        payload,
        response: await response.text(),
        statusCode: response.status,
        success: response.ok,
        timestamp: new Date()
      };

      this.addLog(webhook.id, log);

      webhook.lastTriggered = new Date();
      this.webhooks.set(webhook.id, webhook);
    } catch (error) {
      const log: WebhookLog = {
        id: crypto.randomUUID(),
        webhookId: webhook.id,
        event,
        payload,
        response: error.message,
        statusCode: 0,
        success: false,
        timestamp: new Date()
      };

      this.addLog(webhook.id, log);
    }
  }

  async getLogs(webhookId: string, userId: string): Promise<WebhookLog[]> {
    await this.findOne(webhookId, userId);
    return this.logs.get(webhookId) || [];
  }

  private generateSignature(payload: any, secret: string): string {
    return crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');
  }

  private addLog(webhookId: string, log: WebhookLog): void {
    const logs = this.logs.get(webhookId) || [];
    logs.unshift(log);
    
    // Keep only last 100 logs
    if (logs.length > 100) {
      logs.pop();
    }
    
    this.logs.set(webhookId, logs);
  }

  // Trigger webhooks for specific events
  async triggerEvent(userId: string, event: string, data: any): Promise<void> {
    const webhooks = await this.findAll(userId);
    
    await Promise.all(
      webhooks
        .filter(w => w.isActive && w.events.includes(event))
        .map(w => this.trigger(w, event, data))
    );
  }
}

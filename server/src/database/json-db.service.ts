
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';

@Injectable()
export class JsonDbService implements OnModuleInit {
  private readonly logger = new Logger(JsonDbService.name);
  // Use absolute path based on current working directory to ensure consistency
  private dbPath = path.resolve((process as any).cwd(), '.db', 'database.json');
  private data: Record<string, any[]> = {
    threads: [],
    messages: [],
    bookings: [],
    maintenance: [],
    users: [],
    vectors: []
  };

  async onModuleInit() {
    await this.load();
  }

  private async load() {
    try {
      await fs.ensureFile(this.dbPath);
      const content = await fs.readFile(this.dbPath, 'utf-8');
      if (content) {
        this.data = { ...this.data, ...JSON.parse(content) };
        this.logger.log(`Database loaded from ${this.dbPath}`);
      }
    } catch (error) {
      this.logger.warn('Initializing new database due to load error or empty state.');
      await this.save();
    }
  }

  private async save() {
    try {
        await fs.outputFile(this.dbPath, JSON.stringify(this.data, null, 2));
    } catch (error) {
        this.logger.error(`Failed to save database: ${error.message}`);
    }
  }

  async findAll(collection: string) {
    return this.data[collection] || [];
  }

  async findOne(collection: string, id: string) {
    return (this.data[collection] || []).find((item) => item.id === id);
  }

  async create(collection: string, item: any) {
    if (!this.data[collection]) this.data[collection] = [];
    this.data[collection].push(item);
    await this.save();
    return item;
  }

  async update(collection: string, id: string, updates: any) {
    const index = this.data[collection]?.findIndex((item) => item.id === id);
    if (index !== undefined && index !== -1) {
      this.data[collection][index] = { ...this.data[collection][index], ...updates };
      await this.save();
      return this.data[collection][index];
    }
    return null;
  }

  async delete(collection: string, id: string) {
    if (!this.data[collection]) return false;
    const initialLength = this.data[collection].length;
    this.data[collection] = this.data[collection].filter((item) => item.id !== id);
    await this.save();
    return this.data[collection].length < initialLength;
  }
}

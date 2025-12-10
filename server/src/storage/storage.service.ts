
import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
  private readonly uploadDir = path.resolve('./uploads');

  constructor() {
    fs.ensureDirSync(this.uploadDir);
  }

  async saveFile(file: any): Promise<string> {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    const filePath = path.join(this.uploadDir, filename);

    await fs.writeFile(filePath, file.buffer);
    
    // Return relative URL for the API
    return `/api/storage/${filename}`;
  }

  async getFilePath(filename: string): Promise<string> {
    const filePath = path.join(this.uploadDir, filename);
    if (!await fs.pathExists(filePath)) {
      throw new NotFoundException('File not found');
    }
    return filePath;
  }
}

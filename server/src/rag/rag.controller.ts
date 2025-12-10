
import { Controller, Post, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { QueueService } from '../queue/queue.service';
import { StorageService } from '../storage/storage.service';

@Controller('rag')
export class RagController {
  constructor(
      private readonly queueService: QueueService,
      private readonly storageService: StorageService
  ) {}

  @Post('ingest')
  @UseInterceptors(FileInterceptor('file'))
  async ingestDocument(@UploadedFile() file: any, @Body('category') category: string) {
    if (!file) return { error: 'No file provided' };
    
    // 1. Save file locally/S3
    const fileUrl = await this.storageService.saveFile(file);
    const filePath = await this.storageService.getFilePath(fileUrl.split('/').pop());

    // 2. Offload processing to queue
    const jobId = await this.queueService.addJob('ingest_document', {
        filePath,
        mimeType: file.mimetype,
        category: category || 'general'
    });

    return { success: true, status: 'processing', jobId };
  }
}

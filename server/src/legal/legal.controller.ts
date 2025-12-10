
import { Controller, Get, Post, UseInterceptors, UploadedFile, Body, UseGuards } from '@nestjs/common';
import { LegalService } from './legal.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

@Controller('legal')
@UseGuards(AuthGuard('jwt'))
export class LegalController {
  constructor(private readonly legalService: LegalService) {}

  @Get('contracts')
  async getContracts() {
      return this.legalService.getAll();
  }

  @Post('contracts')
  @UseInterceptors(FileInterceptor('file'))
  async uploadContract(@UploadedFile() file: any, @Body('type') type: string) {
      return this.legalService.uploadContract(file, type);
  }
}

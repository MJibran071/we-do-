
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AiModelConfig } from './ai-model-config.entity';

@Controller('ai/models')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AiController {
  constructor(private readonly aiService: AiService) { }

  @Get()
  async getModels() {
    return this.aiService.findAll();
  }

  @Post()
  @Roles('Admin', 'Owner')
  async createModel(@Body() body: Partial<AiModelConfig>) {
    return this.aiService.create(body);
  }

  @Patch(':id')
  @Roles('Admin', 'Owner')
  async updateModel(@Param('id') id: string, @Body() body: Partial<AiModelConfig>) {
    return this.aiService.update(id, body);
  }

  @Delete(':id')
  @Roles('Admin', 'Owner')
  async deleteModel(@Param('id') id: string) {
    return this.aiService.delete(id);
  }
}

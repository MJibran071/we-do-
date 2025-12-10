
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { AuthGuard } from '@nestjs/passport';
import { MessageTemplate } from './template.entity';

@Controller('templates')
@UseGuards(AuthGuard('jwt'))
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) { }

  @Get()
  async getTemplates(@Request() req) {
    return this.templatesService.findAll(req.user.userId);
  }

  @Post()
  async createTemplate(@Request() req, @Body() body: Partial<MessageTemplate>) {
    return this.templatesService.create({
      ...body,
      userId: req.user.userId
    });
  }

  @Patch(':id')
  async updateTemplate(@Param('id') id: string, @Body() body: Partial<MessageTemplate>) {
    return this.templatesService.update(id, body);
  }

  @Delete(':id')
  async deleteTemplate(@Param('id') id: string) {
    return this.templatesService.delete(id);
  }
}

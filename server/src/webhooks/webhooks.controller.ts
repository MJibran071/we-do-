import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

export class CreateWebhookDto {
  name: string;
  url: string;
  events: string[];
  secret?: string;
  headers?: Record<string, string>;
}

export class UpdateWebhookDto {
  name?: string;
  url?: string;
  events?: string[];
  isActive?: boolean;
  secret?: string;
  headers?: Record<string, string>;
}

@ApiTags('webhooks')
@Controller('api/webhooks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Get()
  @ApiOperation({ summary: 'List all webhooks' })
  @ApiResponse({ status: 200, description: 'Returns all webhooks' })
  async findAll(@Request() req) {
    return this.webhooksService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get webhook by ID' })
  @ApiResponse({ status: 200, description: 'Returns webhook details' })
  @ApiResponse({ status: 404, description: 'Webhook not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.webhooksService.findOne(id, req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new webhook' })
  @ApiResponse({ status: 201, description: 'Webhook created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid webhook data' })
  async create(@Body() dto: CreateWebhookDto, @Request() req) {
    return this.webhooksService.create(dto, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update webhook' })
  @ApiResponse({ status: 200, description: 'Webhook updated successfully' })
  @ApiResponse({ status: 404, description: 'Webhook not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateWebhookDto, @Request() req) {
    return this.webhooksService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete webhook' })
  @ApiResponse({ status: 200, description: 'Webhook deleted successfully' })
  @ApiResponse({ status: 404, description: 'Webhook not found' })
  async delete(@Param('id') id: string, @Request() req) {
    return this.webhooksService.delete(id, req.user.id);
  }

  @Post(':id/test')
  @ApiOperation({ summary: 'Test webhook' })
  @ApiResponse({ status: 200, description: 'Test payload sent successfully' })
  @ApiResponse({ status: 404, description: 'Webhook not found' })
  async test(@Param('id') id: string, @Request() req) {
    return this.webhooksService.test(id, req.user.id);
  }

  @Get(':id/logs')
  @ApiOperation({ summary: 'Get webhook delivery logs' })
  @ApiResponse({ status: 200, description: 'Returns webhook logs' })
  async getLogs(@Param('id') id: string, @Request() req) {
    return this.webhooksService.getLogs(id, req.user.id);
  }
}


import { Controller, Get, Post, Delete, Body, UseGuards, Param, Request } from '@nestjs/common';
import { DeveloperService } from './developer.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('developer')
@UseGuards(AuthGuard('jwt'))
export class DeveloperController {
  constructor(private readonly devService: DeveloperService) {}

  @Get('keys')
  async getKeys(@Request() req) {
    return this.devService.getKeys(req.user.userId);
  }

  @Post('keys')
  async createKey(@Request() req, @Body('name') name: string) {
    return this.devService.createKey(req.user.userId, name);
  }

  @Delete('keys/:id')
  async revokeKey(@Request() req, @Param('id') id: string) {
    return this.devService.revokeKey(id, req.user.userId);
  }
}

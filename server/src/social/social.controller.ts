
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { SocialService } from './social.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('social')
@UseGuards(AuthGuard('jwt'))
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Get('posts')
  async getPosts() {
    return this.socialService.getPosts();
  }

  @Post('generate')
  async generateCampaign(@Body() body: { theme: string; businessType: string }) {
    return this.socialService.generateCampaign(body.theme, body.businessType);
  }
}

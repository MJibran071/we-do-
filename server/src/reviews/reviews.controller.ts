
import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Review } from './review.entity';

@Controller('reviews')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  async getReviews() {
    return this.reviewsService.findAll();
  }

  @Post()
  @Roles('Admin', 'Agent', 'System') // 'System' for webhooks
  async createReview(@Body() body: Partial<Review>) {
    return this.reviewsService.create(body);
  }

  @Patch(':id/reply')
  @Roles('Admin', 'Agent', 'Owner')
  async replyToReview(@Param('id') id: string, @Body('reply') reply: string) {
    return this.reviewsService.reply(id, reply);
  }

  @Get('trends')
  async getTrends() {
      return this.reviewsService.getTrends();
  }
}

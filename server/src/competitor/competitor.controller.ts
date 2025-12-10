
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CompetitorService } from './competitor.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('competitors')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CompetitorController {
  constructor(private readonly competitorService: CompetitorService) {}

  @Get()
  async getAll() {
    return this.competitorService.getAll();
  }

  @Post('track')
  @Roles('Admin', 'Owner', 'Manager')
  async trackCompetitor(@Body('url') url: string) {
    return this.competitorService.trackCompetitor(url);
  }

  @Post(':id/refresh')
  @Roles('Admin', 'Owner')
  async refreshAnalysis(@Param('id') id: string) {
    return this.competitorService.refreshAnalysis(id);
  }

  @Get('insights')
  async getInsights() {
      return this.competitorService.getInsights();
  }
}

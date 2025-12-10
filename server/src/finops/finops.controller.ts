
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { FinOpsService } from './finops.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('finops')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class FinOpsController {
  constructor(private readonly finOpsService: FinOpsService) {}

  @Get('transactions')
  async getTransactions() {
    return this.finOpsService.getTransactions();
  }

  @Post('transactions')
  async addTransaction(@Body() body: any) {
    return this.finOpsService.addTransaction(body);
  }

  @Get('budgets')
  async getBudgets() {
    return this.finOpsService.getBudgets();
  }

  @Post('budgets')
  @Roles('Admin', 'Owner')
  async createBudget(@Body() body: any) {
    return this.finOpsService.createBudget(body);
  }

  @Post('audit')
  @Roles('Admin', 'Owner')
  async runAudit() {
    return this.finOpsService.runAudit();
  }

  @Get('forecast')
  @Roles('Admin', 'Owner')
  async getForecast() {
      return this.finOpsService.getCashFlowForecast();
  }
}

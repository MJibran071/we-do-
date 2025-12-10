
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CrmService } from './crm.service';
import { AuthGuard } from '@nestjs/passport';
import { Customer } from './customer.entity';

@Controller('crm')
@UseGuards(AuthGuard('jwt'))
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Get('customers')
  async getCustomers() {
    return this.crmService.findAll();
  }

  @Get('customers/:id')
  async getCustomer(@Param('id') id: string) {
    return this.crmService.findOne(id);
  }

  @Post('customers')
  async createCustomer(@Body() body: Partial<Customer>) {
    return this.crmService.createOrUpdate(body);
  }
}

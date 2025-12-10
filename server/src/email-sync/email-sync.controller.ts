
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { EmailSyncService } from './email-sync.service';
import { AuthGuard } from '@nestjs/passport';
import { EmailAccount } from './email-account.entity';

@Controller('email-sync')
@UseGuards(AuthGuard('jwt'))
export class EmailSyncController {
  constructor(private readonly emailService: EmailSyncService) {}

  @Get('accounts')
  async getAccounts() {
    return this.emailService.getAccounts();
  }

  @Post('accounts')
  async addAccount(@Body() config: Partial<EmailAccount>) {
    return this.emailService.addAccount(config);
  }
  
  @Post('poll')
  async triggerPoll() {
      await this.emailService.pollAllAccounts();
      return { status: 'triggered' };
  }
}

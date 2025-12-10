
import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ActionService } from './action.service';
import { VaultService } from '../vault/vault.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';

@Controller('marketplace')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ActionController {
  constructor(
      private readonly actionService: ActionService,
      private readonly vaultService: VaultService
  ) {}

  @Get('actions')
  async getActions() {
      return this.actionService.getAvailableActions();
  }

  @Post('execute')
  async runAction(@Request() req, @Body() body: { actionId: string; params: any }) {
      return this.actionService.executeAction(req.user.userId, body.actionId, body.params);
  }

  @Post('credentials')
  async saveCredentials(@Request() req, @Body() body: { integrationId: string; keyName: string; value: string }) {
      await this.vaultService.storeSecret(req.user.userId, body.integrationId, body.keyName, body.value);
      return { success: true };
  }
}

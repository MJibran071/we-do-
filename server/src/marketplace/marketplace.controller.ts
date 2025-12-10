
import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AppRegistryService } from './app-registry.service';
import { ConnectionService } from './connection.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('marketplace')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class MarketplaceController {
  constructor(
    private readonly registryService: AppRegistryService,
    private readonly connectionService: ConnectionService
  ) {}

  @Get('apps')
  async getCatalog() {
    return this.registryService.getAll();
  }

  @Get('installed')
  async getInstalled(@Request() req) {
    return this.connectionService.getUserApps(req.user.userId);
  }

  @Post('install/:appId')
  @Roles('Admin', 'Owner')
  async installApp(
      @Request() req, 
      @Param('appId') appId: string,
      @Body() body: { config: any, secrets: any }
  ) {
    return this.connectionService.installApp(req.user.userId, appId, body.config || {}, body.secrets || {});
  }

  @Delete('install/:appId')
  @Roles('Admin', 'Owner')
  async uninstallApp(@Request() req, @Param('appId') appId: string) {
    return this.connectionService.uninstallApp(req.user.userId, appId);
  }
}

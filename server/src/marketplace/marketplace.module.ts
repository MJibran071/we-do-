
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VaultSecret } from './vault/vault.entity';
import { VaultService } from './vault/vault.service';
import { AppAction } from './actions/app-action.entity';
import { ActionService } from './actions/action.service';
import { ActionController } from './actions/action.controller';
import { MarketplaceApp } from './marketplace-app.entity';
import { InstalledApp } from './installed-app.entity';
import { AppRegistryService } from './app-registry.service';
import { ConnectionService } from './connection.service';
import { MarketplaceController } from './marketplace.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        VaultSecret, 
        AppAction, 
        MarketplaceApp, 
        InstalledApp
    ]),
    ConfigModule
  ],
  controllers: [
      ActionController, 
      MarketplaceController
  ],
  providers: [
      VaultService, 
      ActionService, 
      AppRegistryService, 
      ConnectionService
  ],
  exports: [
      VaultService, 
      ActionService, 
      AppRegistryService, 
      ConnectionService
  ]
})
export class MarketplaceModule {}

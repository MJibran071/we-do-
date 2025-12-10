
import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { RpcDiscoveryService } from './rpc-discovery.service';
import { RpcController } from './rpc.controller';

@Module({
  imports: [DiscoveryModule],
  controllers: [RpcController],
  providers: [RpcDiscoveryService],
})
export class RpcModule {}

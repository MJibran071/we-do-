
import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { ToolRegistryService } from './tool-registry.service';
import { GeminiModule } from '../gemini/gemini.module';

@Module({
  imports: [DiscoveryModule, GeminiModule],
  controllers: [AgentController],
  providers: [AgentService, ToolRegistryService],
  exports: [AgentService],
})
export class AgentModule {}

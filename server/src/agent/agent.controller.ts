
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('agent')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post('execute')
  @Roles('Admin', 'Manager', 'Owner')
  async execute(@Body() body: { prompt: string; context?: any }) {
    return this.agentService.executeTask(body.prompt, body.context);
  }
}

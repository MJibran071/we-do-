
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { CopilotService } from './copilot.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('copilot')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CopilotController {
  constructor(private readonly copilotService: CopilotService) {}

  @Post('query')
  @Roles('Admin', 'Manager', 'Owner')
  async askCopilot(@Request() req, @Body() body: { query: string; context?: any }) {
    return this.copilotService.processQuery(req.user.userId, body.query, body.context);
  }

  @Post('voice')
  @Roles('Admin', 'Manager', 'Owner', 'Agent')
  async processVoice(@Request() req, @Body() body: { audio: string; mimeType: string; context?: any }) {
    return this.copilotService.processVoiceCommand(req.user.userId, body.audio, body.mimeType, body.context);
  }
}

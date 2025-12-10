
import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { AiService } from './ai.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('ai')
@UseGuards(AuthGuard('jwt'))
export class AiTaskAssignmentController {
    constructor(private readonly aiService: AiService) { }

    @Get('task-assignments')
    async getTaskAssignments(@Request() req) {
        return this.aiService.getTaskAssignments(req.user.userId);
    }

    @Patch('task-assignments')
    async updateTaskAssignments(@Request() req, @Body() body: { assignments: any }) {
        return this.aiService.updateTaskAssignments(req.user.userId, body.assignments);
    }
}

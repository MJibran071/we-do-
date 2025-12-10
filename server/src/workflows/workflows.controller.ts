
import { Controller, Get, Post, Body } from '@nestjs/common';
import { WorkflowsService, Workflow } from './workflows.service';

@Controller('workflows')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Get()
  getWorkflows() {
    return this.workflowsService.getWorkflows();
  }

  @Post()
  createWorkflow(@Body() workflow: Workflow) {
    return this.workflowsService.createWorkflow(workflow);
  }
}

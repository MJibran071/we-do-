
import { Injectable } from '@nestjs/common';

export interface Workflow {
  id: string;
  name: string;
  active: boolean;
  trigger: { type: string }; // e.g. 'message_received'
  conditions: { field: string; operator: string; value: string }[];
  actions: { type: string; config: any }[];
  runs: number;
}

@Injectable()
export class WorkflowsService {
  private workflows: Workflow[] = [];

  constructor() {
    this.seedWorkflows();
  }

  private seedWorkflows() {
    this.workflows = [
      {
        id: 'wf-1',
        name: 'Negative Sentiment Alert',
        active: true,
        trigger: { type: 'message_received' },
        conditions: [{ field: 'sentiment', operator: 'equals', value: 'Negative' }],
        actions: [{ type: 'notify_team', config: { channel: 'Slack', urgency: 'High' } }],
        runs: 12
      },
      {
        id: 'wf-2',
        name: 'Auto-Reply to Greeting',
        active: true,
        trigger: { type: 'message_received' },
        conditions: [{ field: 'content', operator: 'contains', value: 'Hello' }],
        actions: [{ type: 'send_message', config: { text: 'Hi there! How can I help you today?' } }],
        runs: 45
      }
    ];
  }

  getWorkflows() {
    return this.workflows;
  }

  createWorkflow(workflow: Workflow) {
    this.workflows.push(workflow);
    return workflow;
  }

  async processEvent(eventType: string, payload: any, actionHandler?: (action: any) => Promise<void>) {
    console.log(`Processing event: ${eventType}`);
    
    const applicableWorkflows = this.workflows.filter(
      (wf) => wf.active && wf.trigger.type === eventType,
    );

    for (const wf of applicableWorkflows) {
      const conditionsMet = this.evaluateConditions(wf.conditions, payload);
      if (conditionsMet) {
        console.log(`Workflow matched: ${wf.name}`);
        await this.executeActions(wf.actions, actionHandler);
        wf.runs++;
      }
    }
  }

  private evaluateConditions(conditions: any[], payload: any): boolean {
    // Simple evaluation logic
    return conditions.every((cond) => {
      const value = this.getValueFromPayload(payload, cond.field);
      
      switch (cond.operator) {
        case 'equals': return value == cond.value;
        case 'contains': return typeof value === 'string' && value.toLowerCase().includes(cond.value.toLowerCase());
        case 'greater_than': return value > cond.value;
        default: return false;
      }
    });
  }

  private getValueFromPayload(payload: any, field: string) {
    // Flatten payload access for simplicity (e.g. sentiment comes from metadata)
    if (field === 'sentiment') return payload.metadata?.sentiment;
    if (field === 'priority') return payload.metadata?.priority;
    if (field === 'content') return payload.content;
    return payload[field];
  }

  private async executeActions(actions: any[], actionHandler?: (action: any) => Promise<void>) {
    for (const action of actions) {
      console.log(`Executing action: ${action.type}`, action.config);
      
      if (actionHandler) {
          await actionHandler(action);
      }
    }
  }
}

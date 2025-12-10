
import { Injectable, Logger, OnModuleInit, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppAction } from './app-action.entity';
import { VaultService } from '../vault/vault.service';
import { Buffer } from 'buffer';

@Injectable()
export class ActionService implements OnModuleInit {
  private readonly logger = new Logger(ActionService.name);

  constructor(
    @InjectRepository(AppAction)
    private actionRepo: Repository<AppAction>,
    private readonly vaultService: VaultService
  ) {}

  async onModuleInit() {
      await this.seedActions();
  }

  private async seedActions() {
      const actions = [
          {
              id: 'slack.post_message',
              appName: 'slack',
              actionName: 'Post Message',
              description: 'Send a message to a Slack channel',
              method: 'POST',
              endpointUrl: 'https://slack.com/api/chat.postMessage',
              inputSchema: {
                  channel: { type: 'string', description: 'Channel ID' },
                  text: { type: 'string', description: 'Message content' }
              }
          },
          {
              id: 'hubspot.create_contact',
              appName: 'hubspot',
              actionName: 'Create Contact',
              description: 'Add a new contact to HubSpot CRM',
              method: 'POST',
              endpointUrl: 'https://api.hubapi.com/crm/v3/objects/contacts',
              inputSchema: {
                  properties: { 
                      type: 'object',
                      properties: {
                          email: { type: 'string' },
                          firstname: { type: 'string' },
                          lastname: { type: 'string' }
                      }
                  }
              }
          },
          // --- NEW ACTIONS ---
          {
              id: 'mailchimp.add_subscriber',
              appName: 'mailchimp',
              actionName: 'Add Subscriber',
              description: 'Add a new member to a Mailchimp audience list',
              method: 'POST',
              // Note: URL needs dynamic server prefix replacement in a real scenario
              endpointUrl: 'https://{server}.api.mailchimp.com/3.0/lists/{list_id}/members', 
              inputSchema: {
                  email_address: { type: 'string' },
                  status: { type: 'string', default: 'subscribed' },
                  merge_fields: { type: 'object' }
              }
          },
          {
              id: 'google_calendar.create_event',
              appName: 'google_calendar',
              actionName: 'Create Event',
              description: 'Add an event to the primary calendar',
              method: 'POST',
              endpointUrl: 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
              inputSchema: {
                  summary: { type: 'string' },
                  start: { type: 'object', properties: { dateTime: { type: 'string' } } },
                  end: { type: 'object', properties: { dateTime: { type: 'string' } } }
              }
          },
          {
              id: 'notion.create_page',
              appName: 'notion',
              actionName: 'Create Page',
              description: 'Create a new page in a database',
              method: 'POST',
              endpointUrl: 'https://api.notion.com/v1/pages',
              inputSchema: {
                  parent: { type: 'object', properties: { database_id: { type: 'string' } } },
                  properties: { type: 'object' }
              }
          }
      ];

      // Upsert actions
      await this.actionRepo.save(actions as any);
      this.logger.log(`Seeded ${actions.length} marketplace actions`);
  }

  async getAvailableActions() {
      return this.actionRepo.find({ where: { isActive: true } });
  }

  async executeAction(userId: string, actionId: string, params: any) {
      const actionDef = await this.actionRepo.findOne({ where: { id: actionId } });
      if (!actionDef) throw new BadRequestException(`Action ${actionId} not found`);

      // 1. Retrieve Credentials
      let token = await this.vaultService.getDecryptedSecret(userId, actionDef.appName, 'access_token');
      if (!token) token = await this.vaultService.getDecryptedSecret(userId, actionDef.appName, 'apiKey');
      
      if (!token) {
          throw new BadRequestException(`No credentials found for ${actionDef.appName}. Please connect integration first.`);
      }

      // 2. Prepare Headers
      const headers: any = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      };

      // Special handling for Mailchimp Basic Auth
      if (actionDef.appName === 'mailchimp') {
          headers['Authorization'] = 'Basic ' + Buffer.from(`anystring:${token}`).toString('base64');
          // Replace server prefix in URL
          const serverPrefix = await this.vaultService.getDecryptedSecret(userId, actionDef.appName, 'serverPrefix') || 'us1';
          actionDef.endpointUrl = actionDef.endpointUrl.replace('{server}', serverPrefix);
          // Assuming list_id is passed in params or stored. For now, simplistic check.
          if (params.list_id) {
              actionDef.endpointUrl = actionDef.endpointUrl.replace('{list_id}', params.list_id);
              delete params.list_id; // Remove from body
          }
      }

      // Special handling for Notion Version
      if (actionDef.appName === 'notion') {
          headers['Notion-Version'] = '2022-06-28';
      }

      // 3. Execute Request
      this.logger.log(`Executing ${actionId} for user ${userId}`);
      
      try {
          const response = await fetch(actionDef.endpointUrl, {
              method: actionDef.method,
              headers,
              body: actionDef.method !== 'GET' ? JSON.stringify(params) : undefined
          });

          const data = await response.json();
          
          if (!response.ok) {
              this.logger.error(`Action failed: ${JSON.stringify(data)}`);
              throw new Error(data.error?.message || data.detail || 'External API Error');
          }

          return { success: true, data };
      } catch (error) {
          this.logger.error(error);
          return { success: false, error: error.message };
      }
  }
}

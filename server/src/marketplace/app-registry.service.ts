
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketplaceApp } from './marketplace-app.entity';

@Injectable()
export class AppRegistryService implements OnModuleInit {
  private readonly logger = new Logger(AppRegistryService.name);

  constructor(
    @InjectRepository(MarketplaceApp)
    private appRepo: Repository<MarketplaceApp>
  ) {}

  async onModuleInit() {
    await this.seedApps();
  }

  private async seedApps() {
    // Check if we need to re-seed or update. For simplicity, we upsert based on ID.
    this.logger.log('Seeding Marketplace Apps...');
    
    const apps: Partial<MarketplaceApp>[] = [
      {
        id: 'airbnb',
        name: 'Airbnb',
        description: 'Sync messages, calendar, and reservations.',
        category: 'Channel Manager',
        logoUrl: 'https://cdn.simpleicons.org/airbnb/FF5A5F',
        authType: 'oauth2',
        configSchema: [
            { name: 'clientId', label: 'Client ID', type: 'text', required: true },
            { name: 'clientSecret', label: 'Client Secret', type: 'password', required: true }
        ]
      },
      {
        id: 'whatsapp',
        name: 'WhatsApp',
        description: 'Connect your business number via Meta or Twilio.',
        category: 'Messaging',
        logoUrl: 'https://cdn.simpleicons.org/whatsapp/25D366',
        authType: 'apikey',
        configSchema: [
            { name: 'phoneNumber', label: 'Phone Number', type: 'text', required: true },
            { name: 'apiKey', label: 'API Key / Token', type: 'password', required: true }
        ]
      },
      {
        id: 'stripe',
        name: 'Stripe',
        description: 'Process payments and invoices.',
        category: 'Operations',
        logoUrl: 'https://cdn.simpleicons.org/stripe/635BFF',
        authType: 'apikey',
        configSchema: [
            { name: 'publishableKey', label: 'Publishable Key', type: 'text', required: true },
            { name: 'secretKey', label: 'Secret Key', type: 'password', required: true }
        ]
      },
      {
        id: 'opentable',
        name: 'OpenTable',
        description: 'Sync restaurant reservations.',
        category: 'Channel Manager',
        logoUrl: 'https://cdn.simpleicons.org/opentable/DA3743',
        authType: 'apikey',
        configSchema: [
            { name: 'restaurantId', label: 'Restaurant ID', type: 'text', required: true },
            { name: 'partnerToken', label: 'Partner Token', type: 'password', required: true }
        ]
      },
      {
        id: 'shopify',
        name: 'Shopify',
        description: 'Sync products and orders.',
        category: 'Operations',
        logoUrl: 'https://cdn.simpleicons.org/shopify/96BF48',
        authType: 'oauth2',
        configSchema: [
            { name: 'shopUrl', label: 'Shop URL', type: 'text', required: true },
            { name: 'accessToken', label: 'Access Token', type: 'password', required: true }
        ]
      },
      {
        id: 'pricelabs',
        name: 'PriceLabs',
        description: 'Dynamic pricing optimization.',
        category: 'Pricing',
        logoUrl: 'https://pbs.twimg.com/profile_images/1400750000000000000/00000000_400x400.jpg',
        authType: 'apikey',
        configSchema: [
            { name: 'apiKey', label: 'API Key', type: 'password', required: true }
        ]
      },
      {
        id: 'slack',
        name: 'Slack',
        description: 'Team collaboration and alerts.',
        category: 'Messaging',
        logoUrl: 'https://cdn.simpleicons.org/slack/4A154B',
        authType: 'oauth2',
        configSchema: [
            { name: 'access_token', label: 'Bot Token', type: 'password', required: true }
        ]
      },
      // --- NEW APPS ---
      {
        id: 'mailchimp',
        name: 'Mailchimp',
        description: 'Email marketing and automation.',
        category: 'Marketing',
        logoUrl: 'https://cdn.simpleicons.org/mailchimp/FFE01B',
        authType: 'apikey',
        configSchema: [
            { name: 'apiKey', label: 'API Key', type: 'password', required: true },
            { name: 'serverPrefix', label: 'Server Prefix (e.g. us19)', type: 'text', required: true }
        ]
      },
      {
        id: 'hubspot',
        name: 'HubSpot',
        description: 'CRM, marketing, sales, and customer service.',
        category: 'CRM',
        logoUrl: 'https://cdn.simpleicons.org/hubspot/FF7A59',
        authType: 'oauth2',
        configSchema: [
            { name: 'accessToken', label: 'Access Token', type: 'password', required: true },
            { name: 'portalId', label: 'Portal ID', type: 'text', required: false }
        ]
      },
      {
        id: 'quickbooks',
        name: 'QuickBooks Online',
        description: 'Accounting software for small businesses.',
        category: 'FinOps',
        logoUrl: 'https://cdn.simpleicons.org/quickbooks/2CA01C',
        authType: 'oauth2',
        configSchema: [
            { name: 'accessToken', label: 'Access Token', type: 'password', required: true },
            { name: 'realmId', label: 'Company ID (Realm ID)', type: 'text', required: true }
        ]
      },
      {
        id: 'google_calendar',
        name: 'Google Calendar',
        description: 'Schedule appointments and events.',
        category: 'Productivity',
        logoUrl: 'https://cdn.simpleicons.org/googlecalendar/4285F4',
        authType: 'oauth2',
        configSchema: [
            { name: 'clientId', label: 'Client ID', type: 'text', required: true },
            { name: 'clientSecret', label: 'Client Secret', type: 'password', required: true }
        ]
      },
      {
        id: 'notion',
        name: 'Notion',
        description: 'All-in-one workspace for notes and docs.',
        category: 'Productivity',
        logoUrl: 'https://cdn.simpleicons.org/notion/000000',
        authType: 'oauth2',
        configSchema: [
            { name: 'integrationToken', label: 'Internal Integration Token', type: 'password', required: true }
        ]
      },
      {
        id: 'zendesk',
        name: 'Zendesk',
        description: 'Customer service software and support ticketing.',
        category: 'Support',
        logoUrl: 'https://cdn.simpleicons.org/zendesk/03363D',
        authType: 'apikey',
        configSchema: [
            { name: 'subdomain', label: 'Subdomain', type: 'text', required: true },
            { name: 'email', label: 'Agent Email', type: 'text', required: true },
            { name: 'apiToken', label: 'API Token', type: 'password', required: true }
        ]
      }
    ];

    await this.appRepo.save(apps);
  }

  async getAll() {
    return this.appRepo.find({ order: { category: 'ASC', name: 'ASC' } });
  }

  async getOne(id: string) {
    return this.appRepo.findOne({ where: { id } });
  }
}

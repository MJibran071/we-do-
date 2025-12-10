#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const integrations = [
    // Smart Locks & Access
    { name: 'AugustLock', file: 'AugustLockConfig', color: 'slate', icon: 'Lock', title: 'August Smart Lock Integration', features: [{ icon: 'Lock', text: '<strong>Smart lock control</strong> - Remote lock/unlock' }, { icon: 'Key', text: '<strong>Auto-unlock</strong> - Hands-free entry' }, { icon: 'Clock', text: '<strong>Access schedules</strong> - Time-based permissions' }, { icon: 'Bell', text: '<strong>Activity feed</strong> - Real-time entry notifications' }], stats: [{ value: '1M+', label: 'Locks Sold' }, { value: '4.5/5', label: 'Rating' }, { value: '24/7', label: 'Access' }], setup: ['Download <strong>August app</strong>', 'Add your locks', 'Go to <strong>Settings → Integrations</strong>', 'Generate <strong>API Key</strong>', 'Paste credential below'], notes: ['• Works with existing deadbolts', '• Battery powered (6-12 months)', '• Integrates with Alexa, Google Home'] },

    { name: 'YaleLock', file: 'YaleLockConfig', color: 'blue', icon: 'Lock', title: 'Yale Smart Lock Integration', features: [{ icon: 'Lock', text: '<strong>Keyless entry</strong> - PIN codes for guests' }, { icon: 'Smartphone', text: '<strong>Remote access</strong> - Control from anywhere' }, { icon: 'Shield', text: '<strong>Tamper alerts</strong> - Security notifications' }, { icon: 'Battery', text: '<strong>Low battery alerts</strong> - Never get locked out' }], stats: [{ value: '180+', label: 'Years History' }, { value: '5M+', label: 'Locks Sold' }, { value: 'A+', label: 'Security Rating' }], setup: ['Install Yale smart lock', 'Download <strong>Yale Access app</strong>', 'Create account and add lock', 'Go to <strong>Settings → API</strong>', 'Copy <strong>API Key</strong>'], notes: ['• Z-Wave or WiFi models available', '• Works with Ring, Alexa', '• Lifetime warranty on finish'] },

    { name: 'Ring', file: 'RingConfig', color: 'cyan', icon: 'Video', title: 'Ring Security Integration', features: [{ icon: 'Video', text: '<strong>Video doorbell</strong> - See and speak to guests' }, { icon: 'Bell', text: '<strong>Motion alerts</strong> - Real-time notifications' }, { icon: 'MessageCircle', text: '<strong>Two-way audio</strong> - Communicate remotely' }, { icon: 'Clock', text: '<strong>Video history</strong> - 60-day cloud recording' }], stats: [{ value: '20M+', label: 'Devices' }, { value: '99.9%', label: 'Uptime' }, { value: '1080p', label: 'HD Video' }], setup: ['Install Ring device', 'Download <strong>Ring app</strong>', 'Go to <strong>Account → Authorized Clients</strong>', 'Generate <strong>OAuth Token</strong>', 'Paste credential below'], notes: ['• Subscription: $4/month per device', '• Works with Alexa', '• Professional monitoring available'] },

    // Pricing & Revenue
    { name: 'BeyondPricing', file: 'BeyondPricingConfig', color: 'emerald', icon: 'TrendingUp', title: 'Beyond Pricing Revenue Management', features: [{ icon: 'TrendingUp', text: '<strong>Dynamic pricing</strong> - AI-powered rate optimization' }, { icon: 'BarChart3', text: '<strong>Market data</strong> - Competitor analysis' }, { icon: 'Calendar', text: '<strong>Seasonal adjustments</strong> - Holiday and event pricing' }, { icon: 'Zap', text: '<strong>Auto-sync</strong> - Real-time rate updates' }], stats: [{ value: '25K+', label: 'Properties' }, { value: '+30%', label: 'Avg Revenue Increase' }, { value: '24/7', label: 'Optimization' }], setup: ['Sign up at <a href="https://beyondpricing.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Beyond Pricing</a>', 'Connect your PMS or channel manager', 'Copy <strong>API Key</strong> from settings', 'Paste credential below'], notes: ['• 1% of revenue or $20/month minimum', '• 30-day free trial', '• Works with all major PMSs'] },

    // Website & Booking
    { name: 'WordPress', file: 'WordPressConfig', color: 'blue', icon: 'Globe', title: 'WordPress Website Integration', features: [{ icon: 'Globe', text: '<strong>Direct booking</strong> - Commission-free website' }, { icon: 'Edit', text: '<strong>Content management</strong> - Easy website updates' }, { icon: 'Search', text: '<strong>SEO optimization</strong> - Rank higher in Google' }, { icon: 'Puzzle', text: '<strong>Plugins</strong> - 60,000+ extensions' }], stats: [{ value: '43%', label: 'Of All Websites' }, { value: '60K+', label: 'Plugins' }, { value: 'Free', label: 'Open Source' }], setup: ['Install WordPress on your domain', 'Go to <strong>Plugins → Add New</strong>', 'Search for "REST API Authentication"', 'Generate <strong>Application Password</strong>', 'Paste credentials below'], notes: ['• Free and open source', '• Requires web hosting ($5-20/month)', '• Thousands of themes available'] },

    { name: 'Wix', file: 'WixConfig', color: 'purple', icon: 'Layout', title: 'Wix Website Builder Integration', features: [{ icon: 'Layout', text: '<strong>Drag-and-drop builder</strong> - No coding required' }, { icon: 'Calendar', text: '<strong>Booking widget</strong> - Integrated reservation system' }, { icon: 'CreditCard', text: '<strong>Payment processing</strong> - Accept online payments' }, { icon: 'Smartphone', text: '<strong>Mobile optimized</strong> - Responsive design' }], stats: [{ value: '230M+', label: 'Users' }, { value: '900+', label: 'Templates' }, { value: '24/7', label: 'Support' }], setup: ['Sign up at <a href="https://www.wix.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Wix</a>', 'Create your website', 'Go to <strong>Settings → API Keys</strong>', 'Generate <strong>API Key</strong> and <strong>Site ID</strong>', 'Paste credentials below'], notes: ['• Free plan available', '• Premium: $16-45/month', '• Includes hosting and domain'] },

    { name: 'Squarespace', file: 'SquarespaceConfig', color: 'gray', icon: 'Layout', title: 'Squarespace Website Integration', features: [{ icon: 'Layout', text: '<strong>Beautiful templates</strong> - Designer-quality websites' }, { icon: 'Calendar', text: '<strong>Scheduling</strong> - Built-in booking system' }, { icon: 'ShoppingBag', text: '<strong>E-commerce</strong> - Sell products and services' }, { icon: 'BarChart3', text: '<strong>Analytics</strong> - Traffic and conversion tracking' }], stats: [{ value: '4M+', label: 'Websites' }, { value: '100+', label: 'Templates' }, { value: 'Award', label: 'Winning Design' }], setup: ['Sign up at <a href="https://www.squarespace.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Squarespace</a>', 'Build your website', 'Go to <strong>Settings → Advanced → API Keys</strong>', 'Generate <strong>API Key</strong>', 'Paste credential below'], notes: ['• Starts at $16/month', '• Includes hosting and SSL', '• 24/7 customer support'] },

    // Guest Experience
    { name: 'Enso', file: 'EnsoConfig', color: 'indigo', icon: 'Sparkles', title: 'Enso Connect Guest Experience', features: [{ icon: 'Sparkles', text: '<strong>Upsells</strong> - Offer add-ons and upgrades' }, { icon: 'MapPin', text: '<strong>Local recommendations</strong> - Curated guidebooks' }, { icon: 'BookOpen', text: '<strong>Digital guidebook</strong> - Property information' }, { icon: 'Shield', text: '<strong>Guest verification</strong> - ID and background checks' }], stats: [{ value: '10K+', label: 'Properties' }, { value: '+$200', label: 'Avg Upsell Revenue' }, { value: '4.8/5', label: 'Guest Rating' }], setup: ['Sign up at <a href="https://www.ensoconnect.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Enso Connect</a>', 'Create your guidebook', 'Go to <strong>Settings → Integrations</strong>', 'Copy <strong>API Key</strong>', 'Paste credential below'], notes: ['• Starts at $5/property/month', '• Contactless check-in', '• Automated upsell campaigns'] },

    { name: 'Superhog', file: 'SuperhogConfig', color: 'red', icon: 'Shield', title: 'Superhog Guest Screening', features: [{ icon: 'Shield', text: '<strong>Identity verification</strong> - Confirm guest identity' }, { icon: 'DollarSign', text: '<strong>Damage protection</strong> - Up to $3M coverage' }, { icon: 'AlertTriangle', text: '<strong>Risk assessment</strong> - Flag high-risk bookings' }, { icon: 'FileText', text: '<strong>Background checks</strong> - Criminal and eviction history' }], stats: [{ value: '50K+', label: 'Properties' }, { value: '$3M', label: 'Max Coverage' }, { value: '99%', label: 'Approval Rate' }], setup: ['Sign up at <a href="https://www.superhog.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Superhog</a>', 'Configure screening rules', 'Go to <strong>Settings → API</strong>', 'Copy <strong>API Key</strong>', 'Paste credential below'], notes: ['• Pay-per-booking or subscription', '• Instant verification', '• Integrates with major OTAs'] },

    { name: 'Safely', file: 'SafelyConfig', color: 'orange', icon: 'ShieldCheck', title: 'Safely Guest Verification', features: [{ icon: 'ShieldCheck', text: '<strong>Background checks</strong> - Comprehensive screening' }, { icon: 'DollarSign', text: '<strong>Damage waiver</strong> - Up to $5K protection' }, { icon: 'CreditCard', text: '<strong>Security deposits</strong> - Automated collection' }, { icon: 'FileText', text: '<strong>Rental agreements</strong> - Digital signing' }], stats: [{ value: '100K+', label: 'Properties' }, { value: '$5K', label: 'Damage Coverage' }, { value: '< 1min', label: 'Verification Time' }], setup: ['Sign up at <a href="https://www.safely.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Safely</a>', 'Configure verification settings', 'Go to <strong>Settings → Integrations</strong>', 'Copy <strong>API Key</strong>', 'Paste credential below'], notes: ['• $1-5 per reservation', '• Instant verification', '• No security deposit required'] },

    // Transportation & Delivery
    { name: 'Uber', file: 'UberConfig', color: 'black', icon: 'Car', title: 'Uber Transportation Integration', features: [{ icon: 'Car', text: '<strong>Ride booking</strong> - Request rides for guests' }, { icon: 'DollarSign', text: '<strong>Fare estimates</strong> - Upfront pricing' }, { icon: 'MapPin', text: '<strong>Trip tracking</strong> - Real-time location' }, { icon: 'Receipt', text: '<strong>Business profiles</strong> - Centralized billing' }], stats: [{ value: '150M+', label: 'Users' }, { value: '10K+', label: 'Cities' }, { value: '70+', label: 'Countries' }], setup: ['Sign up at <a href="https://developer.uber.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Uber Developer</a>', 'Create application', 'Copy <strong>Client ID</strong> and <strong>Client Secret</strong>', 'Paste credentials below'], notes: ['• API access free', '• Standard Uber rates apply', '• Business profiles available'] },

    { name: 'DoorDash', file: 'DoorDashConfig', color: 'red', icon: 'UtensilsCrossed', title: 'DoorDash Food Delivery Integration', features: [{ icon: 'UtensilsCrossed', text: '<strong>Restaurant discovery</strong> - Browse local restaurants' }, { icon: 'ShoppingBag', text: '<strong>Order placement</strong> - Place orders for guests' }, { icon: 'MapPin', text: '<strong>Delivery tracking</strong> - Real-time updates' }, { icon: 'Star', text: '<strong>Ratings & reviews</strong> - Find top-rated spots' }], stats: [{ value: '25M+', label: 'Users' }, { value: '450K+', label: 'Restaurants' }, { value: '4K+', label: 'Cities' }], setup: ['Sign up at <a href="https://developer.doordash.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">DoorDash Developer</a>', 'Create application', 'Copy <strong>Developer ID</strong> and <strong>Key ID</strong>', 'Paste credentials below'], notes: ['• API access free', '• Standard delivery fees apply', '• DashPass available'] },

    // Reviews & Reputation
    { name: 'TripAdvisor', file: 'TripAdvisorConfig', color: 'green', icon: 'Star', title: 'TripAdvisor Reviews Integration', features: [{ icon: 'Star', text: '<strong>Review monitoring</strong> - Track all reviews' }, { icon: 'MessageCircle', text: '<strong>Response management</strong> - Reply to reviews' }, { icon: 'TrendingUp', text: '<strong>Reputation tracking</strong> - Monitor ratings over time' }, { icon: 'Bell', text: '<strong>Review alerts</strong> - Instant notifications' }], stats: [{ value: '1B+', label: 'Reviews' }, { value: '460M+', label: 'Monthly Visitors' }, { value: '#1', label: 'Travel Site' }], setup: ['Claim your property on <a href="https://www.tripadvisor.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">TripAdvisor</a>', 'Go to <strong>Management Center</strong>', 'Navigate to <strong>API Access</strong>', 'Copy <strong>API Key</strong>', 'Paste credential below'], notes: ['• Free to claim listing', '• Premium features available', '• Boost visibility with ads'] },

    { name: 'GoogleMyBusiness', file: 'GoogleMyBusinessConfig', color: 'blue', icon: 'MapPin', title: 'Google My Business Integration', features: [{ icon: 'MapPin', text: '<strong>Local listing</strong> - Appear in Google Maps' }, { icon: 'Star', text: '<strong>Review management</strong> - Respond to Google reviews' }, { icon: 'Image', text: '<strong>Photo management</strong> - Showcase your property' }, { icon: 'MessageCircle', text: '<strong>Q&A</strong> - Answer customer questions' }], stats: [{ value: '5B+', label: 'Searches/Day' }, { value: 'Free', label: 'Forever' }, { value: '#1', label: 'Search Engine' }], setup: ['Go to <a href="https://business.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Google My Business</a>', 'Claim or create your listing', 'Verify ownership', 'Go to <strong>Settings → API Access</strong>', 'Copy <strong>API Key</strong>'], notes: ['• Completely free', '• Boosts local SEO', '• Integrates with Google Ads'] },

    { name: 'Trustpilot', file: 'TrustpilotConfig', color: 'teal', icon: 'Award', title: 'Trustpilot Reviews Integration', features: [{ icon: 'Award', text: '<strong>Review collection</strong> - Automated review invitations' }, { icon: 'Shield', text: '<strong>Verified reviews</strong> - Build trust with guests' }, { icon: 'Code', text: '<strong>Review widgets</strong> - Display on your website' }, { icon: 'BarChart3', text: '<strong>Analytics</strong> - Track review performance' }], stats: [{ value: '120M+', label: 'Reviews' }, { value: '1M+', label: 'Businesses' }, { value: '4.5/5', label: 'Avg Rating' }], setup: ['Sign up at <a href="https://www.trustpilot.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Trustpilot</a>', 'Claim your business profile', 'Go to <strong>Settings → Integrations</strong>', 'Copy <strong>API Key</strong>', 'Paste credential below'], notes: ['• Free plan available', '• Business: $199/month', '• Verified review badge'] },

    // Automation
    { name: 'Zapier', file: 'ZapierConfig', color: 'orange', icon: 'Zap', title: 'Zapier Workflow Automation', features: [{ icon: 'Zap', text: '<strong>Workflow automation</strong> - Connect 5000+ apps' }, { icon: 'Link', text: '<strong>App connections</strong> - No-code integrations' }, { icon: 'Play', text: '<strong>Triggers & actions</strong> - Automated workflows' }, { icon: 'BarChart3', text: '<strong>Task history</strong> - Monitor automation performance' }], stats: [{ value: '5000+', label: 'App Integrations' }, { value: '5M+', label: 'Users' }, { value: '1B+', label: 'Tasks/Month' }], setup: ['Sign up at <a href="https://zapier.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Zapier</a>', 'Go to <strong>Settings → API Keys</strong>', 'Generate <strong>API Key</strong>', 'Paste credential below'], notes: ['• Free: 100 tasks/month', '• Starter: $19.99/month', '• Multi-step workflows available'] },

    { name: 'Make', file: 'MakeConfig', color: 'purple', icon: 'Workflow', title: 'Make (Integromat) Automation', features: [{ icon: 'Workflow', text: '<strong>Visual automation</strong> - Drag-and-drop workflow builder' }, { icon: 'Zap', text: '<strong>Complex workflows</strong> - Advanced logic and branching' }, { icon: 'Database', text: '<strong>Data transformation</strong> - Format and process data' }, { icon: 'Clock', text: '<strong>Scheduling</strong> - Run workflows on schedule' }], stats: [{ value: '1000+', label: 'App Integrations' }, { value: '500K+', label: 'Users' }, { value: 'Unlimited', label: 'Scenarios' }], setup: ['Sign up at <a href="https://www.make.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Make</a>', 'Go to <strong>Profile → API</strong>', 'Generate <strong>API Token</strong>', 'Paste credential below'], notes: ['• Free: 1,000 operations/month', '• Core: $9/month', '• Visual workflow builder'] },

    { name: 'OpenAI', file: 'OpenAIConfig', color: 'emerald', icon: 'Brain', title: 'OpenAI GPT Integration', features: [{ icon: 'Brain', text: '<strong>AI-powered responses</strong> - Intelligent guest communication' }, { icon: 'MessageCircle', text: '<strong>Content generation</strong> - Automated messages and descriptions' }, { icon: 'Languages', text: '<strong>Translation</strong> - Multi-language support' }, { icon: 'Sparkles', text: '<strong>Sentiment analysis</strong> - Understand guest emotions' }], stats: [{ value: 'GPT-4', label: 'Latest Model' }, { value: '100M+', label: 'Users' }, { value: '175B', label: 'Parameters' }], setup: ['Sign up at <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">OpenAI</a>', 'Go to <strong>API Keys</strong>', 'Create <strong>API Key</strong>', 'Paste credential below'], notes: ['• Pay-as-you-go pricing', '• GPT-4: $0.03/1K tokens', '• Free $5 credit for new users'] },

    // Procurement
    { name: 'AmazonBusiness', file: 'AmazonBusinessConfig', color: 'orange', icon: 'ShoppingCart', title: 'Amazon Business Integration', features: [{ icon: 'ShoppingCart', text: '<strong>Bulk ordering</strong> - Business pricing and quantity discounts' }, { icon: 'DollarSign', text: '<strong>Business pricing</strong> - Exclusive deals and discounts' }, { icon: 'BarChart3', text: '<strong>Purchase analytics</strong> - Track spending by category' }, { icon: 'Truck', text: '<strong>Fast shipping</strong> - Free 2-day delivery with Prime' }], stats: [{ value: '6M+', label: 'Business Customers' }, { value: '500M+', label: 'Products' }, { value: 'Free', label: 'To Join' }], setup: ['Sign up at <a href="https://business.amazon.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Amazon Business</a>', 'Verify business account', 'Go to <strong>Settings → API Access</strong>', 'Generate <strong>API Credentials</strong>', 'Paste credentials below'], notes: ['• Free to join', '• Business Prime: $179/year', '• Bulk discounts available'] },

    { name: 'Faire', file: 'FaireConfig', color: 'indigo', icon: 'Package', title: 'Faire Wholesale Marketplace', features: [{ icon: 'Package', text: '<strong>Wholesale marketplace</strong> - Unique amenities and supplies' }, { icon: 'DollarSign', text: '<strong>Net payment terms</strong> - Pay 60 days after delivery' }, { icon: 'Truck', text: '<strong>Free shipping</strong> - On opening orders' }, { icon: 'Star', text: '<strong>Curated products</strong> - Artisan and boutique items' }], stats: [{ value: '500K+', label: 'Retailers' }, { value: '100K+', label: 'Brands' }, { value: '$25B+', label: 'GMV' }], setup: ['Sign up at <a href="https://www.faire.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Faire</a>', 'Create retailer account', 'Go to <strong>Settings → Integrations</strong>', 'Copy <strong>API Token</strong>', 'Paste credential below'], notes: ['• Free to join', '• Net 60 payment terms', '• Free returns on opening orders'] }
];

const baseDir = '/Users/jibzz/Downloads/we-do-it-for-you-v-1.2.2/components/integrations';

integrations.forEach(integration => {
    const template = `import React from 'react';
import { Integration, AppMode } from '../../types';
import { IntegrationWrapper } from './IntegrationWrapper';
import { ${integration.features.map(f => f.icon).filter((v, i, a) => a.indexOf(v) === i).join(', ')} } from 'lucide-react';

interface ${integration.file}Props {
  integration: Integration;
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: Record<string, string>) => void;
  onDisconnect?: () => void;
  appMode: AppMode;
}

export const ${integration.file}: React.FC<${integration.file}Props> = (props) => {
  return (
    <IntegrationWrapper {...props}>
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-${integration.color}-50 to-${integration.color}-100 dark:from-${integration.color}-900/10 dark:to-${integration.color}-800/10 p-5 rounded-xl border border-${integration.color}-100 dark:border-${integration.color}-900/30">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <${integration.icon} className="w-5 h-5 text-${integration.color}-600 dark:text-${integration.color}-400" />
            ${integration.title}
          </h4>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
${integration.features.map(f => `            <li className="flex items-start gap-2">
              <${f.icon} className="w-4 h-4 text-${integration.color}-600 dark:text-${integration.color}-400 mt-0.5 flex-shrink-0" />
              <span>${f.text}</span>
            </li>`).join('\n')}
          </ul>
        </div>

        <div className="grid grid-cols-3 gap-3">
${integration.stats.map(s => `          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-${integration.color}-600 dark:text-${integration.color}-400">${s.value}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">${s.label}</div>
          </div>`).join('\n')}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Setup Instructions</h4>
          <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
${integration.setup.map(s => `            <li>${s}</li>`).join('\n')}
          </ol>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30">
          <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 text-sm">Important Notes</h4>
          <ul className="space-y-1 text-xs text-amber-800 dark:text-amber-300">
${integration.notes.map(n => `            <li>${n}</li>`).join('\n')}
          </ul>
        </div>
      </div>
    </IntegrationWrapper>
  );
};
`;

    const filePath = path.join(baseDir, `${integration.file}.tsx`);
    fs.writeFileSync(filePath, template);
    console.log(`Created ${integration.file}.tsx`);
});

console.log(`\nBatch 3 complete: Created ${integrations.length} integration configs`);
console.log('Total integrations created so far: ' + (integrations.length + 10));

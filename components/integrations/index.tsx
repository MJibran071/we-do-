// Integration Template Wrappers
// Export all integration-specific configuration components

import React from 'react';

export { IntegrationWrapper } from './IntegrationWrapper';

// Original integrations
export { AirbnbConfig } from './AirbnbConfig';
export { WhatsAppConfig } from './WhatsAppConfig';
export { ShopifyConfig } from './ShopifyConfig';
export { StripeConfig } from './StripeConfig';
export { BookingDotComConfig } from './BookingDotComConfig';
export { OpenTableConfig } from './OpenTableConfig';

// New batch 1 (5 integrations)
export { VRBOConfig } from './VRBOConfig';
export { PriceLabsConfig } from './PriceLabsConfig';
export { TwilioConfig } from './TwilioConfig';
export { RemoteLockConfig } from './RemoteLockConfig';
export { MailchimpConfig } from './MailchimpConfig';

// Additional integrations (35+ more)
export { ExpediaConfig } from './ExpediaConfig';
export { GuestyConfig } from './GuestyConfig';
export { HostawayConfig } from './HostawayConfig';
export { PayPalConfig } from './PayPalConfig';
export { SquareConfig } from './SquareConfig';
export { QuickBooksConfig } from './QuickBooksConfig';
export { XeroConfig } from './XeroConfig';
export { SlackConfig } from './SlackConfig';
export { IntercomConfig } from './IntercomConfig';
export { ZendeskConfig } from './ZendeskConfig';
export { GoogleAnalyticsConfig } from './GoogleAnalyticsConfig';
export { HubSpotConfig } from './HubSpotConfig';
export { FacebookAdsConfig } from './FacebookAdsConfig';
export { BreezewayConfig } from './BreezewayConfig';
export { TurnoverBnBConfig } from './TurnoverBnBConfig';
export { ProperlyConfig } from './ProperlyConfig';
export { AugustLockConfig } from './AugustLockConfig';
export { YaleLockConfig } from './YaleLockConfig';
export { RingConfig } from './RingConfig';
export { BeyondPricingConfig } from './BeyondPricingConfig';
export { WordPressConfig } from './WordPressConfig';
export { WixConfig } from './WixConfig';
export { SquarespaceConfig } from './SquarespaceConfig';
export { EnsoConfig } from './EnsoConfig';
export { SuperhogConfig } from './SuperhogConfig';
export { SafelyConfig } from './SafelyConfig';
export { UberConfig } from './UberConfig';
export { DoorDashConfig } from './DoorDashConfig';
export { TripAdvisorConfig } from './TripAdvisorConfig';
export { GoogleMyBusinessConfig } from './GoogleMyBusinessConfig';
export { TrustpilotConfig } from './TrustpilotConfig';
export { ZapierConfig } from './ZapierConfig';
export { MakeConfig } from './MakeConfig';
export { OpenAIConfig } from './OpenAIConfig';
export { AmazonBusinessConfig } from './AmazonBusinessConfig';
export { FaireConfig } from './FaireConfig';

// Integration template mapping
import { Integration, AppMode } from '../../types';
import { AirbnbConfig } from './AirbnbConfig';
import { WhatsAppConfig } from './WhatsAppConfig';
import { ShopifyConfig } from './ShopifyConfig';
import { StripeConfig } from './StripeConfig';
import { BookingDotComConfig } from './BookingDotComConfig';
import { OpenTableConfig } from './OpenTableConfig';
import { VRBOConfig } from './VRBOConfig';
import { PriceLabsConfig } from './PriceLabsConfig';
import { TwilioConfig } from './TwilioConfig';
import { RemoteLockConfig } from './RemoteLockConfig';
import { MailchimpConfig } from './MailchimpConfig';
import { ExpediaConfig } from './ExpediaConfig';
import { GuestyConfig } from './GuestyConfig';
import { HostawayConfig } from './HostawayConfig';
import { PayPalConfig } from './PayPalConfig';
import { SquareConfig } from './SquareConfig';
import { QuickBooksConfig } from './QuickBooksConfig';
import { XeroConfig } from './XeroConfig';
import { SlackConfig } from './SlackConfig';
import { IntercomConfig } from './IntercomConfig';
import { ZendeskConfig } from './ZendeskConfig';
import { GoogleAnalyticsConfig } from './GoogleAnalyticsConfig';
import { HubSpotConfig } from './HubSpotConfig';
import { FacebookAdsConfig } from './FacebookAdsConfig';
import { BreezewayConfig } from './BreezewayConfig';
import { TurnoverBnBConfig } from './TurnoverBnBConfig';
import { ProperlyConfig } from './ProperlyConfig';
import { AugustLockConfig } from './AugustLockConfig';
import { YaleLockConfig } from './YaleLockConfig';
import { RingConfig } from './RingConfig';
import { BeyondPricingConfig } from './BeyondPricingConfig';
import { WordPressConfig } from './WordPressConfig';
import { WixConfig } from './WixConfig';
import { SquarespaceConfig } from './SquarespaceConfig';
import { EnsoConfig } from './EnsoConfig';
import { SuperhogConfig } from './SuperhogConfig';
import { SafelyConfig } from './SafelyConfig';
import { UberConfig } from './UberConfig';
import { DoorDashConfig } from './DoorDashConfig';
import { TripAdvisorConfig } from './TripAdvisorConfig';
import { GoogleMyBusinessConfig } from './GoogleMyBusinessConfig';
import { TrustpilotConfig } from './TrustpilotConfig';
import { ZapierConfig } from './ZapierConfig';
import { MakeConfig } from './MakeConfig';
import { OpenAIConfig } from './OpenAIConfig';
import { AmazonBusinessConfig } from './AmazonBusinessConfig';
import { FaireConfig } from './FaireConfig';

export interface IntegrationConfigProps {
    integration: Integration;
    isOpen: boolean;
    onClose: () => void;
    onSave: (values: Record<string, string>) => void;
    onDisconnect?: () => void;
    appMode: AppMode;
}

/**
 * Get the appropriate configuration component for an integration
 * Returns a custom wrapper if available, otherwise returns null (will use default)
 */
export const getIntegrationConfig = (integrationName: string) => {
    const configMap: Record<string, React.FC<IntegrationConfigProps>> = {
        // Original integrations
        'Airbnb': AirbnbConfig,
        'WhatsApp': WhatsAppConfig,
        'Shopify': ShopifyConfig,
        'Stripe': StripeConfig,
        'Booking.com': BookingDotComConfig,
        'OpenTable': OpenTableConfig,

        // Batch 1 additions
        'VRBO': VRBOConfig,
        'PriceLabs': PriceLabsConfig,
        'Twilio': TwilioConfig,
        'RemoteLock': RemoteLockConfig,
        'Mailchimp': MailchimpConfig,

        // All additional integrations
        'Expedia': ExpediaConfig,
        'Guesty': GuestyConfig,
        'Hostaway': HostawayConfig,
        'PayPal': PayPalConfig,
        'Square': SquareConfig,
        'QuickBooks': QuickBooksConfig,
        'Xero': XeroConfig,
        'Slack': SlackConfig,
        'Intercom': IntercomConfig,
        'Zendesk': ZendeskConfig,
        'Google Analytics': GoogleAnalyticsConfig,
        'HubSpot': HubSpotConfig,
        'Facebook Ads': FacebookAdsConfig,
        'Breezeway': BreezewayConfig,
        'TurnoverBnB': TurnoverBnBConfig,
        'Properly': ProperlyConfig,
        'August Lock': AugustLockConfig,
        'Yale Lock': YaleLockConfig,
        'Ring': RingConfig,
        'Beyond Pricing': BeyondPricingConfig,
        'WordPress': WordPressConfig,
        'Wix': WixConfig,
        'Squarespace': SquarespaceConfig,
        'Enso Connect': EnsoConfig,
        'Superhog': SuperhogConfig,
        'Safely': SafelyConfig,
        'Uber': UberConfig,
        'DoorDash': DoorDashConfig,
        'TripAdvisor': TripAdvisorConfig,
        'Google My Business': GoogleMyBusinessConfig,
        'Trustpilot': TrustpilotConfig,
        'Zapier': ZapierConfig,
        'Make': MakeConfig,
        'OpenAI': OpenAIConfig,
        'Amazon Business': AmazonBusinessConfig,
        'Faire': FaireConfig,
    };

    return configMap[integrationName] || null;
};

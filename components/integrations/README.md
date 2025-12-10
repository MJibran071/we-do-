# Integration Template Wrappers

This directory contains custom configuration templates for different third-party integrations. Each template provides a tailored setup experience with integration-specific instructions, benefits, and configuration options.

## Architecture

### Base Component: `IntegrationWrapper`
The `IntegrationWrapper` is a reusable base component that provides:
- Consistent modal UI/UX
- Form validation
- Error handling
- Status displays (Connected, Error, Disconnected)
- Security notes
- Documentation links

### Custom Templates
Each integration can have a custom template that extends the `IntegrationWrapper` with:
- Integration-specific benefits and features
- Detailed setup instructions
- Visual aids (icons, stats, previews)
- Special requirements or warnings
- Links to official documentation

## Available Templates

### 1. **AirbnbConfig** (`AirbnbConfig.tsx`)
- **Category**: Channel Manager (Property Management)
- **Features**: 
  - Unified inbox for messages
  - Calendar sync
  - Revenue tracking
  - Guest profile sync
- **Setup**: Requires Client ID and Client Secret from Airbnb Partner Portal

### 2. **WhatsAppConfig** (`WhatsAppConfig.tsx`)
- **Category**: Messaging
- **Features**:
  - Two-way messaging
  - Rich media support (images, videos, documents)
  - Pre-approved message templates
  - AI auto-reply integration
- **Setup Options**: WhatsApp Business API or WhatsApp Cloud API
- **Requirements**: Verified Meta Business Account

### 3. **ShopifyConfig** (`ShopifyConfig.tsx`)
- **Category**: E-commerce
- **Features**:
  - Real-time order sync
  - Inventory management
  - Customer support integration
  - Sales analytics
- **Setup**: Requires Shopify Admin API credentials
- **Permissions**: Read orders, products, customers, inventory

### 4. **StripeConfig** (`StripeConfig.tsx`)
- **Category**: Payment Processing
- **Features**:
  - Payment processing (cards, wallets, bank transfers)
  - Invoice generation
  - Subscription management
  - Payout tracking
- **Special**: Test/Live mode toggle
- **Setup**: Requires Publishable Key and Secret Key

### 5. **BookingDotComConfig** (`BookingDotComConfig.tsx`)
- **Category**: Channel Manager (Property Management)
- **Features**:
  - Two-way calendar sync
  - Guest messaging
  - Reservation details sync
  - Review management
- **Setup**: Requires Property ID and XML API credentials
- **Note**: XML API access requires approval from Booking.com

### 6. **OpenTableConfig** (`OpenTableConfig.tsx`)
- **Category**: Restaurant Reservations
- **Features**:
  - Real-time reservation sync
  - Guest profiles with dining preferences
  - Table management
  - Review monitoring
- **Setup**: Requires Restaurant ID and Partner Token

### 7. **VRBOConfig** (`VRBOConfig.tsx`)
- **Category**: Channel Manager (Property Management)
- **Features**:
  - Two-way calendar sync
  - Unified guest messaging
  - Revenue tracking
  - Guest verification
  - Rate synchronization
- **Setup**: Requires Partner ID and API Key from VRBO Partner Central
- **Note**: API access requires active VRBO subscription

### 8. **PriceLabsConfig** (`PriceLabsConfig.tsx`)
- **Category**: Revenue Management (Dynamic Pricing)
- **Features**:
  - AI-powered pricing optimization
  - Real-time market analysis
  - Automated price updates
  - Seasonal optimization
  - Occupancy target balancing
- **Setup**: Requires API Key and Account ID from PriceLabs
- **Impact**: Average 40% revenue increase reported

### 9. **TwilioConfig** (`TwilioConfig.tsx`)
- **Category**: Communication (SMS/Voice)
- **Features**:
  - SMS automation for guest communication
  - Voice calls and messaging
  - Global reach (180+ countries)
  - Two-way messaging
  - Phone number masking
- **Setup**: Requires Account SID, Auth Token, and Twilio Phone Number
- **Use Cases**: Check-in instructions, door codes, reminders, support

### 10. **RemoteLockConfig** (`RemoteLockConfig.tsx`)
- **Category**: Smart Access Control
- **Features**:
  - Automated access code generation
  - Time-based access (check-in to check-out)
  - Access logs and tracking
  - Remote lock/unlock control
  - Real-time alerts and notifications
- **Setup**: Requires API Key and Organization ID
- **Compatible**: Yale, Schlage, August, Kwikset, Igloohome, Salto locks

### 11. **MailchimpConfig** (`MailchimpConfig.tsx`)
- **Category**: Email Marketing & CRM
- **Features**:
  - Guest segmentation
  - Automated email campaigns
  - Repeat booking campaigns
  - Analytics and A/B testing
  - Audience management
- **Setup**: Requires API Key and Audience ID
- **Use Cases**: Welcome emails, post-stay follow-ups, seasonal promotions, newsletters

## How to Add a New Template

### Step 1: Create the Template Component

Create a new file in `components/integrations/` (e.g., `YourAppConfig.tsx`):

```typescript
import React from 'react';
import { Integration, AppMode } from '../../types';
import { IntegrationWrapper } from './IntegrationWrapper';
import { Icon1, Icon2 } from 'lucide-react';

interface YourAppConfigProps {
  integration: Integration;
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: Record<string, string>) => void;
  onDisconnect?: () => void;
  appMode: AppMode;
}

export const YourAppConfig: React.FC<YourAppConfigProps> = (props) => {
  return (
    <IntegrationWrapper {...props}>
      <div className="space-y-4">
        {/* Add your custom content here */}
        
        {/* Integration Benefits */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Icon1 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Your App Integration Benefits
          </h4>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            {/* List benefits */}
          </ul>
        </div>

        {/* Setup Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            Setup Instructions
          </h4>
          <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
            {/* List setup steps */}
          </ol>
        </div>
      </div>
    </IntegrationWrapper>
  );
};
```

### Step 2: Export the Component

Add your component to `components/integrations/index.tsx`:

```typescript
export { YourAppConfig } from './YourAppConfig';

// Update the configMap
const configMap: Record<string, React.FC<IntegrationConfigProps>> = {
  'Airbnb': AirbnbConfig,
  'WhatsApp': WhatsAppConfig,
  'YourApp': YourAppConfig, // Add this line
  // ... other integrations
};
```

### Step 3: Add Integration Data

Add the integration to `data.ts`:

```typescript
{
  id: 'int_yourapp',
  name: 'YourApp',
  description: 'Brief description of what this integration does',
  logo: 'https://cdn.simpleicons.org/yourapp/COLOR',
  icon: 'IconName',
  status: 'Disconnected',
  category: 'Category',
  configFields: [
    { name: 'apiKey', label: 'API Key', type: 'password' },
    { name: 'accountId', label: 'Account ID', type: 'text' }
  ]
}
```

## Design Guidelines

### Visual Hierarchy
1. **Integration Benefits** - Show value proposition first
2. **Feature Preview** - Visual elements (stats, grids)
3. **Setup Instructions** - Step-by-step guide
4. **Requirements/Warnings** - Important notes

### Color Coding
- **Benefits Section**: Gradient background matching brand colors
- **Instructions**: Blue background (informational)
- **Warnings**: Amber/Yellow background
- **Errors**: Red background
- **Success**: Green background

### Icons
Use Lucide React icons that match the integration's purpose:
- `Home` - Property management
- `MessageCircle` - Messaging
- `ShoppingBag` - E-commerce
- `CreditCard` - Payments
- `Calendar` - Scheduling
- `Utensils` - Restaurant

### Responsive Design
All templates should be:
- Mobile-friendly (responsive grid layouts)
- Scrollable content area
- Fixed header and footer
- Maximum width: `max-w-2xl` (can be larger for complex integrations)

## Testing

When creating a new template:
1. Test in both light and dark modes
2. Test with different `appMode` values
3. Verify form validation works
4. Test connect/disconnect flow
5. Ensure mobile responsiveness

## Best Practices

1. **Keep it Simple**: Don't overwhelm users with too much information
2. **Visual Aids**: Use icons, colors, and layouts to guide users
3. **Clear Instructions**: Number steps, provide links to official docs
4. **Security**: Always mention how credentials are stored
5. **Accessibility**: Use semantic HTML and ARIA labels
6. **Consistency**: Follow the established patterns from existing templates

## Future Enhancements

Potential improvements for the template system:
- [ ] Video tutorials embedded in templates
- [ ] OAuth flow integration
- [ ] Test connection button
- [ ] Import/export configuration
- [ ] Multi-step wizards for complex setups
- [ ] Integration health monitoring
- [ ] Usage analytics per integration

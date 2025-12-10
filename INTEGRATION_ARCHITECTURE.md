# Integration Template Wrappers - Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Integrations.tsx                            │
│                      (Main Integration Page)                        │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             │ User clicks "Connect" or "Configure"
                             │
                             ▼
                  ┌──────────────────────┐
                  │ handleConfigure()    │
                  │ Opens modal          │
                  └──────────┬───────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │ getIntegrationConfig()       │
              │ (from index.tsx)             │
              │                              │
              │ Checks if custom template    │
              │ exists for integration name  │
              └──────────┬───────────────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
         ▼                               ▼
    ┌─────────┐                   ┌──────────────┐
    │ Custom  │                   │   Default    │
    │Template │                   │IntegrationWrapper│
    │ Found   │                   │              │
    └────┬────┘                   └──────┬───────┘
         │                               │
         │                               │
    ┌────▼────────────────────────┐      │
    │  Custom Template Components │      │
    │  (with specialized content) │      │
    │                             │      │
    │  ┌────────────────────┐     │      │
    │  │ AirbnbConfig       │     │      │
    │  ├────────────────────┤     │      │
    │  │ WhatsAppConfig     │     │      │
    │  ├────────────────────┤     │      │
    │  │ ShopifyConfig      │     │      │
    │  ├────────────────────┤     │      │
    │  │ StripeConfig       │     │      │
    │  ├────────────────────┤     │      │
    │  │ BookingDotComConfig│     │      │
    │  ├────────────────────┤     │      │
    │  │ OpenTableConfig    │     │      │
    │  └────────────────────┘     │      │
    │                             │      │
    │  All wrap around:           │      │
    │  ┌────────────────────┐     │      │
    │  │IntegrationWrapper  │◄────┼──────┘
    │  │ (Base Component)   │     │
    │  └────────────────────┘     │
    └─────────────────────────────┘
                 │
                 │ Provides:
                 │ • Modal UI
                 │ • Form validation
                 │ • Error handling
                 │ • Status displays
                 │
                 ▼
    ┌────────────────────────────┐
    │   User fills credentials   │
    │   and clicks "Connect"     │
    └────────────┬───────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │   handleSaveConfig()       │
    │   Updates integration      │
    │   status to "Connected"    │
    └────────────────────────────┘
```

## Component Hierarchy

```
IntegrationWrapper (Base)
│
├── Props Interface
│   ├── integration: Integration
│   ├── isOpen: boolean
│   ├── onClose: () => void
│   ├── onSave: (values) => void
│   ├── onDisconnect?: () => void
│   └── appMode: AppMode
│
├── Features
│   ├── Modal Container
│   ├── Header (Logo, Title, Close Button)
│   ├── Status Banner (Connected/Error/Disconnected)
│   ├── Children Slot (Custom Content)
│   ├── Configuration Fields
│   ├── Form Validation
│   └── Footer (Save Button, Disconnect Button)
│
└── Custom Templates (Extend Base)
    │
    ├── AirbnbConfig
    │   └── Custom Content:
    │       ├── Benefits Section (Pink/Red gradient)
    │       ├── Setup Instructions
    │       └── Security Note
    │
    ├── WhatsAppConfig
    │   └── Custom Content:
    │       ├── Features List (Green gradient)
    │       ├── Setup Options (Business API vs Cloud API)
    │       └── Requirements Checklist
    │
    ├── ShopifyConfig
    │   └── Custom Content:
    │       ├── Benefits (Green/Teal gradient)
    │       ├── Data Sync Preview (Product/Order cards)
    │       ├── Setup Instructions
    │       └── Permissions Display
    │
    ├── StripeConfig
    │   └── Custom Content:
    │       ├── Test/Live Mode Toggle
    │       ├── Payment Methods Grid
    │       ├── Setup Instructions
    │       └── Environment Warnings
    │
    ├── BookingDotComConfig
    │   └── Custom Content:
    │       ├── Benefits (Blue gradient)
    │       ├── Stats Preview (Calendar/Guests/Reviews)
    │       ├── Setup Instructions
    │       └── XML API Note
    │
    └── OpenTableConfig
        └── Custom Content:
            ├── Features (Red/Orange gradient)
            ├── Feature Grid (Real-time/VIP Tags)
            ├── Setup Instructions
            └── Partner Benefits
```

## Data Flow

```
┌─────────────┐
│   data.ts   │  Integration definitions with:
│             │  • id, name, description
│             │  • logo, icon, status
│             │  • category
│             │  • configFields[]
└──────┬──────┘
       │
       │ Imported by
       │
       ▼
┌─────────────────┐
│   App.tsx       │  State management:
│                 │  • integrations state
│                 │  • setIntegrations
└──────┬──────────┘
       │
       │ Passed as props
       │
       ▼
┌──────────────────┐
│ Integrations.tsx │  Displays grid of integrations
│                  │  Handles modal state
└──────┬───────────┘
       │
       │ Opens modal with
       │
       ▼
┌──────────────────────┐
│ Custom Template or   │  Renders configuration UI
│ IntegrationWrapper   │  Collects user input
└──────┬───────────────┘
       │
       │ Calls onSave with
       │
       ▼
┌──────────────────┐
│ handleSaveConfig │  Updates integration state
│                  │  • status: 'Connected'
│                  │  • lastSync: new Date()
└──────────────────┘
```

## Template Selection Logic

```typescript
// In Integrations.tsx
{configModalOpen && currentConfigIntegration && (() => {
  // 1. Get custom config component if available
  const CustomConfig = getIntegrationConfig(currentConfigIntegration.name);
  
  // 2. If custom template exists, use it
  if (CustomConfig) {
    return <CustomConfig {...props} />;
  }
  
  // 3. Otherwise, fall back to default wrapper
  return <IntegrationWrapper {...props} />;
})()}
```

## Registry Pattern (index.tsx)

```typescript
const configMap: Record<string, React.FC<IntegrationConfigProps>> = {
  'Airbnb': AirbnbConfig,
  'WhatsApp': WhatsAppConfig,
  'Shopify': ShopifyConfig,
  'Stripe': StripeConfig,
  'Booking.com': BookingDotComConfig,
  'OpenTable': OpenTableConfig,
  // Easy to add more...
};

export const getIntegrationConfig = (integrationName: string) => {
  return configMap[integrationName] || null;
};
```

## Benefits of This Architecture

1. **Separation of Concerns**
   - Base wrapper handles common functionality
   - Custom templates handle integration-specific content
   - Main component handles state management

2. **Scalability**
   - Easy to add new templates
   - No changes needed to main component
   - Registry pattern keeps it organized

3. **Maintainability**
   - Each template is self-contained
   - Consistent API across all templates
   - Clear file structure

4. **Flexibility**
   - Can customize as much or as little as needed
   - Automatic fallback for simple integrations
   - Reusable base component

5. **User Experience**
   - Tailored setup for each integration
   - Consistent look and feel
   - Professional presentation


import { Platform, MessageStatus, Priority, Thread, Integration, AIModel, TaskAssignment, Booking, BookingStatus, KnowledgeBaseData, Apartment, Expense, MaintenanceIssue, Restaurant, AnalyticsData, MessageTemplate, Review, InventoryItem, CallLog, TeamMember, CustomerProfile, HealthcarePractice, Patient, Appointment } from './types';

const now = new Date();

// --- Property Management Data ---

export const mockApartments: Apartment[] = [
    { id: 'apt1', name: 'Sunset Villa (Unit A)', address: '123 Ocean Dr' },
    { id: 'apt2', name: 'Downtown Loft (Unit 4B)', address: '456 Main St' },
    { id: 'apt3', name: 'Mountain Cabin', address: '789 Pine Rd' }
];

export const mockMaintenanceIssues: MaintenanceIssue[] = [
    {
        id: 'maint-1',
        issue: 'Leaky Faucet',
        location: 'Kitchen',
        priority: 'Medium',
        reportedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24),
        status: 'Open',
        apartmentId: 'apt1'
    },
    {
        id: 'maint-2',
        issue: 'Broken Chair',
        location: 'Patio',
        priority: 'Low',
        reportedAt: new Date(now.getTime() - 1000 * 60 * 60 * 48),
        status: 'Resolved',
        apartmentId: 'apt3'
    }
];

// --- Team Data ---
export const mockTeamMembers: TeamMember[] = [
    {
        id: 'team-1',
        name: 'Sarah Admin',
        email: 'sarah@wedo.com',
        role: 'Admin',
        status: 'Online',
        avatar: 'https://picsum.photos/id/40/50',
        lastActive: new Date()
    },
    {
        id: 'team-2',
        name: 'Mike Agent',
        email: 'mike@wedo.com',
        role: 'Agent',
        status: 'Busy',
        avatar: 'https://picsum.photos/id/45/50',
        lastActive: new Date(now.getTime() - 1000 * 60 * 15)
    },
    {
        id: 'team-3',
        name: 'Bob Fixit',
        email: 'bob.repair@wedo.com',
        role: 'Maintenance',
        status: 'Offline',
        avatar: 'https://picsum.photos/id/55/50',
        lastActive: new Date(now.getTime() - 1000 * 60 * 60 * 2)
    },
    {
        id: 'team-4',
        name: 'Investor Group',
        email: 'owners@invest.com',
        role: 'Owner',
        status: 'Offline',
        avatar: 'https://picsum.photos/id/60/50',
        lastActive: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3)
    }
];

export const mockCustomers: CustomerProfile[] = [
    {
        id: 'cust-1',
        name: 'Sarah Jenkins',
        email: 'sarah.j@example.com',
        phone: '+1 (555) 123-4567',
        avatar: 'https://picsum.photos/id/1011/50',
        totalSpend: 4250,
        visitCount: 3,
        lastVisit: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5),
        status: 'Active',
        churnRisk: 'Low',
        aiPersona: 'Luxury Traveler',
        preferences: ['Ocean View', 'Late Checkout', 'Extra Pillows'],
        marketingConsent: true,
        tags: ['VIP', 'Returning'],
        history: [
            { id: 'h1', date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5), description: 'Stay at Sunset Villa', amount: 1450 },
            { id: 'h2', date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 180), description: 'Stay at Downtown Loft', amount: 1200 },
            { id: 'h3', date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 365), description: 'Stay at Sunset Villa', amount: 1600 }
        ]
    },
    {
        id: 'cust-2',
        name: 'Davide Rossi',
        email: 'davide.r@example.it',
        phone: '+39 333 1234567',
        avatar: 'https://picsum.photos/id/305/50',
        totalSpend: 850,
        visitCount: 1,
        lastVisit: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 45),
        status: 'Drifting',
        churnRisk: 'Medium',
        aiPersona: 'Price Conscious',
        preferences: ['Self Check-in', 'Discount Code'],
        marketingConsent: false,
        tags: ['International'],
        history: [
            { id: 'h4', date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 45), description: 'Stay at Downtown Loft', amount: 850 }
        ]
    },
    {
        id: 'cust-3',
        name: 'Michael Ross',
        email: 'mike.ross@example.com',
        phone: '+1 (555) 987-6543',
        avatar: 'https://picsum.photos/id/1005/50',
        totalSpend: 2100,
        visitCount: 2,
        lastVisit: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 120),
        status: 'Churned',
        churnRisk: 'High',
        aiPersona: 'Business Traveler',
        preferences: ['High Speed WiFi', 'Desk', 'Quiet'],
        marketingConsent: true,
        tags: ['Complaint History'],
        history: [
            { id: 'h5', date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 120), description: 'Stay at Mountain Cabin', amount: 900 },
            { id: 'h6', date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 200), description: 'Stay at Downtown Loft', amount: 1200 }
        ]
    }
];

export const mockTemplates: MessageTemplate[] = [
    {
        id: 'tmp-1',
        title: 'Check-in Guide',
        category: 'Check-in',
        content: "Hi! Here is the map to find the hidden keybox. The code is 1992. Please park in the spot marked 'A'.",
        imageUrls: ['https://images.unsplash.com/photo-1524813686514-a5756c97759e?q=80&w=400&auto=format&fit=crop']
    },
    {
        id: 'tmp-2',
        title: 'WiFi & House Rules',
        category: 'General',
        content: "Welcome! The WiFi network is 'Sunset_Guest' and pass is 'surf2026'. Please respect quiet hours after 10 PM.",
        imageUrls: ['https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=400&auto=format&fit=crop']
    },
    {
        id: 'tmp-3',
        title: 'Menu Highlights',
        category: 'Restaurant',
        content: "Here is a photo of our Chef's Specials for this week. The Truffle Pasta is highly recommended!",
        imageUrls: ['https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=400&auto=format&fit=crop']
    }
];

export const mockThreads: Thread[] = [
    {
        id: 't1',
        platform: Platform.Airbnb,
        participants: [{
            id: 'u1',
            name: 'Sarah Jenkins',
            avatar: 'https://picsum.photos/id/1011/50',
            email: 'sarah.j@example.com',
            phone: '+1 (555) 123-4567',
            tags: ['VIP', 'Returning'],
            notes: 'Likes extra pillows. Allergies to cats. Usually travels with her husband.'
        }],
        status: MessageStatus.Unread,
        priority: Priority.High,
        lastMessageAt: new Date(now.getTime() - 1000 * 60 * 5), // 5 mins ago
        sentiment: 'Neutral',
        summary: 'Check-in time inquiry',
        apartmentId: 'apt1',
        messages: [
            {
                id: 'm1',
                sender: { id: 'u1', name: 'Sarah Jenkins', avatar: 'https://picsum.photos/id/1011/50' },
                content: "Hi! We're driving in a bit early. Is there any way we could check in around 1 PM instead of 3 PM? We have a lot of luggage.",
                timestamp: new Date(now.getTime() - 1000 * 60 * 5),
                isMe: false
            }
        ]
    },
    {
        id: 't5',
        platform: Platform.WhatsApp,
        participants: [{
            id: 'u5',
            name: 'Davide Rossi',
            avatar: 'https://picsum.photos/id/305/50',
            email: 'davide.r@example.it',
            tags: ['Maintenance', 'Issue'],
            notes: 'Guest speaks Italian primarily.'
        }],
        status: MessageStatus.Pending,
        priority: Priority.High,
        lastMessageAt: new Date(now.getTime() - 1000 * 60 * 30),
        sentiment: 'Negative',
        summary: 'Plumbing issue reported',
        apartmentId: 'apt2',
        messages: [
            {
                id: 'm6',
                sender: { id: 'u5', name: 'Davide Rossi', avatar: 'https://picsum.photos/id/305/50' },
                content: "Hi, sorry to bother you but there is a problem in the bathroom.",
                timestamp: new Date(now.getTime() - 1000 * 60 * 45),
                isMe: false
            },
            {
                id: 'm7',
                sender: { id: 'u5', name: 'Davide Rossi', avatar: 'https://picsum.photos/id/305/50' },
                content: "Voice Message (12s)",
                timestamp: new Date(now.getTime() - 1000 * 60 * 30),
                isMe: false,
                audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand3.wav',
                transcript: "The sink is leaking water all over the floor and the tap seems broken. It is urgent."
            }
        ]
    },
    {
        id: 't4',
        platform: Platform.WhatsApp,
        participants: [{
            id: 'u4',
            name: 'James & Emily',
            avatar: 'https://picsum.photos/id/1025/50',
            email: 'james.travels@gmail.com',
            tags: ['Foodies', 'Couple'],
            notes: 'Requested list of vegan options.'
        }],
        status: MessageStatus.Unread,
        priority: Priority.Medium,
        lastMessageAt: new Date(now.getTime() - 1000 * 60 * 15),
        sentiment: 'Positive',
        summary: 'Dinner recommendation',
        apartmentId: 'apt2',
        messages: [
            {
                id: 'm5',
                sender: { id: 'u4', name: 'James & Emily', avatar: 'https://picsum.photos/id/1025/50' },
                content: "Hey! We are looking for a nice Italian dinner spot nearby that's open late tonight. Any recommendations?",
                timestamp: new Date(now.getTime() - 1000 * 60 * 15),
                isMe: false
            }
        ]
    },
    {
        id: 't2',
        platform: Platform.WhatsApp,
        participants: [{
            id: 'u2',
            name: 'Jorge Silva',
            avatar: 'https://picsum.photos/id/1012/50',
            tags: ['Late Check-in', 'Business'],
            phone: '+34 612 345 678',
            email: 'jorge.silva@tech.co',
            notes: 'Needs reliable WiFi for work. Requested invoice.'
        }],
        status: MessageStatus.Pending,
        priority: Priority.Medium,
        lastMessageAt: new Date(now.getTime() - 1000 * 60 * 60 * 2), // 2 hours ago
        sentiment: 'Positive',
        summary: 'WiFi password request',
        apartmentId: 'apt1',
        messages: [
            {
                id: 'm2',
                sender: { id: 'u2', name: 'Jorge Silva', avatar: 'https://picsum.photos/id/1012/50' },
                content: "Hola! The place looks amazing. Just settled in. Could you send the WiFi password again? I missed it in the email.",
                timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 2),
                isMe: false
            }
        ]
    },
    {
        id: 't3',
        platform: Platform.Lodgify,
        participants: [{
            id: 'u3',
            name: 'Michael Ross',
            avatar: 'https://picsum.photos/id/1005/50',
            email: 'mike.ross@example.com',
            tags: ['Long Stay'],
            notes: 'Previous noise complaint history. Treat with care.'
        }],
        status: MessageStatus.Replied,
        priority: Priority.Low,
        lastMessageAt: new Date(now.getTime() - 1000 * 60 * 60 * 24), // 1 day ago
        sentiment: 'Negative',
        summary: 'Noise complaint resolved',
        apartmentId: 'apt3',
        messages: [
            {
                id: 'm3',
                sender: { id: 'u3', name: 'Michael Ross', avatar: 'https://picsum.photos/id/1005/50' },
                content: "The neighbors are being quite loud.",
                timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 25),
                isMe: false
            },
            {
                id: 'm4',
                sender: { id: 'me', name: 'Me', avatar: '' },
                content: "I'm so sorry Michael. I've called the building manager and they are handling it immediately.",
                timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24),
                isMe: true
            }
        ]
    }
];

// Keyed by Apartment ID
export const initialPropertyKnowledgeBases: Record<string, KnowledgeBaseData> = {
    'apt1': {
        generalInfo: "Apartment 101 (Sunset Villa). Check-in time is 3:00 PM. Check-out is 11:00 AM. No parties or events allowed. Quiet hours are 10 PM - 8 AM. Pool code is 1234.",
        faqs: [
            { id: '1', question: 'What is the WiFi password?', answer: 'Network: "SunsetVilla_Guest", Password: "SunsetView2026".' },
            { id: '2', question: 'Where can I park?', answer: 'Use the designated spot #101 in the driveway.' },
            { id: '3', question: 'How do I access the beach?', answer: 'Use the private gate at the back, key is on the hook.' }
        ]
    },
    'apt2': {
        generalInfo: "Apartment 4B (Downtown Loft). Check-in 4 PM. Keypad code: 5588#. Trash chute is in the hallway. Roof access is open until 11 PM.",
        faqs: [
            { id: '1', question: 'What is the WiFi password?', answer: 'Network: "Loft4B", Password: "DowntownLife!"' },
            { id: '2', question: 'Where is the gym?', answer: 'The gym is on the 2nd floor, code 0000.' },
            { id: '3', question: 'Coffee machine?', answer: 'There is a Nespresso machine. Pods are in the jar.' }
        ]
    },
    'apt3': {
        generalInfo: "Mountain Cabin. Check-in 2 PM. Warning: Bears in area, lock trash bins. Fireplace usage: open flue before lighting.",
        faqs: [
            { id: '1', question: 'WiFi?', answer: 'Network: "Cabin_Starlink", Password: "PineTrees88".' },
            { id: '2', question: 'Hot Tub instructions?', answer: 'Press "Jets" twice. It takes 20 mins to heat up.' }
        ]
    }
};

// Fallback if new apartment added
export const defaultKnowledgeBase: KnowledgeBaseData = {
    generalInfo: "General House Rules: Check-in 3PM, Check-out 11AM. No smoking.",
    faqs: []
};

// --- Restaurant Data ---

export const mockRestaurants: Restaurant[] = [
    { id: 'rest1', name: 'La Bella Italia', address: '123 Olive Way', cuisine: 'Italian' },
    { id: 'rest2', name: 'Sushi Zen', address: '456 Bamboo Ln', cuisine: 'Japanese' }
];

export const initialRestaurantKnowledgeBases: Record<string, KnowledgeBaseData> = {
    'rest1': {
        generalInfo: "Open daily 11AM - 10PM. Reservations required for parties > 6. Gluten-free pasta available. Kitchen closes at 9:30 PM.",
        faqs: [
            { id: 'r1', question: 'Do you have vegan options?', answer: 'Yes, we have a dedicated vegan menu section including Vegan Lasagna.' },
            { id: 'r2', question: 'Is there parking?', answer: 'Valet parking is available for $10 at the front entrance.' }
        ]
    },
    'rest2': {
        generalInfo: "Open Tue-Sun 5PM - 11PM. Omakase requires 24h notice. Dress code: Smart Casual.",
        faqs: [
            { id: 'r1', question: 'Do you allow BYOB?', answer: 'No, we have a full bar and do not allow outside drinks.' },
            { id: 'r2', question: 'Are kids allowed?', answer: 'We welcome children, but do not have high chairs available.' }
        ]
    }
};

export const mockRestaurantThreads: Thread[] = [
    {
        id: 'r_t1',
        platform: Platform.WhatsApp,
        participants: [{
            id: 'd1',
            name: 'John Foodie',
            avatar: 'https://picsum.photos/id/42/50'
        }],
        status: MessageStatus.Unread,
        priority: Priority.Medium,
        lastMessageAt: new Date(now.getTime() - 1000 * 60 * 10),
        sentiment: 'Neutral',
        summary: 'Reservation inquiry',
        restaurantId: 'rest1',
        messages: [
            {
                id: 'rm1',
                sender: { id: 'd1', name: 'John Foodie', avatar: 'https://picsum.photos/id/42/50' },
                content: "Do you have a table for 4 tonight at 8 PM?",
                timestamp: new Date(now.getTime() - 1000 * 60 * 10),
                isMe: false
            }
        ]
    },
    {
        id: 'r_t2',
        platform: Platform.Email,
        participants: [{
            id: 'd2',
            name: 'Sarah Smith',
            avatar: 'https://picsum.photos/id/65/50'
        }],
        status: MessageStatus.Replied,
        priority: Priority.High,
        lastMessageAt: new Date(now.getTime() - 1000 * 60 * 60 * 2),
        sentiment: 'Negative',
        summary: 'Allergy concern',
        restaurantId: 'rest2',
        messages: [
            {
                id: 'rm2',
                sender: { id: 'd2', name: 'Sarah Smith', avatar: 'https://picsum.photos/id/65/50' },
                content: "I have a severe nut allergy. Can you guarantee no cross-contamination for the omakase?",
                timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 2),
                isMe: false
            },
            {
                id: 'rm3',
                sender: { id: 'me', name: 'Me', avatar: '' },
                content: "Hi Sarah, we take allergies very seriously. While we do not use peanuts in our kitchen, we cannot guarantee 100% nut-free environment due to suppliers. However, we can tailor the omakase to avoid all nuts.",
                timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 1.9),
                isMe: true
            }
        ]
    }
];

export const mockReservations: Booking[] = [
    {
        id: 'res1',
        userId: 'd1',
        guestName: 'John Foodie',
        checkIn: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 0), // Tonight 8PM
        checkOut: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 0),
        status: BookingStatus.Confirmed,
        paymentStatus: 'Unpaid',
        platform: Platform.WhatsApp,
        totalPrice: 0,
        guests: 4,
        restaurantId: 'rest1'
    },
    {
        id: 'res2',
        userId: 'd3',
        guestName: 'Alice Cooper',
        checkIn: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 19, 0), // Tomorrow 7PM
        checkOut: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 21, 0),
        status: BookingStatus.Pending,
        paymentStatus: 'Unpaid',
        platform: Platform.Email,
        totalPrice: 0,
        guests: 2,
        restaurantId: 'rest1'
    }
];

// --- Analytics Data ---

export const analyticsData: AnalyticsData[] = [
    { date: 'Mon', messages: 45, autoReplies: 32, manualReplies: 13 },
    { date: 'Tue', messages: 52, autoReplies: 40, manualReplies: 12 },
    { date: 'Wed', messages: 48, autoReplies: 38, manualReplies: 10 },
    { date: 'Thu', messages: 60, autoReplies: 50, manualReplies: 10 },
    { date: 'Fri', messages: 75, autoReplies: 65, manualReplies: 10 },
    { date: 'Sat', messages: 90, autoReplies: 80, manualReplies: 10 },
    { date: 'Sun', messages: 85, autoReplies: 75, manualReplies: 10 },
];

// --- Integrations ---
export const initialIntegrations: Integration[] = [
    {
        id: 'int1',
        name: 'Airbnb',
        description: 'Sync messages, calendar, and reservations.',
        logo: 'https://cdn.simpleicons.org/airbnb/FF5A5F',
        icon: 'Home',
        status: 'Connected',
        category: 'Channel Manager',
        lastSync: new Date(),
        configFields: [
            { name: 'clientId', label: 'Client ID', type: 'text' },
            { name: 'clientSecret', label: 'Client Secret', type: 'password' }
        ]
    },
    {
        id: 'int2',
        name: 'WhatsApp',
        description: 'Connect your business number.',
        logo: 'https://cdn.simpleicons.org/whatsapp/25D366',
        icon: 'MessageCircle',
        status: 'Connected',
        category: 'Messaging',
        lastSync: new Date(),
        configFields: [
            { name: 'phoneNumber', label: 'Phone Number', type: 'text' },
            { name: 'apiKey', label: 'API Key', type: 'password' }
        ]
    },
    {
        id: 'int3',
        name: 'Stripe',
        description: 'Process payments and invoices.',
        logo: 'https://cdn.simpleicons.org/stripe/635BFF',
        icon: 'CreditCard',
        status: 'Connected',
        category: 'Operations',
        configFields: [
            { name: 'publishableKey', label: 'Publishable Key', type: 'text' },
            { name: 'secretKey', label: 'Secret Key', type: 'password' }
        ]
    },
    {
        id: 'int4',
        name: 'Booking.com',
        description: 'Sync bookings and availability.',
        logo: 'https://cdn.simpleicons.org/bookingdotcom/003580',
        icon: 'Globe',
        status: 'Disconnected',
        category: 'Channel Manager',
        configFields: [
            { name: 'propertyId', label: 'Property ID', type: 'text' },
            { name: 'username', label: 'XML Username', type: 'text' },
            { name: 'password', label: 'XML Password', type: 'password' }
        ]
    },
    {
        id: 'int5',
        name: 'Turno',
        description: 'Auto-schedule cleaners based on checkout.',
        logo: 'https://play-lh.googleusercontent.com/7X8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q=w240-h480-rw', // Placeholder link, real URL needed in prod
        icon: 'Broom',
        status: 'Disconnected',
        category: 'Operations',
        configFields: [
            { name: 'apiToken', label: 'API Token', type: 'password' }
        ]
    },
    {
        id: 'int6',
        name: 'PriceLabs',
        description: 'Dynamic pricing optimization.',
        logo: 'https://pbs.twimg.com/profile_images/1400750000000000000/00000000_400x400.jpg', // Placeholder
        icon: 'TrendingUp',
        status: 'Connected',
        category: 'Pricing',
        lastSync: new Date(),
        configFields: [
            { name: 'apiKey', label: 'API Key', type: 'password' }
        ]
    },
    {
        id: 'int7',
        name: 'OpenTable',
        description: 'Sync restaurant reservations.',
        logo: 'https://cdn.simpleicons.org/opentable/DA3743',
        icon: 'Calendar',
        status: 'Disconnected',
        category: 'Channel Manager',
        configFields: [
            { name: 'restaurantId', label: 'Restaurant ID', type: 'text' },
            { name: 'partnerToken', label: 'Partner Token', type: 'password' }
        ]
    },
    {
        id: 'int8',
        name: 'Toast POS',
        description: 'Sync orders and menu items.',
        logo: 'https://assets-global.website-files.com/600f269f979c9c0505939937/6025a3c0e9c2577f8d5c3327_Toast-Logo.png', // Placeholder
        icon: 'CreditCard',
        status: 'Disconnected',
        category: 'Operations',
        configFields: [
            { name: 'clientId', label: 'Client ID', type: 'text' },
            { name: 'clientSecret', label: 'Client Secret', type: 'password' },
            { name: 'locationGuid', label: 'Location GUID', type: 'text' }
        ]
    },
    // --- NEW MESSAGING INTEGRATIONS ---
    {
        id: 'int9',
        name: 'Twilio SMS',
        description: 'Send and receive SMS messages.',
        logo: 'https://cdn.simpleicons.org/twilio/F22F46',
        icon: 'MessageSquare',
        status: 'Disconnected',
        category: 'Messaging',
        configFields: [
            { name: 'accountSid', label: 'Account SID', type: 'text' },
            { name: 'authToken', label: 'Auth Token', type: 'password' },
            { name: 'phoneNumber', label: 'Phone Number', type: 'text' }
        ]
    },
    {
        id: 'int10',
        name: 'Facebook Messenger',
        description: 'Connect your Facebook page for customer messaging.',
        logo: 'https://cdn.simpleicons.org/facebook/0866FF',
        icon: 'MessageCircle',
        status: 'Disconnected',
        category: 'Messaging',
        configFields: [
            { name: 'pageId', label: 'Page ID', type: 'text' },
            { name: 'accessToken', label: 'Access Token', type: 'password' },
            { name: 'verifyToken', label: 'Verify Token', type: 'text' }
        ]
    },
    {
        id: 'int11',
        name: 'Instagram Direct',
        description: 'Manage Instagram DMs from your inbox.',
        logo: 'https://cdn.simpleicons.org/instagram/E4405F',
        icon: 'Image',
        status: 'Disconnected',
        category: 'Messaging',
        configFields: [
            { name: 'instagramAccountId', label: 'Instagram Account ID', type: 'text' },
            { name: 'accessToken', label: 'Access Token', type: 'password' }
        ]
    },
    {
        id: 'int12',
        name: 'Telegram',
        description: 'Connect Telegram bot for customer support.',
        logo: 'https://cdn.simpleicons.org/telegram/26A5E4',
        icon: 'Send',
        status: 'Disconnected',
        category: 'Messaging',
        configFields: [
            { name: 'botToken', label: 'Bot Token', type: 'password' },
            { name: 'chatId', label: 'Chat ID', type: 'text' }
        ]
    },
    // --- PAYMENT INTEGRATIONS ---
    {
        id: 'int13',
        name: 'PayPal',
        description: 'Accept PayPal payments and invoices.',
        logo: 'https://cdn.simpleicons.org/paypal/00457C',
        icon: 'CreditCard',
        status: 'Disconnected',
        category: 'Payment',
        configFields: [
            { name: 'clientId', label: 'Client ID', type: 'text' },
            { name: 'clientSecret', label: 'Client Secret', type: 'password' },
            { name: 'mode', label: 'Mode', type: 'text', placeholder: 'sandbox or live' }
        ]
    },
    {
        id: 'int14',
        name: 'Square',
        description: 'Process payments with Square POS.',
        logo: 'https://cdn.simpleicons.org/square/3E4348',
        icon: 'CreditCard',
        status: 'Disconnected',
        category: 'Payment',
        configFields: [
            { name: 'applicationId', label: 'Application ID', type: 'text' },
            { name: 'accessToken', label: 'Access Token', type: 'password' },
            { name: 'locationId', label: 'Location ID', type: 'text' }
        ]
    },
    // --- CALENDAR INTEGRATIONS ---
    {
        id: 'int15',
        name: 'Google Calendar',
        description: 'Sync events and availability with Google Calendar.',
        logo: 'https://cdn.simpleicons.org/googlecalendar/4285F4',
        icon: 'Calendar',
        status: 'Disconnected',
        category: 'Calendar',
        configFields: [
            { name: 'clientId', label: 'Client ID', type: 'text' },
            { name: 'clientSecret', label: 'Client Secret', type: 'password' },
            { name: 'calendarId', label: 'Calendar ID', type: 'text' }
        ]
    },
    {
        id: 'int16',
        name: 'Microsoft Outlook',
        description: 'Sync with Outlook calendar and email.',
        logo: 'https://cdn.simpleicons.org/microsoftoutlook/0078D4',
        icon: 'Calendar',
        status: 'Disconnected',
        category: 'Calendar',
        configFields: [
            { name: 'clientId', label: 'Client ID', type: 'text' },
            { name: 'clientSecret', label: 'Client Secret', type: 'password' },
            { name: 'tenantId', label: 'Tenant ID', type: 'text' }
        ]
    },
    {
        id: 'int17',
        name: 'Calendly',
        description: 'Auto-sync Calendly bookings to your calendar.',
        logo: 'https://cdn.simpleicons.org/calendly/006BFF',
        icon: 'Calendar',
        status: 'Disconnected',
        category: 'Calendar',
        configFields: [
            { name: 'apiKey', label: 'API Key', type: 'password' },
            { name: 'webhookSecret', label: 'Webhook Secret', type: 'password' }
        ]
    },
    // --- E-COMMERCE INTEGRATIONS ---
    {
        id: 'int18',
        name: 'Shopify',
        description: 'Sync orders, products, and customers from Shopify.',
        logo: 'https://cdn.simpleicons.org/shopify/96BF48',
        icon: 'ShoppingBag',
        status: 'Disconnected',
        category: 'E-commerce',
        configFields: [
            { name: 'shopDomain', label: 'Shop Domain', type: 'text', placeholder: 'your-shop.myshopify.com' },
            { name: 'apiKey', label: 'API Key', type: 'text' },
            { name: 'apiSecret', label: 'API Secret', type: 'password' },
            { name: 'accessToken', label: 'Access Token', type: 'password' }
        ]
    },
    {
        id: 'int19',
        name: 'WooCommerce',
        description: 'Connect your WooCommerce store.',
        logo: 'https://cdn.simpleicons.org/woocommerce/96588A',
        icon: 'ShoppingBag',
        status: 'Disconnected',
        category: 'E-commerce',
        configFields: [
            { name: 'storeUrl', label: 'Store URL', type: 'url' },
            { name: 'consumerKey', label: 'Consumer Key', type: 'text' },
            { name: 'consumerSecret', label: 'Consumer Secret', type: 'password' }
        ]
    },
    {
        id: 'int20',
        name: 'BigCommerce',
        description: 'Sync BigCommerce orders and inventory.',
        logo: 'https://cdn.simpleicons.org/bigcommerce/1274BC',
        icon: 'ShoppingBag',
        status: 'Disconnected',
        category: 'E-commerce',
        configFields: [
            { name: 'storeHash', label: 'Store Hash', type: 'text' },
            { name: 'clientId', label: 'Client ID', type: 'text' },
            { name: 'accessToken', label: 'Access Token', type: 'password' }
        ]
    },
    // --- SOCIAL MEDIA MANAGEMENT ---
    {
        id: 'int21',
        name: 'Buffer',
        description: 'Schedule and manage social media posts.',
        logo: 'https://cdn.simpleicons.org/buffer/231917',
        icon: 'Share2',
        status: 'Disconnected',
        category: 'Social Media',
        configFields: [
            { name: 'accessToken', label: 'Access Token', type: 'password' },
            { name: 'clientId', label: 'Client ID', type: 'text' },
            { name: 'clientSecret', label: 'Client Secret', type: 'password' }
        ]
    },
    {
        id: 'int22',
        name: 'Hootsuite',
        description: 'Manage multiple social accounts from one place.',
        logo: 'https://cdn.simpleicons.org/hootsuite/1DA1F2',
        icon: 'Share2',
        status: 'Disconnected',
        category: 'Social Media',
        configFields: [
            { name: 'apiKey', label: 'API Key', type: 'text' },
            { name: 'apiSecret', label: 'API Secret', type: 'password' },
            { name: 'accessToken', label: 'Access Token', type: 'password' }
        ]
    },
    // --- ACCOUNTING INTEGRATIONS ---
    {
        id: 'int23',
        name: 'QuickBooks',
        description: 'Sync transactions and invoices with QuickBooks.',
        logo: 'https://cdn.simpleicons.org/quickbooks/2CA01C',
        icon: 'FileText',
        status: 'Disconnected',
        category: 'Accounting',
        configFields: [
            { name: 'clientId', label: 'Client ID', type: 'text' },
            { name: 'clientSecret', label: 'Client Secret', type: 'password' },
            { name: 'realmId', label: 'Realm ID', type: 'text' },
            { name: 'accessToken', label: 'Access Token', type: 'password' }
        ]
    },
    {
        id: 'int24',
        name: 'Xero',
        description: 'Connect Xero accounting for automatic transaction sync.',
        logo: 'https://cdn.simpleicons.org/xero/13B5EA',
        icon: 'FileText',
        status: 'Disconnected',
        category: 'Accounting',
        configFields: [
            { name: 'consumerKey', label: 'Consumer Key', type: 'text' },
            { name: 'consumerSecret', label: 'Consumer Secret', type: 'password' },
            { name: 'tenantId', label: 'Tenant ID', type: 'text' }
        ]
    },
    {
        id: 'int25',
        name: 'FreshBooks',
        description: 'Sync invoices and expenses with FreshBooks.',
        logo: 'https://cdn.simpleicons.org/freshbooks/0077C5',
        icon: 'FileText',
        status: 'Disconnected',
        category: 'Accounting',
        configFields: [
            { name: 'clientId', label: 'Client ID', type: 'text' },
            { name: 'clientSecret', label: 'Client Secret', type: 'password' },
            { name: 'redirectUri', label: 'Redirect URI', type: 'url' }
        ]
    },
    // --- HEALTHCARE INTEGRATIONS ---
    {
        id: 'int27',
        name: 'Zocdoc',
        description: 'Sync patient appointments and reviews from Zocdoc.',
        logo: 'https://cdn.simpleicons.org/zocdoc/FFD700',
        icon: 'Calendar',
        status: 'Disconnected',
        category: 'Channel Manager',
        configFields: [
            { name: 'practiceId', label: 'Practice ID', type: 'text' },
            { name: 'apiKey', label: 'API Key', type: 'password' },
            { name: 'webhookSecret', label: 'Webhook Secret', type: 'password' }
        ]
    },
    {
        id: 'int28',
        name: 'Healthgrades',
        description: 'Manage your practice profile and patient reviews.',
        logo: 'https://cdn.simpleicons.org/healthgrades/00A0DC',
        icon: 'Star',
        status: 'Disconnected',
        category: 'Channel Manager',
        configFields: [
            { name: 'practiceId', label: 'Practice ID', type: 'text' },
            { name: 'apiToken', label: 'API Token', type: 'password' }
        ]
    },
    {
        id: 'int29',
        name: 'Epic MyChart',
        description: 'Integrate with Epic EHR patient portal.',
        logo: 'https://cdn.simpleicons.org/epic/0078D4',
        icon: 'FileText',
        status: 'Disconnected',
        category: 'Operations',
        configFields: [
            { name: 'clientId', label: 'Client ID', type: 'text' },
            { name: 'clientSecret', label: 'Client Secret', type: 'password' },
            { name: 'fhirEndpoint', label: 'FHIR Endpoint', type: 'url' }
        ]
    },
    {
        id: 'int30',
        name: 'Cerner',
        description: 'Connect to Cerner EHR system.',
        logo: 'https://cdn.simpleicons.org/cerner/FF6600',
        icon: 'Database',
        status: 'Disconnected',
        category: 'Operations',
        configFields: [
            { name: 'tenantId', label: 'Tenant ID', type: 'text' },
            { name: 'clientId', label: 'Client ID', type: 'text' },
            { name: 'clientSecret', label: 'Client Secret', type: 'password' }
        ]
    },
    {
        id: 'int31',
        name: 'Doxy.me',
        description: 'HIPAA-compliant telemedicine platform.',
        logo: 'https://cdn.simpleicons.org/doxy/4A90E2',
        icon: 'Video',
        status: 'Disconnected',
        category: 'Operations',
        configFields: [
            { name: 'clinicId', label: 'Clinic ID', type: 'text' },
            { name: 'apiKey', label: 'API Key', type: 'password' }
        ]
    },
    {
        id: 'int32',
        name: 'Kareo',
        description: 'Medical billing and practice management.',
        logo: 'https://cdn.simpleicons.org/kareo/00A0DC',
        icon: 'DollarSign',
        status: 'Disconnected',
        category: 'Payment',
        configFields: [
            { name: 'customerId', label: 'Customer ID', type: 'text' },
            { name: 'user', label: 'User', type: 'text' },
            { name: 'password', label: 'Password', type: 'password' }
        ]
    },
    // --- ADDITIONAL PROPERTY MANAGEMENT INTEGRATIONS ---
    {
        id: 'int33',
        name: 'VRBO',
        description: 'Sync calendar, bookings, and guest messaging with VRBO.',
        logo: 'https://cdn.simpleicons.org/vrbo/003580',
        icon: 'Home',
        status: 'Disconnected',
        category: 'Channel Manager',
        configFields: [
            { name: 'partnerId', label: 'Partner ID', type: 'text' },
            { name: 'apiKey', label: 'API Key', type: 'password' }
        ]
    },
    {
        id: 'int34',
        name: 'RemoteLock',
        description: 'Smart access control with automated guest codes.',
        logo: 'https://cdn.simpleicons.org/lock/6B46C1',
        icon: 'Lock',
        status: 'Disconnected',
        category: 'Operations',
        configFields: [
            { name: 'apiKey', label: 'API Key', type: 'password' },
            { name: 'organizationId', label: 'Organization ID', type: 'text' }
        ]
    },
    // --- MARKETING & CRM INTEGRATIONS ---
    {
        id: 'int35',
        name: 'Mailchimp',
        description: 'Email marketing and guest relationship management.',
        logo: 'https://cdn.simpleicons.org/mailchimp/FFE01B',
        icon: 'Mail',
        status: 'Disconnected',
        category: 'Other',
        configFields: [
            { name: 'apiKey', label: 'API Key', type: 'password' },
            { name: 'audienceId', label: 'Audience ID', type: 'text' }
        ]
    },
    // --- COMMUNICATION INTEGRATIONS (UPDATED) ---
    {
        id: 'int36',
        name: 'Twilio',
        description: 'SMS and voice communication for guest messaging.',
        logo: 'https://cdn.simpleicons.org/twilio/F22F46',
        icon: 'MessageCircle',
        status: 'Disconnected',
        category: 'Messaging',
        configFields: [
            { name: 'accountSid', label: 'Account SID', type: 'text' },
            { name: 'authToken', label: 'Auth Token', type: 'password' },
            { name: 'phoneNumber', label: 'Twilio Phone Number', type: 'text' }
        ]
    },
    // --- ADDITIONAL CHANNEL MANAGERS ---
    {
        id: 'int37',
        name: 'Expedia',
        description: 'Connect to Expedia Group network (200+ countries).',
        logo: 'https://cdn.simpleicons.org/expedia/FFCB05',
        icon: 'Globe',
        status: 'Disconnected',
        category: 'Channel Manager',
        configFields: [
            { name: 'hotelId', label: 'Hotel ID', type: 'text' },
            { name: 'apiKey', label: 'API Key', type: 'password' }
        ]
    },
    {
        id: 'int38',
        name: 'Guesty',
        description: 'All-in-one PMS with 100+ channel connections.',
        logo: 'https://cdn.simpleicons.org/guesty/6B46C1',
        icon: 'Home',
        status: 'Disconnected',
        category: 'Channel Manager',
        configFields: [
            { name: 'apiToken', label: 'API Token', type: 'password' },
            { name: 'accountId', label: 'Account ID', type: 'text' }
        ]
    },
    {
        id: 'int39',
        name: 'Hostaway',
        description: 'Comprehensive PMS with direct booking engine.',
        logo: 'https://cdn.simpleicons.org/hostaway/00C9A7',
        icon: 'Home',
        status: 'Disconnected',
        category: 'Channel Manager',
        configFields: [
            { name: 'apiKey', label: 'API Key', type: 'password' },
            { name: 'accountId', label: 'Account ID', type: 'text' }
        ]
    },
    // --- ADDITIONAL PAYMENT PROCESSORS ---
    {
        id: 'int40',
        name: 'PayPal',
        description: 'Global payment platform (400M+ users).',
        logo: 'https://cdn.simpleicons.org/paypal/00457C',
        icon: 'CreditCard',
        status: 'Disconnected',
        category: 'Payment',
        configFields: [
            { name: 'clientId', label: 'Client ID', type: 'text' },
            { name: 'clientSecret', label: 'Client Secret', type: 'password' },
            { name: 'mode', label: 'Mode', type: 'text', placeholder: 'sandbox or live' }
        ]
    },
    {
        id: 'int41',
        name: 'Square',
        description: 'Payment processing and POS system.',
        logo: 'https://cdn.simpleicons.org/square/3E4348',
        icon: 'CreditCard',
        status: 'Disconnected',
        category: 'Payment',
        configFields: [
            { name: 'applicationId', label: 'Application ID', type: 'text' },
            { name: 'accessToken', label: 'Access Token', type: 'password' },
            { name: 'locationId', label: 'Location ID', type: 'text' }
        ]
    },
    // --- ACCOUNTING INTEGRATIONS ---
    {
        id: 'int42',
        name: 'QuickBooks',
        description: 'Industry-standard accounting software.',
        logo: 'https://cdn.simpleicons.org/quickbooks/2CA01C',
        icon: 'FileText',
        status: 'Disconnected',
        category: 'Accounting',
        configFields: [
            { name: 'clientId', label: 'Client ID', type: 'text' },
            { name: 'clientSecret', label: 'Client Secret', type: 'password' },
            { name: 'realmId', label: 'Realm ID', type: 'text' }
        ]
    },
    {
        id: 'int43',
        name: 'Xero',
        description: 'Cloud accounting (3.5M+ subscribers).',
        logo: 'https://cdn.simpleicons.org/xero/13B5EA',
        icon: 'FileText',
        status: 'Disconnected',
        category: 'Accounting',
        configFields: [
            { name: 'consumerKey', label: 'Consumer Key', type: 'text' },
            { name: 'consumerSecret', label: 'Consumer Secret', type: 'password' },
            { name: 'tenantId', label: 'Tenant ID', type: 'text' }
        ]
    },
    // --- TEAM COMMUNICATION ---
    {
        id: 'int44',
        name: 'Slack',
        description: 'Team communication and coordination.',
        logo: 'https://cdn.simpleicons.org/slack/4A154B',
        icon: 'MessageCircle',
        status: 'Disconnected',
        category: 'Other',
        configFields: [
            { name: 'botToken', label: 'Bot Token', type: 'password' },
            { name: 'webhookUrl', label: 'Webhook URL', type: 'text' }
        ]
    },
    {
        id: 'int45',
        name: 'Intercom',
        description: 'Live chat and customer messaging.',
        logo: 'https://cdn.simpleicons.org/intercom/0D6EFD',
        icon: 'MessageSquare',
        status: 'Disconnected',
        category: 'Other',
        configFields: [
            { name: 'appId', label: 'App ID', type: 'text' },
            { name: 'apiKey', label: 'API Key', type: 'password' }
        ]
    },
    {
        id: 'int46',
        name: 'Zendesk',
        description: 'Enterprise customer support platform.',
        logo: 'https://cdn.simpleicons.org/zendesk/03363D',
        icon: 'Headphones',
        status: 'Disconnected',
        category: 'Other',
        configFields: [
            { name: 'subdomain', label: 'Subdomain', type: 'text' },
            { name: 'email', label: 'Email', type: 'text' },
            { name: 'apiToken', label: 'API Token', type: 'password' }
        ]
    },
    // --- ANALYTICS & MARKETING ---
    {
        id: 'int47',
        name: 'Google Analytics',
        description: 'Website analytics and tracking.',
        logo: 'https://cdn.simpleicons.org/googleanalytics/E37400',
        icon: 'BarChart3',
        status: 'Disconnected',
        category: 'Other',
        configFields: [
            { name: 'measurementId', label: 'Measurement ID', type: 'text', placeholder: 'G-XXXXXXXXXX' }
        ]
    },
    {
        id: 'int48',
        name: 'HubSpot',
        description: 'All-in-one CRM and marketing platform.',
        logo: 'https://cdn.simpleicons.org/hubspot/FF7A59',
        icon: 'Users',
        status: 'Disconnected',
        category: 'Other',
        configFields: [
            { name: 'apiKey', label: 'API Key', type: 'password' }
        ]
    },
    {
        id: 'int49',
        name: 'Facebook Ads',
        description: 'Social media advertising platform.',
        logo: 'https://cdn.simpleicons.org/facebook/0866FF',
        icon: 'Target',
        status: 'Disconnected',
        category: 'Other',
        configFields: [
            { name: 'accessToken', label: 'Access Token', type: 'password' },
            { name: 'adAccountId', label: 'Ad Account ID', type: 'text' }
        ]
    },
    // --- OPERATIONS MANAGEMENT ---
    {
        id: 'int50',
        name: 'Breezeway',
        description: 'Task management and property inspections.',
        logo: 'https://cdn.simpleicons.org/breezeway/00C9A7',
        icon: 'ClipboardCheck',
        status: 'Disconnected',
        category: 'Operations',
        configFields: [
            { name: 'apiKey', label: 'API Key', type: 'password' }
        ]
    },
    {
        id: 'int51',
        name: 'TurnoverBnB',
        description: 'Cleaning automation and coordination.',
        logo: 'https://cdn.simpleicons.org/turnoverbnb/6B46C1',
        icon: 'Sparkles',
        status: 'Disconnected',
        category: 'Operations',
        configFields: [
            { name: 'apiKey', label: 'API Key', type: 'password' }
        ]
    },
    {
        id: 'int52',
        name: 'Properly',
        description: 'AI-powered property operations.',
        logo: 'https://cdn.simpleicons.org/properly/8B5CF6',
        icon: 'CheckCircle',
        status: 'Disconnected',
        category: 'Operations',
        configFields: [
            { name: 'apiToken', label: 'API Token', type: 'password' }
        ]
    },
    // --- SMART ACCESS & SECURITY ---
    {
        id: 'int53',
        name: 'August Lock',
        description: 'Smart lock integration and control.',
        logo: 'https://cdn.simpleicons.org/august/64748B',
        icon: 'Lock',
        status: 'Disconnected',
        category: 'Smart Home',
        configFields: [
            { name: 'apiKey', label: 'API Key', type: 'password' }
        ]
    },
    {
        id: 'int54',
        name: 'Yale Lock',
        description: 'Premium smart lock system.',
        logo: 'https://cdn.simpleicons.org/yale/3B82F6',
        icon: 'Lock',
        status: 'Disconnected',
        category: 'Smart Home',
        configFields: [
            { name: 'apiKey', label: 'API Key', type: 'password' }
        ]
    },
    {
        id: 'int55',
        name: 'Ring',
        description: 'Video doorbell and security system.',
        logo: 'https://cdn.simpleicons.org/ring/00C9A7',
        icon: 'Video',
        status: 'Disconnected',
        category: 'Smart Home',
        configFields: [
            { name: 'oauthToken', label: 'OAuth Token', type: 'password' }
        ]
    },
    // --- DYNAMIC PRICING ---
    {
        id: 'int56',
        name: 'Beyond Pricing',
        description: 'Revenue management and dynamic pricing.',
        logo: 'https://cdn.simpleicons.org/beyondpricing/10B981',
        icon: 'TrendingUp',
        status: 'Disconnected',
        category: 'Pricing',
        configFields: [
            { name: 'apiKey', label: 'API Key', type: 'password' }
        ]
    },
    // --- WEBSITE BUILDERS ---
    {
        id: 'int57',
        name: 'WordPress',
        description: 'Website and direct booking platform.',
        logo: 'https://cdn.simpleicons.org/wordpress/21759B',
        icon: 'Globe',
        status: 'Disconnected',
        category: 'Other',
        configFields: [
            { name: 'siteUrl', label: 'Site URL', type: 'url' },
            { name: 'applicationPassword', label: 'Application Password', type: 'password' }
        ]
    },
    {
        id: 'int58',
        name: 'Wix',
        description: 'Drag-and-drop website builder.',
        logo: 'https://cdn.simpleicons.org/wix/0C6EFC',
        icon: 'Layout',
        status: 'Disconnected',
        category: 'Other',
        configFields: [
            { name: 'apiKey', label: 'API Key', type: 'password' },
            { name: 'siteId', label: 'Site ID', type: 'text' }
        ]
    },
    {
        id: 'int59',
        name: 'Squarespace',
        description: 'Designer-quality website templates.',
        logo: 'https://cdn.simpleicons.org/squarespace/000000',
        icon: 'Layout',
        status: 'Disconnected',
        category: 'Other',
        configFields: [
            { name: 'apiKey', label: 'API Key', type: 'password' }
        ]
    },
    // --- GUEST EXPERIENCE ---
    {
        id: 'int60',
        name: 'Enso Connect',
        description: 'Upsells and digital guidebooks.',
        logo: 'https://cdn.simpleicons.org/enso/6366F1',
        icon: 'Sparkles',
        status: 'Disconnected',
        category: 'Other',
        configFields: [
            { name: 'apiKey', label: 'API Key', type: 'password' }
        ]
    },
    {
        id: 'int61',
        name: 'Superhog',
        description: 'Guest screening and damage protection.',
        logo: 'https://cdn.simpleicons.org/superhog/EF4444',
        icon: 'Shield',
        status: 'Disconnected',
        category: 'Other',
        configFields: [
            { name: 'apiKey', label: 'API Key', type: 'password' }
        ]
    },
    {
        id: 'int62',
        name: 'Safely',
        description: 'Guest verification and damage waiver.',
        logo: 'https://cdn.simpleicons.org/safely/F97316',
        icon: 'ShieldCheck',
        status: 'Disconnected',
        category: 'Other',
        configFields: [
            { name: 'apiKey', label: 'API Key', type: 'password' }
        ]
    },
    // --- TRANSPORTATION & DELIVERY ---
    {
        id: 'int63',
        name: 'Uber',
        description: 'Ride booking and transportation.',
        logo: 'https://cdn.simpleicons.org/uber/000000',
        icon: 'Car',
        status: 'Disconnected',
        category: 'Other',
        configFields: [
            { name: 'clientId', label: 'Client ID', type: 'text' },
            { name: 'clientSecret', label: 'Client Secret', type: 'password' }
        ]
    },
    {
        id: 'int64',
        name: 'DoorDash',
        description: 'Food delivery integration.',
        logo: 'https://cdn.simpleicons.org/doordash/FF3008',
        icon: 'UtensilsCrossed',
        status: 'Disconnected',
        category: 'Other',
        configFields: [
            { name: 'developerId', label: 'Developer ID', type: 'text' },
            { name: 'keyId', label: 'Key ID', type: 'password' }
        ]
    },
    // --- REVIEWS & REPUTATION ---
    {
        id: 'int65',
        name: 'TripAdvisor',
        description: 'Review monitoring and management.',
        logo: 'https://cdn.simpleicons.org/tripadvisor/34E0A1',
        icon: 'Star',
        status: 'Disconnected',
        category: 'Other',
        configFields: [
            { name: 'apiKey', label: 'API Key', type: 'password' }
        ]
    },
    {
        id: 'int66',
        name: 'Google My Business',
        description: 'Local SEO and review management.',
        logo: 'https://cdn.simpleicons.org/googlemybusiness/4285F4',
        icon: 'MapPin',
        status: 'Disconnected',
        category: 'Other',
        configFields: [
            { name: 'apiKey', label: 'API Key', type: 'password' }
        ]
    },
    {
        id: 'int67',
        name: 'Trustpilot',
        description: 'Verified review platform.',
        logo: 'https://cdn.simpleicons.org/trustpilot/00B67A',
        icon: 'Award',
        status: 'Disconnected',
        category: 'Other',
        configFields: [
            { name: 'apiKey', label: 'API Key', type: 'password' }
        ]
    },
    // --- AUTOMATION PLATFORMS ---
    {
        id: 'int68',
        name: 'Zapier',
        description: 'Workflow automation (5000+ apps).',
        logo: 'https://cdn.simpleicons.org/zapier/FF4A00',
        icon: 'Zap',
        status: 'Disconnected',
        category: 'Other',
        configFields: [
            { name: 'apiKey', label: 'API Key', type: 'password' }
        ]
    },
    {
        id: 'int69',
        name: 'Make',
        description: 'Visual automation builder.',
        logo: 'https://cdn.simpleicons.org/make/6B46C1',
        icon: 'Workflow',
        status: 'Disconnected',
        category: 'Other',
        configFields: [
            { name: 'apiToken', label: 'API Token', type: 'password' }
        ]
    },
    {
        id: 'int70',
        name: 'OpenAI',
        description: 'AI-powered responses and automation.',
        logo: 'https://cdn.simpleicons.org/openai/412991',
        icon: 'Brain',
        status: 'Disconnected',
        category: 'Other',
        configFields: [
            { name: 'apiKey', label: 'API Key', type: 'password' }
        ]
    },
    // --- PROCUREMENT ---
    {
        id: 'int71',
        name: 'Amazon Business',
        description: 'Bulk ordering and procurement.',
        logo: 'https://cdn.simpleicons.org/amazon/FF9900',
        icon: 'ShoppingCart',
        status: 'Disconnected',
        category: 'Other',
        configFields: [
            { name: 'apiCredentials', label: 'API Credentials', type: 'password' }
        ]
    },
    {
        id: 'int72',
        name: 'Faire',
        description: 'Wholesale marketplace for unique products.',
        logo: 'https://cdn.simpleicons.org/faire/6366F1',
        icon: 'Package',
        status: 'Disconnected',
        category: 'Other',
        configFields: [
            { name: 'apiToken', label: 'API Token', type: 'password' }
        ]
    }
];

// --- Models ---
export const defaultModels: AIModel[] = [
    // Google Gemini Models
    { id: 'm1', name: 'Gemini 2.5 Flash Lite', provider: 'Google Gemini', modelId: 'gemini-2.5-flash-lite' },
    { id: 'm2', name: 'Gemini 3.0 Pro', provider: 'Google Gemini', modelId: 'gemini-3-pro-preview' },
    { id: 'm4', name: 'Gemini 2.5 Flash', provider: 'Google Gemini', modelId: 'gemini-2.5-flash' },
    { id: 'm5', name: 'Gemini 2.5 Flash Image', provider: 'Google Gemini', modelId: 'gemini-2.5-flash-image' },
    { id: 'm12', name: 'Gemini 1.5 Pro', provider: 'Google Gemini', modelId: 'gemini-1.5-pro' },

    // OpenAI Models
    { id: 'm10', name: 'GPT-4o', provider: 'OpenAI', modelId: 'gpt-4o' },
    { id: 'm13', name: 'GPT-4 Turbo', provider: 'OpenAI', modelId: 'gpt-4-turbo' },
    { id: 'm14', name: 'GPT-3.5 Turbo', provider: 'OpenAI', modelId: 'gpt-3.5-turbo' },
    { id: 'm15', name: 'GPT-4o Mini', provider: 'OpenAI', modelId: 'gpt-4o-mini' },

    // Anthropic Models
    { id: 'm9', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', modelId: 'claude-3-5-sonnet-20241022' },
    { id: 'm16', name: 'Claude 3 Opus', provider: 'Anthropic', modelId: 'claude-3-opus-20240229' },
    { id: 'm17', name: 'Claude 3 Haiku', provider: 'Anthropic', modelId: 'claude-3-haiku-20240307' },

    // DeepSeek Models
    { id: 'm6', name: 'DeepSeek R1', provider: 'DeepSeek', modelId: 'deepseek-r1' },
    { id: 'm18', name: 'DeepSeek Chat', provider: 'DeepSeek', modelId: 'deepseek-chat' },
    { id: 'm19', name: 'DeepSeek Coder', provider: 'DeepSeek', modelId: 'deepseek-coder' },

    // xAI (Grok) Models
    { id: 'm7', name: 'Grok Beta', provider: 'xAI', modelId: 'grok-beta' },
    { id: 'm20', name: 'Grok 2', provider: 'xAI', modelId: 'grok-2' },

    // Meta Models
    { id: 'm8', name: 'Llama 3 70B', provider: 'Meta', modelId: 'llama-3-70b-instruct' },
    { id: 'm21', name: 'Llama 3 8B', provider: 'Meta', modelId: 'llama-3-8b-instruct' },
    { id: 'm22', name: 'Llama 3.1 70B', provider: 'Meta', modelId: 'llama-3.1-70b-instruct' },

    // Mistral Models
    { id: 'm11', name: 'Mistral Large', provider: 'Mistral', modelId: 'mistral-large-latest' },
    { id: 'm23', name: 'Mistral Medium', provider: 'Mistral', modelId: 'mistral-medium-latest' },
    { id: 'm24', name: 'Mistral Small', provider: 'Mistral', modelId: 'mistral-small-latest' },

    // OpenRouter (Aggregator)
    { id: 'm25', name: 'OpenRouter - GPT-4o', provider: 'OpenRouter', modelId: 'openai/gpt-4o' },
    { id: 'm26', name: 'OpenRouter - Claude 3.5 Sonnet', provider: 'OpenRouter', modelId: 'anthropic/claude-3.5-sonnet' },
];

export const defaultTaskAssignment: TaskAssignment = {
    drafting: 'm4', // Default to Flash for speed
    analysis: 'm1',
    quickReplies: 'm1',
    imageGeneration: 'm5' // Default image model
};

// --- Bookings ---
export const mockBookings: Booking[] = [
    {
        id: 'b1',
        userId: 'u1',
        guestName: 'Sarah Jenkins',
        checkIn: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1), // Tomorrow
        checkOut: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4),
        status: BookingStatus.Confirmed,
        paymentStatus: 'Paid',
        platform: Platform.Airbnb,
        totalPrice: 450,
        guests: 2,
        apartmentId: 'apt1',
        cleaningStatus: 'Scheduled',
        cleanerName: 'Turno Auto',
        financials: {
            basePrice: 350,
            fees: 100,
            fines: 0,
            currency: 'USD'
        }
    },
    {
        id: 'b2',
        userId: 'u5',
        guestName: 'Davide Rossi',
        checkIn: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2),
        checkOut: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
        status: BookingStatus.CheckedOut,
        paymentStatus: 'Paid',
        platform: Platform.WhatsApp,
        totalPrice: 320,
        guests: 1,
        apartmentId: 'apt2',
        cleaningStatus: 'Dirty',
        financials: {
            basePrice: 280,
            fees: 40,
            fines: 0,
            currency: 'EUR'
        }
    },
    {
        id: 'b3',
        userId: 'u2',
        guestName: 'Jorge Silva',
        checkIn: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5),
        checkOut: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10),
        status: BookingStatus.Confirmed,
        paymentStatus: 'Partial',
        platform: Platform.Airbnb,
        totalPrice: 1200,
        guests: 3,
        apartmentId: 'apt1',
        cleaningStatus: 'Scheduled',
        financials: {
            basePrice: 1000,
            fees: 200,
            fines: 0,
            currency: 'USD'
        }
    }
];

export const mockOrders: Booking[] = [
    {
        id: 'o1',
        userId: 'e1',
        guestName: 'Alice Shopper',
        checkIn: new Date(), // Order Date
        checkOut: new Date(now.getTime() + 86400000 * 3), // Delivery Est
        status: BookingStatus.Confirmed,
        paymentStatus: 'Paid',
        platform: Platform.Email,
        totalPrice: 89.99,
        guests: 1,
        financials: {
            basePrice: 79.99,
            fees: 10,
            fines: 0,
            currency: 'USD'
        }
    }
];

// --- E-commerce Data ---
export const initialEcommerceKnowledgeBase: KnowledgeBaseData = {
    generalInfo: "We are 'Urban Trends', a modern clothing brand. Free shipping on orders over $50. 30-day returns.",
    faqs: [
        { id: 'e1', question: 'Where is my order?', answer: 'You can track your order using the link sent to your email.' },
        { id: 'e2', question: 'Do you ship internationally?', answer: 'Yes, we ship to most countries via DHL Express.' }
    ]
};

export const mockEcommerceThreads: Thread[] = [
    {
        id: 'e_t1',
        platform: Platform.Email,
        participants: [{
            id: 'cust1',
            name: 'Alice Shopper',
            avatar: 'https://picsum.photos/id/64/50',
            email: 'alice@example.com'
        }],
        status: MessageStatus.Unread,
        priority: Priority.Medium,
        lastMessageAt: new Date(),
        sentiment: 'Neutral',
        summary: 'Shipping inquiry',
        messages: [
            {
                id: 'em1',
                sender: { id: 'cust1', name: 'Alice Shopper', avatar: 'https://picsum.photos/id/64/50' },
                content: "Hi, I placed an order yesterday. When will it ship?",
                timestamp: new Date(),
                isMe: false
            }
        ]
    }
];

// --- Expenses ---
export const mockExpenses: Expense[] = [
    {
        id: 'exp1',
        category: 'Maintenance',
        amount: 150,
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5),
        description: 'Fixed plumbing in Unit A',
        status: 'Paid',
        apartmentId: 'apt1'
    },
    {
        id: 'exp2',
        category: 'Cleaning',
        amount: 80,
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2),
        description: 'Deep clean Unit 4B',
        status: 'Pending',
        apartmentId: 'apt2'
    },
    {
        id: 'exp3',
        category: 'Utilities',
        amount: 200,
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10),
        description: 'Electric Bill',
        status: 'Paid'
    }
];

// --- Reviews ---
export const mockReviews: Review[] = [
    {
        id: 'rev1',
        author: 'Emma Watson',
        avatar: 'https://picsum.photos/id/1027/50',
        rating: 5,
        content: "Absolutely stunning apartment! The view was breathtaking and the host was super responsive. The guide they sent made check-in a breeze.",
        date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2),
        platform: Platform.Airbnb,
        entityId: 'apt1',
        sentiment: 'Positive',
        tags: ['View', 'Communication', 'Check-in']
    },
    {
        id: 'rev2',
        author: 'Tom Hardy',
        rating: 3,
        content: "The location is great, but the wifi was spotty and the shower pressure was low. Good for a short stay but needs maintenance.",
        date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5),
        platform: Platform.BookingDotCom,
        entityId: 'apt2',
        sentiment: 'Mixed',
        tags: ['Location', 'Wifi', 'Maintenance']
    },
    {
        id: 'rev3',
        author: 'Jessica Alba',
        rating: 5,
        content: "Best pasta I've ever had! The vegan options were surprisingly good too. Will definitely come back.",
        date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1),
        platform: Platform.Google,
        entityId: 'rest1',
        sentiment: 'Positive',
        tags: ['Food', 'Vegan']
    }
];

// --- Inventory ---
export const mockInventory: InventoryItem[] = [
    { id: 'inv1', name: 'Toilet Paper', category: 'Toiletries', quantity: 12, minThreshold: 10, unit: 'rolls', supplier: 'Costco' },
    { id: 'inv2', name: 'Coffee Pods', category: 'Kitchen', quantity: 45, minThreshold: 20, unit: 'pods', supplier: 'Nespresso' },
    { id: 'inv3', name: 'Shampoo Bottles', category: 'Toiletries', quantity: 5, minThreshold: 8, unit: 'bottles', supplier: 'HotelSupply Co' },
    { id: 'inv4', name: 'Dish Soap', category: 'Kitchen', quantity: 2, minThreshold: 2, unit: 'bottles', supplier: 'Target' },
    { id: 'inv5', name: 'Towels (White)', category: 'Linens', quantity: 18, minThreshold: 15, unit: 'sets', supplier: 'HotelSupply Co' }
];

// --- Voice Agent Logs ---
export const mockCallLogs: CallLog[] = [
    {
        id: 'call-1',
        callerName: 'Potential Guest',
        callerNumber: '+1 (555) 019-2834',
        timestamp: new Date(now.getTime() - 1000 * 60 * 15),
        durationSeconds: 142,
        status: 'Completed',
        transcript: "Agent: Hello, thanks for calling We Do properties. This is Puck, how can I help? Caller: Hi, I see your Sunset Villa listed. Is it available next weekend? Agent: Let me check. Yes, it is available from Friday to Sunday. The rate is $450. Would you like the booking link sent to you?",
        summary: "Inquired about Sunset Villa availability for next weekend. Confirmed availability and rate.",
        actionTaken: "Sent Booking Link via SMS"
    },
    {
        id: 'call-2',
        callerName: 'Unknown',
        callerNumber: '+1 (555) 998-1122',
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 2),
        durationSeconds: 0,
        status: 'Missed',
        transcript: "",
        summary: "Missed call during peak hours.",
        actionTaken: "Auto-SMS sent: 'Sorry we missed you...'"
    },
    {
        id: 'call-3',
        callerName: 'Current Guest (John)',
        callerNumber: '+1 (555) 777-8888',
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 5),
        durationSeconds: 45,
        status: 'Forwarded',
        transcript: "Agent: Hello. Caller: THERE IS WATER EVERYWHERE! THE PIPE BURST! Agent: I understand this is an emergency. I am connecting you to our on-call manager immediately.",
        summary: "Emergency reported: Burst pipe.",
        actionTaken: "Forwarded to Manager (+1 555 0000)"
    }
];


// --- Healthcare Data ---

export const mockHealthcarePractices: HealthcarePractice[] = [
    {
        id: 'hc1',
        name: 'Wellness Medical Center',
        specialty: 'General Practice',
        address: '789 Health Ave',
        phone: '(555) 123-4567',
        email: 'info@wellnessmedical.com',
        licenseNumber: 'MD-12345',
        npiNumber: '1234567890',
        acceptedInsurance: ['Blue Cross Blue Shield', 'UnitedHealthcare', 'Aetna', 'Medicare']
    },
    {
        id: 'hc2',
        name: 'Bright Smile Dental',
        specialty: 'Dental',
        address: '456 Tooth Lane',
        phone: '(555) 987-6543',
        email: 'smile@brightdental.com',
        licenseNumber: 'DDS-67890',
        acceptedInsurance: ['Delta Dental', 'Cigna', 'Aetna']
    },
    {
        id: 'hc3',
        name: 'Active Life Physical Therapy',
        specialty: 'Physical Therapy',
        address: '321 Recovery Rd',
        phone: '(555) 456-7890',
        email: 'info@activelifept.com',
        licenseNumber: 'PT-54321',
        acceptedInsurance: ['UnitedHealthcare', 'Aetna', 'Workers Comp']
    }
];

export const mockPatients: Patient[] = [
    {
        id: 'p1',
        name: 'John Smith',
        avatar: '👨',
        email: 'john.smith@email.com',
        phone: '(555) 111-2222',
        dateOfBirth: new Date('1985-03-15'),
        insuranceProvider: 'Blue Cross Blue Shield',
        insuranceId: 'BCBS-123456',
        allergies: ['Penicillin', 'Peanuts'],
        medications: ['Lisinopril 10mg'],
        medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
        emergencyContact: {
            name: 'Jane Smith',
            phone: '(555) 111-3333',
            relationship: 'Spouse'
        },
        lastVisit: new Date('2024-11-15'),
        totalSpend: 2400,
        visitCount: 8,
        status: 'Active',
        churnRisk: 'Low',
        marketingConsent: true,
        history: []
    },
    {
        id: 'p2',
        name: 'Sarah Johnson',
        avatar: '👩',
        email: 'sarah.j@email.com',
        phone: '(555) 222-3333',
        dateOfBirth: new Date('1992-07-22'),
        insuranceProvider: 'UnitedHealthcare',
        insuranceId: 'UHC-789012',
        allergies: [],
        medications: [],
        medicalHistory: [],
        emergencyContact: {
            name: 'Mike Johnson',
            phone: '(555) 222-4444',
            relationship: 'Brother'
        },
        lastVisit: new Date('2024-12-01'),
        totalSpend: 800,
        visitCount: 3,
        status: 'Active',
        churnRisk: 'Low',
        marketingConsent: true,
        history: []
    }
];

export const mockAppointments: Appointment[] = [
    {
        id: 'apt1',
        userId: 'p1',
        guestName: 'John Smith',
        patientId: 'p1',
        checkIn: new Date('2024-12-20T10:00:00'),
        checkOut: new Date('2024-12-20T10:30:00'),
        status: BookingStatus.Confirmed,
        paymentStatus: 'Paid',
        platform: Platform.Email,
        totalPrice: 150,
        guests: 1,
        practiceId: 'hc1',
        appointmentType: 'Follow-up',
        provider: 'Dr. Emily Chen',
        chiefComplaint: 'Blood pressure check and medication review',
        notes: 'Patient reports feeling well. BP stable.',
        insuranceClaim: {
            claimNumber: 'CLM-2024-001',
            status: 'Approved',
            amount: 120
        }
    },
    {
        id: 'apt2',
        userId: 'p2',
        guestName: 'Sarah Johnson',
        patientId: 'p2',
        checkIn: new Date('2024-12-22T14:00:00'),
        checkOut: new Date('2024-12-22T15:00:00'),
        status: BookingStatus.Confirmed,
        paymentStatus: 'Pending',
        platform: Platform.WhatsApp,
        totalPrice: 200,
        guests: 1,
        practiceId: 'hc2',
        appointmentType: 'Checkup',
        provider: 'Dr. Michael Park',
        chiefComplaint: 'Routine dental cleaning and exam',
        notes: 'First visit. New patient paperwork completed.'
    },
    {
        id: 'apt3',
        userId: 'p1',
        guestName: 'John Smith',
        patientId: 'p1',
        checkIn: new Date('2024-12-28T09:00:00'),
        checkOut: new Date('2024-12-28T10:00:00'),
        status: BookingStatus.Pending,
        paymentStatus: 'Unpaid',
        platform: Platform.Email,
        totalPrice: 180,
        guests: 1,
        practiceId: 'hc3',
        appointmentType: 'Consultation',
        provider: 'Dr. Lisa Martinez',
        chiefComplaint: 'Lower back pain for 2 weeks',
        notes: 'Initial evaluation needed. Patient referred by PCP.'
    }
];

export const mockHealthcareThreads: Thread[] = [
    {
        id: 'hc_t1',
        platform: Platform.Email,
        participants: [{ id: 'p1', name: 'John Smith', avatar: '👨', email: 'john.smith@email.com' }],
        status: MessageStatus.Replied,
        priority: Priority.Medium,
        lastMessageAt: new Date('2024-12-15T14:30:00'),
        sentiment: 'Neutral',
        summary: 'Prescription refill request',
        practiceId: 'hc1',
        messages: [
            {
                id: 'hc_m1',
                sender: { id: 'p1', name: 'John Smith', avatar: '👨' },
                content: 'Hi, I need a refill on my blood pressure medication (Lisinopril 10mg). I have about 3 days left.',
                timestamp: new Date('2024-12-15T14:00:00'),
                isMe: false
            },
            {
                id: 'hc_m2',
                sender: { id: 'ai', name: 'Wellness Medical Center', avatar: '🏥' },
                content: 'Thank you for reaching out, John. I\'ve reviewed your records and see you\'re due for a refill. I\'ve sent the prescription to your pharmacy (CVS on Main St). It should be ready for pickup in 2-3 hours. Please schedule a follow-up appointment in the next 2 weeks to check your blood pressure.',
                timestamp: new Date('2024-12-15T14:30:00'),
                isMe: true
            }
        ]
    },
    {
        id: 'hc_t2',
        platform: Platform.WhatsApp,
        participants: [{ id: 'p2', name: 'Sarah Johnson', avatar: '👩', phone: '(555) 222-3333' }],
        status: MessageStatus.Unread,
        priority: Priority.High,
        lastMessageAt: new Date('2024-12-16T09:15:00'),
        sentiment: 'Negative',
        summary: 'Appointment cancellation and rescheduling',
        practiceId: 'hc2',
        messages: [
            {
                id: 'hc_m3',
                sender: { id: 'p2', name: 'Sarah Johnson', avatar: '👩' },
                content: 'I need to cancel my appointment tomorrow at 2pm. I have a work emergency. Can we reschedule for next week?',
                timestamp: new Date('2024-12-16T09:15:00'),
                isMe: false
            }
        ]
    },
    {
        id: 'hc_t3',
        platform: Platform.Email,
        participants: [{ id: 'p3', name: 'Robert Chen', avatar: '👨', email: 'robert.c@email.com' }],
        status: MessageStatus.Unread,
        priority: Priority.High,
        lastMessageAt: new Date('2024-12-16T16:45:00'),
        sentiment: 'Neutral',
        summary: 'Lab results inquiry',
        practiceId: 'hc1',
        messages: [
            {
                id: 'hc_m4',
                sender: { id: 'p3', name: 'Robert Chen', avatar: '👨' },
                content: 'Hi, I had blood work done last week. Are my results available yet? I\'m a bit anxious to hear about my cholesterol levels.',
                timestamp: new Date('2024-12-16T16:45:00'),
                isMe: false
            }
        ]
    }
];

export const initialHealthcareKnowledgeBases: Record<string, KnowledgeBaseData> = {
    'hc1': {
        generalInfo: "Wellness Medical Center - General Practice. Office hours: Mon-Fri 8AM-6PM, Sat 9AM-1PM. We accept most major insurance plans. Same-day appointments available for urgent matters. Telemedicine visits available. Patient portal: wellnessmedical.com/portal",
        faqs: [
            {
                id: 'hc_faq1',
                question: 'What insurance do you accept?',
                answer: 'We accept Blue Cross Blue Shield, UnitedHealthcare, Aetna, Cigna, Medicare, and Medicaid. Please call to verify your specific plan.'
            },
            {
                id: 'hc_faq2',
                question: 'How do I request a prescription refill?',
                answer: 'You can request refills through our patient portal, by phone at (555) 123-4567, or by messaging us. Please allow 24-48 hours for processing. For urgent needs, please call.'
            },
            {
                id: 'hc_faq3',
                question: 'Do you offer telemedicine appointments?',
                answer: 'Yes! We offer video visits for follow-ups, medication management, and minor concerns. Schedule through our patient portal or call our office.'
            },
            {
                id: 'hc_faq4',
                question: 'What should I bring to my first appointment?',
                answer: 'Please bring your insurance card, photo ID, list of current medications, and any relevant medical records. Arrive 15 minutes early to complete paperwork.'
            },
            {
                id: 'hc_faq5',
                question: 'What is your cancellation policy?',
                answer: 'Please provide at least 24 hours notice for cancellations. Late cancellations or no-shows may incur a $50 fee.'
            }
        ]
    },
    'hc2': {
        generalInfo: "Bright Smile Dental - Family Dentistry. Office hours: Mon-Thu 8AM-7PM, Fri 8AM-5PM. Emergency appointments available. We accept most dental insurance plans. New patients welcome. Digital X-rays and same-day crowns available.",
        faqs: [
            {
                id: 'hc_faq6',
                question: 'How often should I have a dental checkup?',
                answer: 'We recommend checkups and cleanings every 6 months for most patients. Some patients with gum disease may need more frequent visits.'
            },
            {
                id: 'hc_faq7',
                question: 'Do you offer emergency dental services?',
                answer: 'Yes, we reserve time slots for dental emergencies. Call us immediately if you have severe pain, trauma, or a knocked-out tooth.'
            },
            {
                id: 'hc_faq8',
                question: 'What payment options do you accept?',
                answer: 'We accept cash, credit cards, and most dental insurance plans. We also offer CareCredit financing for larger procedures.'
            }
        ]
    },
    'hc3': {
        generalInfo: "Active Life Physical Therapy - Specialized rehabilitation services. Office hours: Mon-Fri 7AM-7PM, Sat 8AM-12PM. Direct access - no referral needed in most cases. We accept most insurance including Workers Comp. Free injury screenings available.",
        faqs: [
            {
                id: 'hc_faq9',
                question: 'Do I need a referral for physical therapy?',
                answer: 'In most states, you can see a physical therapist without a referral. However, some insurance plans may require one. Call us to verify your coverage.'
            },
            {
                id: 'hc_faq10',
                question: 'How long is a typical PT session?',
                answer: 'Initial evaluations are 60 minutes. Follow-up sessions are typically 45 minutes. Your therapist will create a personalized treatment plan.'
            },
            {
                id: 'hc_faq11',
                question: 'What should I wear to my appointment?',
                answer: 'Wear comfortable, loose-fitting clothing that allows easy access to the area being treated. Athletic wear is ideal.'
            }
        ]
    }
};

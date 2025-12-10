

export enum Platform {
  Airbnb = 'Airbnb',
  WhatsApp = 'WhatsApp',
  Lodgify = 'Lodgify',
  Email = 'Email',
  Yelp = 'Yelp',
  Google = 'Google',
  BookingDotCom = 'Booking.com',
  Zocdoc = 'Zocdoc',
  Healthgrades = 'Healthgrades',
  PatientPortal = 'Patient Portal'
}

export enum MessageStatus {
  Unread = 'Unread',
  Replied = 'Replied',
  Pending = 'Pending', // Waiting for manual approval
  Archived = 'Archived'
}

export enum Priority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low'
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  phone?: string;
  tags?: string[];
  notes?: string;
}

// New CRM Profile Type
export interface CustomerProfile extends User {
  totalSpend: number;
  visitCount: number;
  lastVisit: Date;
  status: 'Active' | 'Drifting' | 'Churned' | 'New';
  churnRisk: 'Low' | 'Medium' | 'High'; // AI Predicted
  aiPersona?: string; // e.g. "Weekend Warrior", "Business Traveler"
  preferences?: string[]; // AI Extracted
  marketingConsent: boolean;
  createdAt?: Date;
  history: {
    id: string;
    date: Date;
    description: string;
    amount: number;
  }[];
}

export type UserRole = 'Admin' | 'Agent' | 'Maintenance' | 'Owner';

export interface TeamMember extends User {
  role: UserRole;
  status: 'Online' | 'Offline' | 'Busy' | 'Invited';
  lastActive?: Date;
  isTyping?: boolean; // UI state
}

export interface Apartment {
  id: string;
  name: string;
  address?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  address?: string;
  cuisine?: string;
}

export type MessageType = 'text' | 'image' | 'audio' | 'internal_note';

export interface Message {
  id: string;
  sender: User;
  content: string;
  timestamp: Date;
  isMe: boolean;
  type?: MessageType; // New: Support internal notes
  audioUrl?: string; 
  transcript?: string;
  translatedContent?: string; // New: Support for translated text
  attachments?: string[]; // URLs of attached images
}

export interface MessageTemplate {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrls?: string[];
  entityId?: string; // Added for property-specific templates
}

export interface Thread {
  id: string;
  platform: Platform;
  subject?: string;
  participants: User[];
  messages: Message[];
  status: MessageStatus;
  priority: Priority;
  lastMessageAt: Date;
  summary?: string;
  sentiment?: 'Positive' | 'Neutral' | 'Negative' | 'Angry'; 
  draftReply?: string; 
  apartmentId?: string; 
  restaurantId?: string; // New: Restaurant support
  teamViewers?: string[]; // IDs of team members looking at this thread
}

export interface AIConfig {
  tone: 'Friendly' | 'Professional' | 'Concise' | 'Urgent';
  autoPilot: boolean; 
  autoPilotDelay: number; 
  language: string;
  aiName?: string; // Added for onboarding persona
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface KnowledgeBaseData {
  generalInfo: string;
  faqs: FAQ[];
  vectorId?: string; // Link to vector DB index
}

export interface AnalyticsData {
  date: string;
  messages: number;
  autoReplies: number;
  manualReplies: number;
}

export interface ConfigField {
  name: string;
  label: string;
  type: 'text' | 'password' | 'email' | 'url';
  placeholder?: string;
  required?: boolean;
  description?: string;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  logo?: string; // URL to brand logo
  icon: string; // Fallback Lucide icon name
  status: 'Connected' | 'Disconnected' | 'Error';
  category: 'Channel Manager' | 'Messaging' | 'Smart Home' | 'Pricing' | 'Operations' | 'Payment' | 'Calendar' | 'E-commerce' | 'Social Media' | 'Accounting' | 'Other';
  lastSync?: Date;
  configFields?: ConfigField[]; // Dynamic configuration fields
}

export type AIProvider = 'Google Gemini' | 'OpenAI' | 'Anthropic' | 'DeepSeek' | 'xAI' | 'Meta' | 'Mistral' | 'OpenRouter' | 'Custom';

export interface AIModel {
  id: string;
  name: string;
  provider: AIProvider;
  modelId: string;
  apiKey?: string;
  endpoint?: string;
  contextWindow?: number;
}

export interface TaskAssignment {
  drafting: string; 
  analysis: string; 
  quickReplies: string; 
  imageGeneration: string; // Added for Marketing visuals
}

export enum BookingStatus {
  Confirmed = 'Confirmed',
  Pending = 'Pending',
  CheckedOut = 'CheckedOut',
  Cancelled = 'Cancelled',
  Blocked = 'Blocked' // Added for calendar blocking
}

export interface FinancialRecord {
    basePrice: number;
    fees: number; // Cleaning fee, shipping fee etc
    fines: number; // Damages, late fees
    currency: string;
    notes?: string; // Reason for fine
}

export type CleaningStatus = 'Clean' | 'Dirty' | 'Scheduled' | 'In Progress';

export interface Booking {
  id: string;
  userId: string;
  guestName: string;
  guestAvatar?: string;
  checkIn: Date;
  checkOut: Date;
  status: BookingStatus;
  paymentStatus: 'Paid' | 'Partial' | 'Unpaid' | 'Refunded';
  platform: Platform;
  totalPrice: number;
  financials?: FinancialRecord; // Detailed breakdown
  guests: number;
  apartmentId?: string; // Added for multi-unit calendar
  restaurantId?: string; // New: Restaurant support
  cleaningStatus?: CleaningStatus; // New: Operations support
  cleanerName?: string; // New: Operations support
}

export type ExpenseCategory = 'Cleaning' | 'Maintenance' | 'Utilities' | 'Inventory' | 'Marketing' | 'Other';

export interface Expense {
  id: string;
  category: ExpenseCategory;
  amount: number;
  date: Date;
  description: string;
  vendor?: string;
  status: 'Paid' | 'Pending';
  apartmentId?: string;
  restaurantId?: string; // New: Restaurant support
  receiptUrl?: string;
}

export interface MaintenanceIssue {
  id: string;
  issue: string;
  location?: string;
  priority: 'High' | 'Medium' | 'Low';
  reportedAt: Date;
  status: 'Open' | 'Assigned' | 'In Progress' | 'Resolved'; // Enhanced status with Assigned
  assignedTo?: string;
  apartmentId?: string;
  restaurantId?: string; // New: Restaurant support
}

export interface LocationInfo {
  title: string;
  uri: string;
  rating?: number;
  address?: string;
}

export interface BookingDraft {
  guestName?: string;
  checkIn?: string;
  checkOut?: string;
  guestCount?: number;
  estimatedPrice?: number;
}

export interface MorningBriefingItem {
  id: string;
  priority: 'Urgent' | 'Action' | 'Info';
  category: 'Message' | 'Booking' | 'Maintenance';
  title: string;
  description: string;
  relatedId?: string; 
}

export interface UpsellOpportunity {
  id: string;
  title: string;
  description: string;
  suggestedReply: string;
  potentialRevenue?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'message' | 'booking' | 'alert' | 'system';
  timestamp: Date;
  read: boolean;
  link?: string;
}

// Workflow Types
export interface Workflow {
  id: string;
  name: string;
  active: boolean;
  trigger: WorkflowTrigger;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  runs: number;
}

export type TriggerType = 
  | 'message_received' 
  | 'booking_created' 
  | 'checkout_completed' 
  | 'sentiment_negative'
  | 'negative_sentiment'
  | 'appointment_booked'
  | 'no_show'
  | 'treatment_completed'
  | 'parts_arrived'
  | 'service_completed'
  | 'estimate_declined'
  | 'inquiry_received'
  | 'contract_signed'
  | 'payment_received'
  | 'reservation_created'
  | 'vip_arrival'
  | 'order_delayed'
  | 'order_placed'
  | 'cart_abandoned'
  | 'return_requested'
  | 'maintenance_reported';

export interface WorkflowTrigger {
  type: TriggerType;
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than';
  value: string;
}

export interface WorkflowAction {
  type: 'send_message' | 'send_email' | 'create_ticket' | 'notify_team' 
      | 'send_survey' | 'reschedule_request' | 'notify_customer' | 'schedule_pickup' 
      | 'send_welcome_kit' | 'assign_coordinator' | 'offer_discount' | 'alert_manager' 
      | 'issue_refund' | 'schedule_cleaning';
  config: Record<string, any>;
}

// Marketing Types
export interface Campaign {
    id: string;
    name: string;
    status: 'Draft' | 'Scheduled' | 'Active' | 'Completed';
    audience: string; // e.g. "VIPs", "Past Guests"
    channel: 'Email' | 'SMS' | 'WhatsApp';
    sentCount: number;
    openRate: number;
    revenue: number;
    content: {
        subject: string;
        body: string;
        imageUrl?: string;
    };
    scheduledFor?: Date;
}

// Campaign Canvas Types
export interface CampaignNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'delay';
  label: string;
  x: number;
  y: number;
  data?: any;
}

export interface CampaignEdge {
  id: string;
  source: string;
  target: string;
}

// Review Types
export interface Review {
    id: string;
    author: string;
    avatar?: string;
    rating: number; // 1-5
    content: string;
    date: Date;
    platform: Platform;
    entityId: string;
    reply?: string;
    replyDate?: Date;
    sentiment: 'Positive' | 'Neutral' | 'Negative' | 'Mixed';
    tags?: string[]; // AI extracted tags e.g., "Cleanliness", "Noise"
}

export type Theme = 'light' | 'dark';

export type AppMode = 'property' | 'ecommerce' | 'restaurant' | 'healthcare' | 'service' | 'automotive' | 'event' | 'custom';

export type PlanTier = 'Starter' | 'Growth' | 'Agency';

export interface Subscription {
  tier: PlanTier;
  interval: 'monthly' | 'yearly';
  status: 'active' | 'past_due' | 'canceled';
}

// Voice Command Types
export type CommandType = 'BLOCK_CALENDAR' | 'CREATE_TICKET' | 'DRAFT_MESSAGE' | 'NAVIGATE' | 'UNKNOWN';

export interface VoiceCommand {
    type: CommandType;
    data: any;
    originalTranscript: string;
}

// --- NEW TYPES FOR EARNING FEATURES ---

export interface Vendor {
    id: string;
    name: string;
    serviceCategory: string; // 'Transport', 'Food', 'Activities'
    contactInfo: string;
    commissionRate: number; // Percentage (e.g., 10 for 10%)
    notes?: string;
}

export interface DemandForecast {
    date: string; // ISO date string YYYY-MM-DD
    demandLevel: 'High' | 'Medium' | 'Low';
    suggestedPrice: number;
    event?: string; // e.g., "Local Concert", "Holiday"
}

// Inventory Types
export interface InventoryItem {
  id: string;
  name: string;
  category: 'Toiletries' | 'Kitchen' | 'Linens' | 'Food' | 'Other';
  quantity: number;
  minThreshold: number;
  unit: string;
  lastRestocked?: Date;
  supplier?: string;
  imageUrl?: string;
}

// Voice Agent Types
export interface CallLog {
    id: string;
    callerName: string;
    callerNumber: string;
    timestamp: Date;
    durationSeconds: number;
    status: 'Completed' | 'Missed' | 'Voicemail' | 'Forwarded';
    transcript: string;
    summary: string;
    actionTaken?: string; // e.g. "Sent Booking Link", "Forwarded to Manager"
    recordingUrl?: string;
}

export interface VoiceAgentConfig {
    isActive: boolean;
    voiceId: string; // 'Puck', 'Kore', etc.
    greeting: string;
    forwardingNumber: string;
    emergencyKeywords: string[];
}

export interface LayoutItem {
  id: string;
  type: 'table-rect' | 'table-round' | 'wall' | 'zone' | 'door' | 'chair' | 'plant';
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  width: number; // Percentage
  height: number; // Percentage
  rotation: number; // Degrees
  label?: string;
  capacity?: number;
  section?: string;
  color?: string;
}

// --- PRICING & COMPETITOR TYPES ---
export interface Competitor {
    id: string;
    name: string;
    price: number;
    color: string;
}

export interface PricingRule {
    id: string;
    name: string;
    condition: string; // e.g., "Occupancy < 50%"
    action: string; // e.g., "Decrease Price by 10%"
    active: boolean;
}

// Smart Rail Selection Type
export interface SmartRailContext {
    type: 'thread' | 'booking' | 'ticket' | 'none';
    data: Thread | Booking | MaintenanceIssue | null;
}

// --- NEW SCHEDULING & LEGAL TYPES ---

export interface Shift {
    id: string;
    employeeName: string;
    role: string;
    startTime: Date;
    endTime: Date;
    status: 'Scheduled' | 'Completed' | 'Open' | 'Conflict';
    aiGenerated?: boolean;
}

export interface ContractDocument {
    id: string;
    title: string;
    type: 'Lease' | 'Vendor' | 'Insurance' | 'Employment';
    status: 'Active' | 'Expired' | 'Pending Renewal';
    expiryDate: Date;
    contentSummary?: string;
    parties: string[];
}

// --- TEAM COLLABORATION TYPES ---
export interface TeamMessage {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: Date;
    threadId?: string; // If related to a customer thread
    mentions?: string[]; // User IDs mentioned
    attachments?: string[];
    isPinned?: boolean;
}

export interface TeamActivity {
    id: string;
    userId: string;
    userName: string;
    action: 'message_sent' | 'booking_created' | 'issue_resolved' | 'review_replied' | 'task_assigned' | 'integration_connected';
    description: string;
    timestamp: Date;
    metadata?: Record<string, any>;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    assignedTo?: string;
    assignedBy?: string;
    status: 'todo' | 'in_progress' | 'completed' | 'cancelled';
    priority: 'Low' | 'Medium' | 'High' | 'Urgent';
    dueDate?: Date;
    createdAt: Date;
    completedAt?: Date;
    relatedThreadId?: string;
    relatedBookingId?: string;
    tags?: string[];
}

// --- EMAIL MARKETING TYPES ---
export interface EmailCampaign {
    id: string;
    name: string;
    subject: string;
    content: string;
    status: 'Draft' | 'Scheduled' | 'Sending' | 'Sent' | 'Paused';
    scheduledFor?: Date;
    sentAt?: Date;
    audience: {
        type: 'all' | 'segment' | 'custom';
        segmentId?: string;
        customEmails?: string[];
    };
    stats: {
        sent: number;
        delivered: number;
        opened: number;
        clicked: number;
        bounced: number;
        unsubscribed: number;
    };
    abTest?: {
        enabled: boolean;
        variantA?: EmailCampaign;
        variantB?: EmailCampaign;
        winner?: 'A' | 'B';
    };
}

export interface EmailSegment {
    id: string;
    name: string;
    description?: string;
    criteria: {
        field: string;
        operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in';
        value: any;
    }[];
    memberCount: number;
    createdAt: Date;
}

// --- REFERRAL PROGRAM TYPES ---
export interface Referral {
    id: string;
    referrerId: string; // Customer who referred
    referredId?: string; // Customer who was referred (if signed up)
    code: string;
    status: 'pending' | 'completed' | 'rewarded';
    rewardAmount?: number;
    rewardType?: 'discount' | 'credit' | 'cash';
    createdAt: Date;
    completedAt?: Date;
}

export interface ReferralProgram {
    enabled: boolean;
    rewardType: 'discount' | 'credit' | 'cash';
    referrerReward: number;
    referredReward: number;
    minPurchaseAmount?: number;
    expirationDays?: number;
}

// --- CUSTOM FIELDS TYPES ---
export interface CustomField {
    id: string;
    name: string;
    label: string;
    type: 'text' | 'number' | 'email' | 'phone' | 'date' | 'select' | 'multiselect' | 'checkbox' | 'textarea';
    required: boolean;
    options?: string[]; // For select/multiselect
    defaultValue?: any;
    entityType: 'booking' | 'customer' | 'thread' | 'maintenance' | 'booking';
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
    };
}

export interface CustomForm {
    id: string;
    name: string;
    description?: string;
    fields: CustomField[];
    entityType: 'booking' | 'customer' | 'thread';
    isActive: boolean;
    conditionalLogic?: {
        fieldId: string;
        condition: 'equals' | 'not_equals' | 'contains';
        value: any;
        thenShow: string[]; // Field IDs to show
    }[];
}

// --- API & WEBHOOKS TYPES ---
export interface ApiKey {
    id: string;
    name: string;
    key: string;
    secret?: string;
    permissions: string[];
    lastUsed?: Date;
    expiresAt?: Date;
    isActive: boolean;
    createdAt: Date;
}

export interface Webhook {
    id: string;
    name: string;
    url: string;
    events: string[]; // e.g., ['booking.created', 'message.received']
    secret?: string;
    isActive: boolean;
    lastTriggered?: Date;
    headers?: Record<string, string>;
    createdAt: Date;
}

// --- ADVANCED SEARCH TYPES ---
export interface SearchFilter {
    field: string;
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between' | 'in';
    value: any;
}

export interface SavedSearch {
    id: string;
    name: string;
    query: string;
    filters: SearchFilter[];
    entityTypes: string[]; // ['thread', 'booking', 'customer']
    createdAt: Date;
    lastUsed?: Date;
}

// --- HEALTHCARE TYPES ---

export interface HealthcarePractice {
  id: string;
  name: string;
  specialty: string; // 'General Practice', 'Dental', 'Physical Therapy', etc.
  address?: string;
  phone?: string;
  email?: string;
  licenseNumber?: string;
  npiNumber?: string; // National Provider Identifier
  acceptedInsurance?: string[];
}

export interface Patient extends User {
  dateOfBirth?: Date;
  insuranceProvider?: string;
  insuranceId?: string;
  allergies?: string[];
  medications?: string[];
  medicalHistory?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  lastVisit?: Date;
  nextAppointment?: Date;
}

export interface Appointment extends Booking {
  practiceId?: string;
  patientId: string;
  appointmentType: 'Consultation' | 'Follow-up' | 'Procedure' | 'Checkup' | 'Emergency' | 'Telemedicine';
  provider?: string; // Doctor/Practitioner name
  chiefComplaint?: string;
  notes?: string;
  insuranceClaim?: {
    claimNumber?: string;
    status: 'Pending' | 'Approved' | 'Denied' | 'Processing';
    amount?: number;
  };
  prescriptions?: {
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
  labOrders?: {
    test: string;
    status: 'Ordered' | 'Completed' | 'Pending';
    results?: string;
  }[];
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  date: Date;
  provider: string;
  diagnosis?: string;
  treatment?: string;
  prescriptions?: string[];
  labResults?: string[];
  notes?: string;
  followUpRequired?: boolean;
  followUpDate?: Date;
}

export type InsuranceProvider = 
  | 'Blue Cross Blue Shield'
  | 'UnitedHealthcare'
  | 'Aetna'
  | 'Cigna'
  | 'Humana'
  | 'Kaiser Permanente'
  | 'Medicare'
  | 'Medicaid'
  | 'Self-Pay'
  | 'Other';

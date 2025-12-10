
import React, { useState, useEffect, useRef } from 'react';
import { Logo } from './Logo';
import { Button } from './ui/button';
import { Check, ArrowRight, Clock, Zap, Shield, Star, MessageSquare, Calendar, TrendingUp, PlayCircle, Users, X, Play, Calculator, DollarSign, BarChart3, Loader2, Building, UtensilsCrossed, ShoppingBag, ChevronDown, ChevronUp, Send, Bot, RefreshCw, Globe, CreditCard, Database, Sparkles, CheckCircle, MapPin, Bell, Activity, Mic, PauseCircle, Quote, Wrench, PartyPopper, Heart, Camera, Link, Instagram, Mail, LayoutGrid, Layers, Plug, Rocket, BookOpen, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { AppMode } from '../types';
import { getTheme } from '../utils/theme';

interface LandingPageProps {
  onNavigate: (view: 'login' | 'signup') => void;
  onModeSelect: (mode: AppMode) => void;
  onInvest?: () => void;
}

type IndustryConfig = {
    label: string;
    icon: React.ReactNode;
    heroHeadline: React.ReactNode;
    heroSub: string;
    scenarios: { id: string, label: string, userMsg: string, aiMsg: string }[];
    features: { icon: any, title: string, desc: string }[];
    roi: { label: string, min: number, max: number, minLabel: string, maxLabel: string, laborRate: number, revenueRate: number };
    stats: { label: string, value: string, sub: string }[];
};

const INDUSTRIES: Record<AppMode, IndustryConfig> = {
    property: {
        label: "Property",
        icon: <Building className="w-4 h-4" />,
        heroHeadline: <>Automate your <span className="text-indigo-600 dark:text-indigo-500">Guest Experience.</span></>,
        heroSub: "Unified inbox, AI-drafted replies, and operational automation for Airbnb, VRBO, and Direct Booking hosts.",
        scenarios: [
            { id: 'wifi', label: 'WiFi Issue', userMsg: "The WiFi isn't working and I have a call!", aiMsg: "I'm sorry! I've just reset the router remotely. Please try connecting to 'Guest_Backup' with password 'fast26' in 2 mins." },
            { id: 'early', label: 'Early Check-in', userMsg: "Can we check in at 11 AM?", aiMsg: "I'd love to host you early! The cleaners finish at 12 PM. I can offer a guaranteed 12 PM check-in for $30?" },
            { id: 'parking', label: 'Parking Info', userMsg: "Where do we park?", aiMsg: "You have a reserved spot #42 behind the building. The gate code is 1992." }
        ],
        features: [
            { icon: MessageSquare, title: "Unified Inbox", desc: "Airbnb, Booking.com, VRBO & WhatsApp in one feed." },
            { icon: Calendar, title: "Smart Calendar", desc: "Prevent double bookings and visualize occupancy." },
            { icon: Zap, title: "Maintenance AI", desc: "Auto-assign plumbing or cleaning tickets from chat." }
        ],
        roi: { label: "Properties", min: 1, max: 50, minLabel: "1 Unit", maxLabel: "50+ Units", laborRate: 25, revenueRate: 1800 }, // $1800/yr extra per unit
        stats: [
            { label: "Response Time", value: "< 1 min", sub: "vs 45 min avg" },
            { label: "Occupancy", value: "+15%", sub: "via fast replies" },
            { label: "Labor Saved", value: "20h", sub: "per week" }
        ]
    },
    restaurant: {
        label: "Restaurant",
        icon: <UtensilsCrossed className="w-4 h-4" />,
        heroHeadline: <>Fill more tables with <span className="text-orange-600 dark:text-orange-500">AI Concierge.</span></>,
        heroSub: "Capture reservations 24/7, answer menu questions instantly, and reduce no-shows with automated confirmations.",
        scenarios: [
            { id: 'reserve', label: 'Reservation', userMsg: "Table for 4 tonight at 7?", aiMsg: "We have a booth available at 7:15 PM or a table at 8:00 PM. Which do you prefer?" },
            { id: 'allergy', label: 'Dietary', userMsg: "Do you have gluten-free pasta?", aiMsg: "Yes! Our Chef's Menu features fresh GF Penne and Zucchini Noodles. We prevent cross-contamination carefully." },
            { id: 'event', label: 'Private Event', userMsg: "Do you host birthday parties?", aiMsg: "Absolutely. For groups over 8, we offer a private room with a set menu. Would you like the brochure?" }
        ],
        features: [
            { icon: Calendar, title: "Table Management", desc: "Sync with OpenTable, Resy, and walk-ins." },
            { icon: UtensilsCrossed, title: "Menu Knowledge", desc: "AI knows every ingredient and allergen instantly." },
            { icon: Users, title: "Waitlist Bot", desc: "Automatically notify guests when tables open up." }
        ],
        roi: { label: "Daily Covers", min: 10, max: 300, minLabel: "10 Guests", maxLabel: "300+ Guests", laborRate: 30, revenueRate: 2000 }, // per cover unit metric roughly
        stats: [
            { label: "Reservations", value: "+22%", sub: "captured via AI" },
            { label: "No-Shows", value: "-40%", sub: "with SMS reminders" },
            { label: "Phone Calls", value: "-85%", sub: "automated" }
        ]
    },
    ecommerce: {
        label: "Retail",
        icon: <ShoppingBag className="w-4 h-4" />,
        heroHeadline: <>Turn support into <span className="text-purple-600 dark:text-purple-500">Sales.</span></>,
        heroSub: "Instant answers for shipping, returns, and product details. Recover abandoned carts on WhatsApp and SMS.",
        scenarios: [
            { id: 'shipping', label: 'Where is my order?', userMsg: "Where is order #1234?", aiMsg: "It's out for delivery! FedEx expects to arrive by 4 PM today. Here is the tracking link." },
            { id: 'product', label: 'Sizing Help', userMsg: "Does this shirt run small?", aiMsg: "It runs slightly slim. If you prefer a loose fit, we recommend sizing up! Free exchanges if it doesn't fit." },
            { id: 'stock', label: 'Back in Stock', userMsg: "When is the blue bag coming back?", aiMsg: "Good news! We just restocked 5 units. Do you want me to add one to your cart?" }
        ],
        features: [
            { icon: ShoppingBag, title: "Order Tracking", desc: "Deep integration with Shopify & WooCommerce." },
            { icon: RefreshCw, title: "Auto-Returns", desc: "Handle exchanges and refunds without an agent." },
            { icon: MessageSquare, title: "Cart Recovery", desc: "Proactive messages to save lost sales." }
        ],
        roi: { label: "Monthly Orders", min: 100, max: 5000, minLabel: "100 Orders", maxLabel: "5000+ Orders", laborRate: 2, revenueRate: 5 }, // per order
        stats: [
            { label: "CSAT Score", value: "4.9/5", sub: "instant answers" },
            { label: "Recovery", value: "$12k", sub: "saved revenue" },
            { label: "Response", value: "0s", sub: "24/7 availability" }
        ]
    },
    healthcare: {
        label: "Healthcare",
        icon: <Heart className="w-4 h-4" />,
        heroHeadline: <>HIPAA-compliant <span className="text-blue-600 dark:text-blue-500">Patient Care.</span></>,
        heroSub: "Automated appointment scheduling, prescription refills, and patient communication for medical practices.",
        scenarios: [
            { id: 'refill', label: 'Prescription Refill', userMsg: "I need a refill on my blood pressure medication.", aiMsg: "I've reviewed your records and sent the prescription to your pharmacy. It should be ready in 2-3 hours. Please schedule a follow-up in 2 weeks." },
            { id: 'appt', label: 'Appointment', userMsg: "Can I get an appointment this week?", aiMsg: "Dr. Chen has an opening Thursday at 2:00 PM or Friday at 10:30 AM. Which works better for you?" },
            { id: 'labs', label: 'Lab Results', userMsg: "Are my blood test results ready?", aiMsg: "Yes, your results came in this morning. Your cholesterol levels look great! Dr. Chen will discuss details at your follow-up next week." }
        ],
        features: [
            { icon: Calendar, title: "Smart Scheduling", desc: "Sync with EHR systems and patient portals." },
            { icon: MessageSquare, title: "Secure Messaging", desc: "HIPAA-compliant patient communication." },
            { icon: Heart, title: "Care Coordination", desc: "Prescription refills, lab orders, and follow-ups." }
        ],
        roi: { label: "Daily Patients", min: 10, max: 200, minLabel: "10 Patients", maxLabel: "200+ Patients", laborRate: 35, revenueRate: 2500 },
        stats: [
            { label: "Admin Time", value: "-25h", sub: "per week" },
            { label: "No-Shows", value: "-45%", sub: "with reminders" },
            { label: "Patient Satisfaction", value: "4.8/5", sub: "instant responses" }
        ]
    },
    service: {
        label: "Wellness",
        icon: <Heart className="w-4 h-4" />,
        heroHeadline: <>Focus on care, not <span className="text-cyan-600 dark:text-cyan-500">Scheduling.</span></>,
        heroSub: "Automated booking, intake forms, and follow-ups for salons, spas, and clinics.",
        scenarios: [
            { id: 'book', label: 'Appointment', userMsg: "Do you have any slots for a massage this Friday?", aiMsg: "We have an opening with Sarah at 2:00 PM or Mike at 4:30 PM. Would you like the book one?" },
            { id: 'prep', label: 'Pre-care Info', userMsg: "What should I wear for the treatment?", aiMsg: "Loose, comfortable clothing is best. We provide robes and slippers upon arrival." },
            { id: 'resched', label: 'Reschedule', userMsg: "I'm running 15 mins late!", aiMsg: "No problem, thanks for letting us know. We'll inform your therapist. Please drive safely!" }
        ],
        features: [
            { icon: Calendar, title: "Smart Scheduling", desc: "Optimizes staff availability and room usage." },
            { icon: MessageSquare, title: "Intake Bot", desc: "Collects medical history or preferences before arrival." },
            { icon: Heart, title: "Retention", desc: "Auto-reminders for recurring treatments." }
        ],
        roi: { label: "Weekly Appts", min: 20, max: 500, minLabel: "20 Clients", maxLabel: "500+ Clients", laborRate: 15, revenueRate: 1500 },
        stats: [
            { label: "No-Shows", value: "-35%", sub: "with reminders" },
            { label: "Admin Time", value: "-15h", sub: "per week" },
            { label: "Rebooking", value: "+20%", sub: "automated" }
        ]
    },
    automotive: {
        label: "Auto",
        icon: <Wrench className="w-4 h-4" />,
        heroHeadline: <>Streamline your <span className="text-slate-600 dark:text-slate-500">Shop Ops.</span></>,
        heroSub: "Status updates, quote approvals, and booking management for repair shops and detailers.",
        scenarios: [
            { id: 'status', label: 'Status Check', userMsg: "Is my Civic ready yet?", aiMsg: "Yes! The brake pad replacement is done. You can pick it up anytime before 6 PM. Total is $240." },
            { id: 'quote', label: 'Quote Request', userMsg: "How much for a full detail on an SUV?", aiMsg: "Our Gold Detail package for SUVs starts at $180. It includes wax, interior shampoo, and engine bay cleaning." },
            { id: 'approval', label: 'Work Approval', userMsg: "Go ahead with the oil change too.", aiMsg: "Great, I've added the synthetic oil change to your job card. We'll have it ready by 4 PM." }
        ],
        features: [
            { icon: Wrench, title: "Job Tracking", desc: "Kanban board for vehicles in the shop." },
            { icon: MessageSquare, title: "Auto-Updates", desc: "SMS customers when parts arrive or work finishes." },
            { icon: Camera, title: "Visual Inspections", desc: "Send photos of worn parts to get instant approval." }
        ],
        roi: { label: "Monthly ROs", min: 50, max: 1000, minLabel: "50 Jobs", maxLabel: "1000+ Jobs", laborRate: 40, revenueRate: 3000 },
        stats: [
            { label: "Approvals", value: "+25%", sub: "faster response" },
            { label: "Calls", value: "-60%", sub: "less 'is it ready?'" },
            { label: "CSI Score", value: "98%", sub: "customer satisfaction" }
        ]
    },
    event: {
        label: "Events",
        icon: <PartyPopper className="w-4 h-4" />,
        heroHeadline: <>Flawless events, <span className="text-rose-600 dark:text-rose-500">Zero Chaos.</span></>,
        heroSub: "Coordinate vendors, manage guest lists, and handle inquiries for venues and planners.",
        scenarios: [
            { id: 'avail', label: 'Venue Availability', userMsg: "Is the Grand Hall open on June 12th?", aiMsg: "Yes, June 12th is available! It can accommodate up to 200 guests. Would you like the schedule a tour?" },
            { id: 'vendor', label: 'Vendor Coord', userMsg: "What time can the florist set up?", aiMsg: "Setup begins at 10 AM. The loading dock is on 4th Street. I've sent them the access code." },
            { id: 'rsvp', label: 'Guest QA', userMsg: "Is there a vegan meal option?", aiMsg: "Yes, the chef has prepared a Roasted Vegetable Tart for vegan guests. Please mark it on your RSVP card." }
        ],
        features: [
            { icon: Calendar, title: "Run of Show", desc: "Detailed timeline management for the big day." },
            { icon: Users, title: "Vendor Portal", desc: "Centralized chat for caterers, florists, and DJs." },
            { icon: MapPin, title: "Lead Capture", desc: "Auto-respond to leads from The Knot and WeddingWire." }
        ],
        roi: { label: "Annual Events", min: 10, max: 200, minLabel: "10 Events", maxLabel: "200+ Events", laborRate: 100, revenueRate: 5000 },
        stats: [
            { label: "Lead Conv.", value: "+30%", sub: "instant replies" },
            { label: "Planning", value: "-100h", sub: "per year" },
            { label: "Reviews", value: "5.0", sub: "perfect execution" }
        ]
    },
    custom: {
        label: "Custom",
        icon: <Briefcase className="w-4 h-4" />,
        heroHeadline: <>Automate your <span className="text-teal-600 dark:text-teal-500">Business.</span></>,
        heroSub: "Unified inbox, AI-drafted replies, and workflow automation for agencies, consultants, and unique businesses.",
        scenarios: [
            { id: 'inquiry', label: 'General Inquiry', userMsg: "What are your consulting rates?", aiMsg: "We offer project-based pricing starting at $2k or hourly retainers. Would you like the full rate card?" },
            { id: 'schedule', label: 'Meeting Request', userMsg: "Can we chat next Tuesday?", aiMsg: "Sure! We have slots open at 10 AM and 2 PM on Tuesday. Which works best for you?" },
            { id: 'support', label: 'Client Support', userMsg: "I can't access the project dashboard.", aiMsg: "I've reset your permissions. Please try logging in again in 5 minutes. Let me know if it persists!" }
        ],
        features: [
            { icon: MessageSquare, title: "Universal Inbox", desc: "Email, Chat, and SMS in one feed." },
            { icon: Bot, title: "Custom AI", desc: "Train the agent on your specific knowledge base." },
            { icon: Activity, title: "Task Automation", desc: "Route tasks to team members automatically." }
        ],
        roi: { label: "Clients", min: 5, max: 100, minLabel: "5 Clients", maxLabel: "100+ Clients", laborRate: 50, revenueRate: 2000 },
        stats: [
            { label: "Efficiency", value: "+40%", sub: "less admin work" },
            { label: "Response", value: "Instant", sub: "24/7 availability" },
            { label: "Growth", value: "2x", sub: "scalable ops" }
        ]
    }
};

const STACK_APPS = [
    { id: 'airbnb', label: 'Airbnb', icon: Building },
    { id: 'shopify', label: 'Shopify', icon: ShoppingBag },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
    { id: 'slack', label: 'Slack', icon: MessageSquare }, 
    { id: 'gmail', label: 'Gmail', icon: Mail },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'stripe', label: 'Stripe', icon: CreditCard },
    { id: 'instagram', label: 'Instagram', icon: Instagram },
];

const LIVE_EVENTS = [
    "⚡ AI handled a late check-in in London",
    "💵 Cart recovered ($145) in New York",
    "📅 Table for 6 booked in Tokyo",
    "🔧 Maintenance ticket auto-assigned in Austin",
    "⭐ 5-Star review received in Berlin",
    "📦 Refund processed instantly in Toronto",
    "🚗 Service appointment booked in Chicago",
    "💍 Wedding tour scheduled in Paris"
];

const INTEGRATION_LOGOS = [
    { name: 'Airbnb', src: 'https://cdn.simpleicons.org/airbnb/FF5A5F' },
    { name: 'Booking.com', src: 'https://cdn.simpleicons.org/bookingdotcom/003580' },
    { name: 'Shopify', src: 'https://cdn.simpleicons.org/shopify/96BF48' },
    { name: 'WhatsApp', src: 'https://cdn.simpleicons.org/whatsapp/25D366' },
    { name: 'Stripe', src: 'https://cdn.simpleicons.org/stripe/008CDD' },
    { name: 'Slack', src: 'https://cdn.simpleicons.org/slack/4A154B' },
    { name: 'Zapier', src: 'https://cdn.simpleicons.org/zapier/FF4F00' },
    { name: 'Gmail', src: 'https://cdn.simpleicons.org/gmail/EA4335' },
    { name: 'WooCommerce', src: 'https://cdn.simpleicons.org/woocommerce/96588A' },
    { name: 'Expedia', src: 'https://cdn.simpleicons.org/expedia/00355F' },
    { name: 'VRBO', src: 'https://cdn.simpleicons.org/vrbo/3E497F' },
    { name: 'OpenTable', src: 'https://cdn.simpleicons.org/opentable/DA3743' },
];

const TESTIMONIALS = [
    { name: "Sarah J.", role: "Property Manager", location: "Miami, FL", text: "It saved me 20 hours a week. I used to wake up at 2AM to answer guests. Now We Do handles it.", rating: 5, img: "https://picsum.photos/id/1011/50" },
    { name: "Mike T.", role: "Restaurant Owner", location: "New York, NY", text: "No-shows dropped by 40% thanks to the automated WhatsApp confirmations. It pays for itself.", rating: 5, img: "https://picsum.photos/id/1012/50" },
    { name: "Elena R.", role: "Boutique Owner", location: "Austin, TX", text: "The abandoned cart recovery on SMS is magic. We recovered $4k in sales last month alone.", rating: 5, img: "https://picsum.photos/id/1027/50" },
    { name: "David K.", role: "Superhost", location: "London, UK", text: "The maintenance AI is smart. It knew to call the plumber when a guest mentioned 'leak'.", rating: 5, img: "https://picsum.photos/id/1005/50" },
    { name: "Priya P.", role: "E-com Manager", location: "Toronto, CA", text: "Setup took 5 minutes. It just works. The AI tone is indistinguishable from my team.", rating: 5, img: "https://picsum.photos/id/1014/50" },
    { name: "James L.", role: "Hotel Ops", location: "Sydney, AU", text: "Multi-language support is flawless. We host guests from everywhere and language is no longer a barrier.", rating: 5, img: "https://picsum.photos/id/1009/50" },
];

// --- SCROLL BEAM COMPONENT ---
const ScrollBeam: React.FC<{ theme: any }> = ({ theme }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            const start = windowHeight * 0.8;
            const end = windowHeight * 0.2;
            
            const totalDistance = (rect.height + start - end);
            const scrolledDistance = (start - rect.top);
            
            let p = (scrolledDistance / totalDistance) * 100;
            p = Math.max(0, Math.min(100, p));
            
            setProgress(p);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Init
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const steps = [
        { id: 1, title: 'Connect', desc: 'Sync your data in one click.', icon: Plug },
        { id: 2, title: 'Train', desc: 'AI learns your business rules.', icon: BookOpen },
        { id: 3, title: 'Automate', desc: 'Go hands-free instantly.', icon: Rocket },
    ];

    return (
        <div ref={sectionRef} className="relative py-24 bg-white dark:bg-gray-950 overflow-hidden">
            <div className="max-w-5xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">How it Works</h2>
                    <p className="text-gray-500">Three simple steps to autopilot.</p>
                </div>

                <div className="relative">
                    {/* Desktop Horizontal Layout */}
                    <div className="hidden md:flex justify-between items-center relative z-10">
                        {/* Background Track */}
                        <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-200 dark:bg-gray-800 -translate-y-1/2 rounded-full"></div>
                        
                        {/* Animated Beam */}
                        <div 
                            className={`absolute top-1/2 left-0 h-2 bg-gradient-to-r ${theme.gradient} -translate-y-1/2 rounded-full transition-all duration-100 ease-out`}
                            style={{ width: `${progress}%` }}
                        >
                            {/* Glowing Head */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
                        </div>

                        {steps.map((step, index) => {
                            const isActive = progress >= ((index) / (steps.length - 1)) * 100;
                            return (
                                <div key={step.id} className="relative flex flex-col items-center group">
                                    <div 
                                        className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-500 z-20 ${
                                            isActive 
                                                ? `bg-white dark:bg-gray-900 ${theme.borderStrong} scale-110 shadow-[0_0_30px_rgba(0,0,0,0.1)]` 
                                                : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 grayscale'
                                        }`}
                                    >
                                        <step.icon className={`w-6 h-6 ${isActive ? theme.text : 'text-gray-400'}`} />
                                    </div>
                                    <div className={`mt-6 text-center transition-opacity duration-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-2'}`}>
                                        <h3 className={`text-lg font-bold ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>{step.title}</h3>
                                        <p className="text-sm text-gray-500 max-w-[150px]">{step.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Mobile Vertical Layout */}
                    <div className="flex md:hidden flex-col gap-12 relative pl-8">
                        {/* Background Track */}
                        <div className="absolute left-[19px] top-0 w-1 h-full bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                        
                        {/* Animated Beam */}
                        <div 
                            className={`absolute left-[19px] top-0 w-1 bg-gradient-to-b ${theme.gradient} rounded-full transition-all duration-100 ease-out`}
                            style={{ height: `${progress}%` }}
                        ></div>

                        {steps.map((step, index) => {
                            const isActive = progress >= ((index) / (steps.length - 1)) * 100;
                            return (
                                <div key={step.id} className="relative flex items-center gap-6">
                                    <div 
                                        className={`absolute left-0 w-10 h-10 -ml-[20px] rounded-full flex items-center justify-center border-4 transition-all duration-500 z-20 ${
                                            isActive 
                                                ? `bg-white dark:bg-gray-900 ${theme.borderStrong} scale-110` 
                                                : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 grayscale'
                                        }`}
                                    >
                                        <step.icon className={`w-4 h-4 ${isActive ? theme.text : 'text-gray-400'}`} />
                                    </div>
                                    <div className={`transition-opacity duration-500 ml-6 ${isActive ? 'opacity-100' : 'opacity-50'}`}>
                                        <h3 className={`text-lg font-bold ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>{step.title}</h3>
                                        <p className="text-sm text-gray-500">{step.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onModeSelect, onInvest }) => {
  const [activeMode, setActiveMode] = useState<AppMode>('property');
  const [showVideo, setShowVideo] = useState(false);
  const [metricCount, setMetricCount] = useState(10);
  const [chatHistory, setChatHistory] = useState<{sender: 'user' | 'ai', text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [liveEventIndex, setLiveEventIndex] = useState(0);
  
  // 3D Tilt State
  const [heroRotate, setHeroRotate] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  // Stack Builder State
  const [stack, setStack] = useState<string[]>(['airbnb', 'whatsapp', 'stripe']);

  const config = INDUSTRIES[activeMode];
  const theme = getTheme(activeMode);

  // 3D Tilt Logic
  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (max 10 degrees)
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    setHeroRotate({ x: rotateX, y: rotateY });
  };

  const handleHeroMouseLeave = () => {
    setHeroRotate({ x: 0, y: 0 });
  };

  // Stack Logic
  const toggleApp = (id: string) => {
    setStack(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // Cleanup speech on unmount
  useEffect(() => {
      return () => {
          window.speechSynthesis.cancel();
      };
  }, []);

  // Live Ticker Effect
  useEffect(() => {
      const interval = setInterval(() => {
          setLiveEventIndex(prev => (prev + 1) % LIVE_EVENTS.length);
      }, 4000);
      return () => clearInterval(interval);
  }, []);

  // Run Scenario when mode or index changes
  useEffect(() => {
      const runScenario = () => {
          setChatHistory([]);
          setIsTyping(false);
          const scenario = config.scenarios[activeScenarioIndex];
          
          setTimeout(() => {
              setChatHistory([{ sender: 'user', text: scenario.userMsg }]);
              setIsTyping(true);
              setTimeout(() => {
                  setIsTyping(false);
                  setChatHistory([
                      { sender: 'user', text: scenario.userMsg },
                      { sender: 'ai', text: scenario.aiMsg }
                  ]);
              }, 1500);
          }, 500);
      };
      runScenario();
  }, [activeMode, activeScenarioIndex]);

  const handleModeChange = (mode: AppMode) => {
      setActiveMode(mode);
      onModeSelect(mode);
      setActiveScenarioIndex(0);
      if (mode === 'property') setMetricCount(10);
      if (mode === 'restaurant') setMetricCount(50);
      if (mode === 'ecommerce') setMetricCount(500);
      if (mode === 'healthcare') setMetricCount(100);
      if (mode === 'service') setMetricCount(50);
      if (mode === 'automotive') setMetricCount(100);
      if (mode === 'event') setMetricCount(20);
      if (mode === 'custom') setMetricCount(10);
  };

  // ROI Calcs
  const annualLaborSavings = (metricCount * config.roi.laborRate * 12).toLocaleString();
  const annualRevenue = (metricCount * config.roi.revenueRate).toLocaleString();
  const stackTimeSaved = stack.length * 5; // 5 hours per app connected

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white overflow-x-hidden selection:bg-indigo-500 selection:text-white font-sans">
      
      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in" onClick={() => setShowVideo(false)}>
            <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800" onClick={e => e.stopPropagation()}>
                <button onClick={() => setShowVideo(false)} className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full z-10 transition-colors"><X className="w-6 h-6" /></button>
                <div className="absolute inset-0 flex items-center justify-center group cursor-pointer bg-gray-900">
                     <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-50"></div>
                     <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/20 group-hover:scale-110 transition-transform z-10">
                        <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                     </div>
                </div>
            </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <Logo 
                className="w-8 h-8" 
                textClassName="text-xl" 
                color={theme.hex} 
                secondaryColor={theme.hex === '#4f46e5' ? '#9333EA' : theme.hex} // Fallback to same if not purple for consistency or simple logic
            />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => onNavigate('login')} className="hidden sm:flex">Log in</Button>
            <Button onClick={() => onNavigate('signup')} className={`${theme.bg} ${theme.hover} text-white rounded-full px-6`}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-28 pb-12 lg:pt-36 lg:pb-16 overflow-hidden">
        {/* Live Pulse Ticker */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur shadow-sm border border-gray-200 dark:border-gray-700 rounded-full px-4 py-1.5 flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300 animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span key={liveEventIndex} className="animate-slide-up">{LIVE_EVENTS[liveEventIndex]}</span>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-12">
              
              {/* Industry Switcher */}
              <div className="inline-flex flex-wrap justify-center gap-2 bg-gray-100 dark:bg-gray-900/50 p-2 rounded-2xl mb-8 border border-gray-200 dark:border-gray-800 shadow-inner">
                  {(Object.keys(INDUSTRIES) as AppMode[]).map(mode => {
                      const modeTheme = getTheme(mode);
                      return (
                      <button
                        key={mode}
                        onClick={() => handleModeChange(mode)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                            activeMode === mode 
                                ? `bg-white dark:bg-gray-800 ${modeTheme.text} shadow-sm scale-105 ring-1 ${modeTheme.ring}` 
                                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                      >
                          {INDUSTRIES[mode].icon}
                          <span className="hidden sm:inline">{INDUSTRIES[mode].label}</span>
                      </button>
                  )})}
              </div>
              
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 animate-slide-up min-h-[140px] md:min-h-[160px]">
                {config.heroHeadline}
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up min-h-[60px]">
                {config.heroSub}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
                <Button size="lg" onClick={() => onNavigate('signup')} className={`h-12 px-8 text-base rounded-full ${theme.bg} ${theme.hover} shadow-lg w-full sm:w-auto`}>
                  Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => setShowVideo(true)} className="h-12 px-8 text-base rounded-full border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 backdrop-blur-sm w-full sm:w-auto">
                  <PlayCircle className="mr-2 w-4 h-4" /> Watch Demo
                </Button>
              </div>
          </div>

          {/* --- 3D TILT SIMULATOR SECTION --- */}
          <div className="max-w-5xl mx-auto animate-slide-up mb-12 perspective-1000" style={{ perspective: '1000px' }}>
              <div 
                  ref={heroRef}
                  onMouseMove={handleHeroMouseMove}
                  onMouseLeave={handleHeroMouseLeave}
                  className="bg-gray-100 dark:bg-gray-800/50 p-2 rounded-[2.5rem] border-4 border-gray-200 dark:border-gray-800 shadow-2xl transition-transform duration-100 ease-out transform-style-3d relative overflow-hidden group"
                  style={{
                      transform: `rotateX(${heroRotate.x}deg) rotateY(${heroRotate.y}deg)`,
                  }}
              >
                  {/* Holographic Sheen Overlay */}
                  <div 
                      className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                          background: `linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) ${50 + heroRotate.y * 2}%, transparent 100%)`
                      }}
                  />

                  <div className="bg-white dark:bg-gray-950 rounded-[2rem] overflow-hidden flex flex-col md:flex-row h-auto md:h-[550px] relative z-10">
                      
                      {/* Left: Context & Scenarios */}
                      <div className="w-full md:w-1/3 bg-gray-50 dark:bg-gray-900 p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800 flex flex-col">
                          <div className="mb-6">
                              <Badge className={`mb-2 ${theme.lightBg} ${theme.text} hover:${theme.lightBg} border-0`}>Try it live</Badge>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white">See {config.label} AI in action</h3>
                              <p className="text-sm text-gray-500 mt-2">Select a real-world scenario to see how the agent handles it.</p>
                          </div>
                          
                          <div className="flex flex-col gap-3">
                              {config.scenarios.map((scenario, idx) => (
                                  <button
                                      key={scenario.id}
                                      onClick={() => setActiveScenarioIndex(idx)}
                                      className={`text-left p-4 rounded-xl border transition-all duration-300 group ${
                                          activeScenarioIndex === idx 
                                              ? `bg-white dark:bg-gray-800 ${theme.borderStrong} shadow-md ring-1 ${theme.ring}` 
                                              : 'bg-transparent border-gray-200 dark:border-gray-800 hover:bg-white dark:hover:bg-gray-800'
                                      }`}
                                  >
                                      <div className="flex items-center justify-between mb-1">
                                          <div className="font-bold text-sm text-gray-900 dark:text-white">{scenario.label}</div>
                                          {activeScenarioIndex === idx && <Activity className={`w-4 h-4 ${theme.text} animate-pulse`} />}
                                      </div>
                                      <div className="text-xs text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 truncate">
                                          "{scenario.userMsg}"
                                      </div>
                                  </button>
                              ))}
                          </div>

                          <div className="mt-auto pt-6">
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                  <Globe className="w-3 h-3" /> Supports 30+ languages
                              </div>
                          </div>
                      </div>

                      {/* Right: Chat UI */}
                      <div className="w-full md:w-2/3 flex flex-col bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat relative">
                          {/* Chat Header */}
                          <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm flex items-center justify-between z-10">
                              <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-full ${theme.bg} flex items-center justify-center text-white shadow-lg`}>
                                      <Bot className="w-6 h-6" />
                                  </div>
                                  <div>
                                      <div className="font-bold text-sm text-gray-900 dark:text-white">We Do Assistant</div>
                                      <div className="flex items-center gap-1 text-[10px] text-green-500 font-medium uppercase tracking-wider">
                                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
                                      </div>
                                  </div>
                              </div>
                              <Button size="sm" variant="ghost" className="h-8 text-xs text-gray-400">Clear Chat</Button>
                          </div>

                          {/* Messages */}
                          <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-gray-50/50 dark:bg-black/20">
                              {chatHistory.map((msg, i) => (
                                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'} animate-scale-in`}>
                                      <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed relative ${
                                          msg.sender === 'user' 
                                              ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none' 
                                              : `${theme.bg} text-white rounded-br-none`
                                      }`}>
                                          {msg.text}
                                          <div className={`absolute bottom-1 ${msg.sender === 'user' ? '-right-5' : '-left-5'} text-[10px] text-gray-400 opacity-0 group-hover:opacity-100`}>Now</div>
                                      </div>
                                  </div>
                              ))}
                              
                              {isTyping && (
                                  <div className="flex justify-end animate-fade-in">
                                      <div className={`${theme.bg} text-white p-4 rounded-2xl rounded-br-none flex gap-1 items-center shadow-sm`}>
                                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
                                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                                      </div>
                                  </div>
                              )}
                          </div>

                          {/* Fake Input */}
                          <div className="p-4 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
                              <div className="relative">
                                  <input 
                                      disabled 
                                      placeholder="AI is replying..." 
                                      className="w-full bg-gray-100 dark:bg-gray-900 border-0 rounded-full h-12 pl-5 pr-12 text-sm focus:ring-0 cursor-not-allowed opacity-70"
                                  />
                                  <button className={`absolute right-2 top-2 w-8 h-8 ${theme.bg} rounded-full flex items-center justify-center text-white opacity-50`}>
                                      <Send className="w-4 h-4" />
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </section>

      {/* --- SCROLL TRIGGERED BEAM SECTION --- */}
      <ScrollBeam theme={theme} />

      {/* --- INFINITE INTEGRATIONS MARQUEE --- */}
      <div className="w-full bg-gray-50 dark:bg-gray-900/50 py-8 overflow-hidden border-y border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 mb-6 text-center">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Powering 5,000+ Businesses on</p>
          </div>
          <div className="relative flex overflow-x-hidden group">
              <div className="animate-marquee whitespace-nowrap flex gap-12 items-center">
                  {[...INTEGRATION_LOGOS, ...INTEGRATION_LOGOS].map((logo, i) => (
                      <div key={i} className="flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer shrink-0">
                          <img src={logo.src} alt={logo.name} className="h-8 w-auto" />
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* --- FEATURES GRID --- */}
      <section className="py-24 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold mb-4">Everything you need to run your {config.label}.</h2>
                  <p className="text-gray-600 dark:text-gray-400">Tailored tools for the {activeMode} industry.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {config.features.map((feature, i) => (
                      <div key={i} className={`p-8 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:${theme.border} dark:hover:border-opacity-50 transition-all hover:shadow-xl hover:-translate-y-1 group`}>
                          <div className={`w-14 h-14 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform ${theme.text} dark:${theme.text.replace('600', '400')} border border-gray-100 dark:border-gray-700`}>
                              <feature.icon className="w-7 h-7" />
                          </div>
                          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                              {feature.desc}
                          </p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* --- NEW: INTERACTIVE STACK BUILDER --- */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent dark:from-white/5 opacity-50"></div>
          
          <div className="max-w-7xl mx-auto px-4 relative z-10">
              <div className="text-center mb-16">
                  <Badge variant="secondary" className="mb-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">Automation Studio</Badge>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Build Your Perfect Stack</h2>
                  <p className="text-gray-600 dark:text-gray-400">Click apps to connect them to your AI Core and see the impact.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                  
                  {/* Left Column: Apps Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {STACK_APPS.map(app => {
                          const isSelected = stack.includes(app.id);
                          return (
                              <button
                                  key={app.id}
                                  onClick={() => toggleApp(app.id)}
                                  className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-3 relative overflow-hidden ${
                                      isSelected 
                                          ? `bg-white dark:bg-gray-800 ${theme.borderStrong} shadow-lg scale-105` 
                                          : 'bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 grayscale opacity-80 hover:opacity-100 hover:grayscale-0'
                                  }`}
                              >
                                  {isSelected && (
                                      <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-5`}></div>
                                  )}
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSelected ? theme.lightBg : 'bg-gray-100 dark:bg-gray-800'}`}>
                                      <app.icon className={`w-5 h-5 ${isSelected ? theme.text : 'text-gray-500'}`} />
                                  </div>
                                  <span className={`text-xs font-bold ${isSelected ? theme.text : 'text-gray-500'}`}>{app.label}</span>
                                  {isSelected && (
                                      <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${theme.bg} animate-pulse`}></div>
                                  )}
                              </button>
                          );
                      })}
                  </div>

                  {/* Center Column: The Brain */}
                  <div className="flex flex-col items-center justify-center">
                      <div className="relative w-48 h-48 flex items-center justify-center">
                          {/* Pulsing Rings */}
                          <div className={`absolute inset-0 rounded-full ${theme.bg} opacity-20 animate-ping`}></div>
                          <div className={`absolute inset-4 rounded-full ${theme.bg} opacity-20 animate-pulse`}></div>
                          
                          {/* Core */}
                          <div className={`relative z-10 w-32 h-32 bg-gradient-to-br ${theme.gradient} rounded-full flex items-center justify-center shadow-2xl border-4 border-white dark:border-gray-900`}>
                              <Bot className="w-16 h-16 text-white animate-bounce-gentle" />
                          </div>

                          {/* Connection Lines (Visual Abstraction) */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              {/* Rotating ring to imply connection */}
                              <div className={`w-64 h-64 border-2 border-dashed ${theme.border} rounded-full animate-spin-slow opacity-30`}></div>
                          </div>
                      </div>
                      
                      <div className="mt-8 text-center bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 animate-slide-up">
                          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Potential Time Saved</div>
                          <div className={`text-3xl font-extrabold ${theme.text} flex items-center justify-center gap-2`}>
                              <Clock className="w-6 h-6" /> {stackTimeSaved} hrs
                              <span className="text-sm text-gray-400 font-normal">/ week</span>
                          </div>
                      </div>
                  </div>

                  {/* Right Column: Workflow Preview */}
                  <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
                      <CardHeader className="border-b border-gray-100 dark:border-gray-700">
                          <CardTitle className="text-base flex items-center gap-2">
                              <LayoutGrid className="w-4 h-4" /> Active Workflows
                          </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                          <div className="divide-y divide-gray-100 dark:divide-gray-700">
                              {stack.length === 0 ? (
                                  <div className="p-8 text-center text-gray-400 text-sm">Select apps to see workflows</div>
                              ) : (
                                  stack.slice(0, 4).map((appId, i) => (
                                      <div key={i} className="p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                          <div className={`p-2 rounded-lg ${theme.lightBg} dark:bg-opacity-20`}>
                                              <Zap className={`w-4 h-4 ${theme.text}`} />
                                          </div>
                                          <div>
                                              <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                                  Sync {appId} Data
                                              </div>
                                              <div className="text-xs text-gray-500">Auto-updates every 15m</div>
                                          </div>
                                          <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                                      </div>
                                  ))
                              )}
                              {stack.length > 4 && (
                                  <div className="p-3 text-center text-xs text-gray-500 italic">
                                      + {stack.length - 4} more active flows
                                  </div>
                              )}
                          </div>
                          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-b-xl border-t border-gray-100 dark:border-gray-700">
                              <Button className={`w-full ${theme.bg} text-white shadow-md`} onClick={() => onNavigate('signup')}>
                                  Activate This Stack
                              </Button>
                          </div>
                      </CardContent>
                  </Card>

              </div>
          </div>
      </section>

      {/* --- STATS BANNER --- */}
      <section className={`py-12 ${theme.bg} text-white`}>
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/20">
              {config.stats.map((stat, i) => (
                  <div key={i} className="text-center pt-8 md:pt-0 px-4">
                      <div className="text-4xl md:text-5xl font-extrabold mb-2">{stat.value}</div>
                      <div className="text-lg font-semibold opacity-90">{stat.label}</div>
                      <div className="text-sm opacity-70 mt-1">{stat.sub}</div>
                  </div>
              ))}
          </div>
      </section>

      {/* --- TESTIMONIALS WALL --- */}
      <section className="py-24 bg-white dark:bg-gray-950 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Trusted by 5,000+ Businesses</h2>
                  <p className="text-gray-600 dark:text-gray-400">Don't just take our word for it.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto">
                  {TESTIMONIALS.map((review, i) => (
                      <Card key={i} className="bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all duration-300 break-inside-avoid mb-0">
                          <CardContent className="p-6">
                              <div className="flex gap-1 text-yellow-400 mb-4">
                                  {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed relative">
                                  <Quote className="w-8 h-8 text-gray-200 dark:text-gray-800 absolute -top-2 -left-2 -z-10" />
                                  "{review.text}"
                              </p>
                              <div className="flex items-center gap-3">
                                  <img src={review.img} alt={review.name} className="w-10 h-10 rounded-full object-cover" />
                                  <div>
                                      <div className="font-bold text-gray-900 dark:text-white text-sm">{review.name}</div>
                                      <div className="text-xs text-gray-500">{review.role} • {review.location}</div>
                                  </div>
                              </div>
                          </CardContent>
                      </Card>
                  ))}
              </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-950 py-12 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 text-center">
              <div className="flex justify-center mb-6">
                  <Logo 
                    className="w-8 h-8" 
                    textClassName="text-xl" 
                    color={theme.hex}
                    secondaryColor={theme.hex === '#4f46e5' ? '#9333EA' : theme.hex}
                  />
              </div>
              <p className="text-gray-500 mb-8">
                  &copy; {new Date().getFullYear()} We Do. Automating business communication worldwide.
              </p>
              <div className="flex justify-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                  <a href="#" className={`hover:${theme.text}`}>Privacy</a>
                  <a href="#" className={`hover:${theme.text}`}>Terms</a>
                  <a href="#" className={`hover:${theme.text}`}>Contact</a>
                  {onInvest && (
                      <button onClick={onInvest} className={`hover:${theme.text} text-indigo-600 dark:text-indigo-400 font-bold`}>
                          Invest in We Do
                      </button>
                  )}
              </div>
          </div>
      </footer>

    </div>
  );
};

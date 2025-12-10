
import React, { useState, useRef, useMemo } from 'react';
import { AppMode, Campaign, PlanTier, AIModel, TaskAssignment } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Megaphone, Plus, Send, Sparkles, Users, Mail, Loader2, Calendar, CheckCircle2, Zap, ArrowRight, RefreshCw, TrendingUp, DollarSign, Wand2, Smartphone, Monitor, ImageIcon, Clock, UploadCloud, Facebook, Instagram, Linkedin, Copy, HeartHandshake, UserX, MessageCircle, X, Share2, Link, Award } from 'lucide-react';
import { generateCampaignContent, refineMarketingText, generateMarketingImage, generateSocialContent, generateWinBackMessage, generateReferralMessage } from '../services/geminiService';
import { Badge } from './ui/badge';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UpgradeModal } from './ui/UpgradeModal';
import { getTheme } from '../utils/theme';

interface MarketingProps {
    appMode: AppMode;
    currentPlan: PlanTier;
    onUpgrade: () => void;
    models: AIModel[];
    taskAssignments: TaskAssignment;
}

// Types for dynamic mocks
interface LostCustomer {
    id: string; 
    name: string; 
    avatar: string; 
    ltv: number; 
    lastVisit: string; 
    lastPurchase: string; 
    status: 'At Risk' | 'Dormant' | 'Lost'
}

const Marketing: React.FC<MarketingProps> = ({ appMode, currentPlan, onUpgrade, models, taskAssignments }) => {
    const theme = getTheme(appMode);
    const [activeTab, setActiveTab] = useState<'campaigns' | 'social' | 'retention' | 'referrals'>('campaigns');
    
    // Dynamic Mock Data Generators
    const mockCampaigns = useMemo(() => {
        if (appMode === 'ecommerce') return [
            { id: 'c1', name: 'Flash Sale 24h', status: 'Active', audience: 'Cart Abandoners', channel: 'SMS', sentCount: 5400, openRate: 0.92, revenue: 12500, content: { subject: 'Flash Sale', body: '...' }, scheduledFor: new Date() },
            { id: 'c2', name: 'New Collection Drop', status: 'Completed', audience: 'All Subscribers', channel: 'Email', sentCount: 25000, openRate: 0.35, revenue: 45000, content: { subject: 'Look inside', body: '...' }, scheduledFor: new Date() }
        ];
        if (appMode === 'restaurant') return [
            { id: 'c1', name: 'Valentine Dinner Invite', status: 'Active', audience: 'VIP Diners', channel: 'SMS', sentCount: 300, openRate: 0.82, revenue: 1500, content: { subject: 'Table for two?', body: '...' }, scheduledFor: new Date() },
            { id: 'c2', name: 'Weekend Special', status: 'Completed', audience: 'Locals', channel: 'Instagram', sentCount: 1200, openRate: 0.50, revenue: 800, content: { subject: 'Fresh catch', body: '...' }, scheduledFor: new Date() }
        ];
        if (appMode === 'service') return [
            { id: 'c1', name: 'Spa Day Promo', status: 'Active', audience: 'Past Clients', channel: 'Email', sentCount: 800, openRate: 0.55, revenue: 4200, content: { subject: 'Relax & Recharge', body: '...' }, scheduledFor: new Date() },
            { id: 'c2', name: 'Membership Drive', status: 'Completed', audience: 'Frequent Visitors', channel: 'SMS', sentCount: 250, openRate: 0.70, revenue: 5000, content: { subject: 'Join VIP', body: '...' }, scheduledFor: new Date() }
        ];
        if (appMode === 'automotive') return [
            { id: 'c1', name: 'Winter Tire Special', status: 'Active', audience: 'SUV Owners', channel: 'Email', sentCount: 2000, openRate: 0.40, revenue: 15000, content: { subject: 'Safe driving', body: '...' }, scheduledFor: new Date() },
            { id: 'c2', name: 'Oil Change Reminder', status: 'Scheduled', audience: '6 Months Since Service', channel: 'SMS', sentCount: 400, openRate: 0.0, revenue: 0, content: { subject: 'Time for service', body: '...' }, scheduledFor: new Date(Date.now() + 86400000) }
        ];
        if (appMode === 'event') return [
            { id: 'c1', name: 'Wedding Expo Follow-up', status: 'Active', audience: 'Leads', channel: 'Email', sentCount: 150, openRate: 0.65, revenue: 0, content: { subject: 'Thanks for visiting', body: '...' }, scheduledFor: new Date() },
            { id: 'c2', name: 'Holiday Party Early Bird', status: 'Completed', audience: 'Corporate Clients', channel: 'LinkedIn', sentCount: 500, openRate: 0.25, revenue: 25000, content: { subject: 'Book now', body: '...' }, scheduledFor: new Date() }
        ];
        return [
            { id: 'c1', name: 'Winter Getaway Promo', status: 'Completed', audience: 'Past Guests', channel: 'Email', sentCount: 1250, openRate: 0.45, revenue: 3200, content: { subject: 'Escape the cold!', body: '...' }, scheduledFor: new Date() },
            { id: 'c2', name: 'Return Guest Discount', status: 'Active', audience: '2025 Guests', channel: 'WhatsApp', sentCount: 150, openRate: 0.78, revenue: 2100, content: { subject: 'We miss you', body: '...' }, scheduledFor: new Date() }
        ];
    }, [appMode]);

    const mockLostCustomers: LostCustomer[] = useMemo(() => {
        if (appMode === 'ecommerce') return [
            { id: 'lc1', name: 'Jessica Lee', avatar: 'https://picsum.photos/id/1027/50', ltv: 850, lastVisit: '6 months ago', lastPurchase: 'Summer Dress Collection', status: 'Lost' },
            { id: 'lc2', name: 'David Chen', avatar: 'https://picsum.photos/id/1012/50', ltv: 1200, lastVisit: '4 months ago', lastPurchase: 'Leather Boots', status: 'Dormant' },
            { id: 'lc3', name: 'Sarah Smith', avatar: 'https://picsum.photos/id/1011/50', ltv: 2500, lastVisit: '60 days ago', lastPurchase: 'Accessories Bundle', status: 'At Risk' },
        ];
        if (appMode === 'restaurant') return [
            { id: 'lc1', name: 'Michael Ross', avatar: 'https://picsum.photos/id/1005/50', ltv: 2100, lastVisit: '4 months ago', lastPurchase: 'Family Dinner (Party of 8)', status: 'Dormant' },
            { id: 'lc2', name: 'Elena Gomez', avatar: 'https://picsum.photos/id/1025/50', ltv: 500, lastVisit: '5 months ago', lastPurchase: 'Date Night', status: 'Lost' },
            { id: 'lc3', name: 'Tom Hardy', avatar: 'https://picsum.photos/id/305/50', ltv: 1500, lastVisit: '30 days ago', lastPurchase: 'Business Lunch', status: 'At Risk' },
        ];
        if (appMode === 'service') return [
            { id: 'lc1', name: 'Amanda Blue', avatar: 'https://picsum.photos/id/1011/50', ltv: 1200, lastVisit: '4 months ago', lastPurchase: 'Full Body Massage', status: 'At Risk' },
            { id: 'lc2', name: 'John K.', avatar: 'https://picsum.photos/id/1005/50', ltv: 800, lastVisit: '6 months ago', lastPurchase: 'Haircut & Style', status: 'Lost' },
            { id: 'lc3', name: 'Lisa M.', avatar: 'https://picsum.photos/id/1027/50', ltv: 2000, lastVisit: '3 months ago', lastPurchase: 'Facial Package', status: 'Dormant' },
        ];
        if (appMode === 'automotive') return [
            { id: 'lc1', name: 'Robert Ford', avatar: 'https://picsum.photos/id/1012/50', ltv: 3500, lastVisit: '8 months ago', lastPurchase: 'Major Service', status: 'Dormant' },
            { id: 'lc2', name: 'Jenny T.', avatar: 'https://picsum.photos/id/1027/50', ltv: 500, lastVisit: '1 year ago', lastPurchase: 'Oil Change', status: 'Lost' },
            { id: 'lc3', name: 'Mark S.', avatar: 'https://picsum.photos/id/1001/50', ltv: 1200, lastVisit: '5 months ago', lastPurchase: 'Brake Pads', status: 'At Risk' },
        ];
        if (appMode === 'event') return [
            { id: 'lc1', name: 'Tech Corp', avatar: 'https://cdn.simpleicons.org/google/4285F4', ltv: 50000, lastVisit: '1 year ago', lastPurchase: 'Annual Summit', status: 'Dormant' },
            { id: 'lc2', name: 'Smith Wedding', avatar: 'https://picsum.photos/id/1011/50', ltv: 15000, lastVisit: '2 years ago', lastPurchase: 'Reception', status: 'Lost' }, // Less relevant for retention but good for referral
            { id: 'lc3', name: 'Local Charity', avatar: 'https://picsum.photos/id/1005/50', ltv: 8000, lastVisit: '9 months ago', lastPurchase: 'Gala Dinner', status: 'At Risk' },
        ];
        return [
            { id: 'lc1', name: 'Sarah Jenkins', avatar: 'https://picsum.photos/id/1011/50', ltv: 4500, lastVisit: '95 days ago', lastPurchase: 'Penthouse Suite (Anniversary)', status: 'At Risk' },
            { id: 'lc2', name: 'John Doe', avatar: 'https://picsum.photos/id/1001/50', ltv: 3000, lastVisit: '1 year ago', lastPurchase: 'Beach Villa', status: 'Dormant' },
            { id: 'lc3', name: 'Emily Blunt', avatar: 'https://picsum.photos/id/1020/50', ltv: 1200, lastVisit: '2 years ago', lastPurchase: 'Studio Apt', status: 'Lost' },
        ];
    }, [appMode]);

    const mockAdvocates = useMemo(() => {
        return [
            { id: 'adv1', name: 'Emma Watson', referrals: 12, revenue: 4500, code: 'EMMA-VIP' },
            { id: 'adv2', name: 'Tom Hardy', referrals: 5, revenue: 1200, code: 'TOM-FRIENDS' },
            { id: 'adv3', name: 'Alice Cooper', referrals: 3, revenue: 600, code: 'ALICE-20' },
        ];
    }, []);

    const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns as any);
    const [isCreating, setIsCreating] = useState(false);
    const [showUpgrade, setShowUpgrade] = useState(false);
    
    // Creation State (Campaigns)
    const [step, setStep] = useState(1);
    const [goal, setGoal] = useState('');
    const [audience, setAudience] = useState('');
    const [channel, setChannel] = useState<'Email' | 'SMS' | 'WhatsApp'>('Email');
    const [isGenerating, setIsGenerating] = useState(false);
    const [draft, setDraft] = useState<{ subject: string, body: string } | null>(null);
    const [draftImage, setDraftImage] = useState<string | null>(null);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    
    // Scheduling State
    const [scheduleDate, setScheduleDate] = useState('');
    const [scheduleTime, setScheduleTime] = useState('');
    
    // Refinement State
    const [isRefining, setIsRefining] = useState(false);
    const [activePreviewMode, setActivePreviewMode] = useState<'email' | 'mobile'>('email');

    // Social Media State
    const [socialPlatform, setSocialPlatform] = useState<'Instagram' | 'Facebook' | 'LinkedIn'>('Instagram');
    const [socialImage, setSocialImage] = useState<string | null>(null);
    const [socialCaption, setSocialCaption] = useState('');
    const [socialHashtags, setSocialHashtags] = useState<string[]>([]);
    const [isGeneratingSocial, setIsGeneratingSocial] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Retention State
    const [selectedLostCustomer, setSelectedLostCustomer] = useState<LostCustomer | null>(null);
    const [winBackDraft, setWinBackDraft] = useState<{thoughtProcess: string, message: string} | null>(null);
    const [isGeneratingWinBack, setIsGeneratingWinBack] = useState(false);

    // Referral State
    const [referralCandidate, setReferralCandidate] = useState<LostCustomer | null>(null);
    const [referralReward, setReferralReward] = useState('$50');
    const [referralDraft, setReferralDraft] = useState<{ code: string, message: string } | null>(null);
    const [isGeneratingReferral, setIsGeneratingReferral] = useState(false);

    const chartData = [
        { day: 'Mon', revenue: 120 },
        { day: 'Tue', revenue: 300 },
        { day: 'Wed', revenue: 250 },
        { day: 'Thu', revenue: 480 },
        { day: 'Fri', revenue: 900 },
        { day: 'Sat', revenue: 1200 },
        { day: 'Sun', revenue: 850 },
    ];

    const getModel = (assignmentId: string) => {
        return models.find(m => m.id === assignmentId);
    };

    const handleCreateClick = () => {
        if (currentPlan === 'Starter') {
            setShowUpgrade(true);
        } else {
            setIsCreating(true);
        }
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const model = getModel(taskAssignments.drafting);
            const content = await generateCampaignContent(goal, audience, appMode, model);
            setDraft(content);
            setStep(3);
            // Set default preview based on channel
            if (channel === 'SMS' || channel === 'WhatsApp') setActivePreviewMode('mobile');
            else setActivePreviewMode('email');
        } catch (error) {
            console.error("Generation failed", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateVisual = async () => {
        if (!goal) return;
        setIsGeneratingImage(true);
        try {
            const prompt = `marketing image for ${goal} targeting ${audience}`;
            const modelId = models.find(m => m.id === taskAssignments.imageGeneration)?.modelId;
            // Image generation is specifically Gemini for now, but model ID passed
            const base64Image = await generateMarketingImage(prompt, modelId);
            if (base64Image) {
                setDraftImage(base64Image);
            } else {
                alert("Could not generate image. Please try again.");
            }
        } catch (error) {
            console.error("Image generation failed", error);
        } finally {
            setIsGeneratingImage(false);
        }
    };

    const handleRefine = async (type: 'shorten' | 'professional' | 'emojis' | 'rewrite') => {
        if (!draft) return;
        setIsRefining(true);
        const instruction = type === 'shorten' ? "Make it shorter, punchier, and more direct." : 
                            type === 'professional' ? "Make it more professional, elegant, and trustworthy." : 
                            type === 'emojis' ? "Add relevant emojis to make it engaging and fun." :
                            "Rewrite this to be more persuasive and conversion-focused.";
        
        try {
            const model = getModel(taskAssignments.drafting);
            const newBody = await refineMarketingText(draft.body, instruction, model);
            setDraft({ ...draft, body: newBody });
        } catch(e) {
            console.error(e);
        } finally {
            setIsRefining(false);
        }
    };

    const handleLaunch = () => {
        if (!draft) return;
        const newCampaign: Campaign = {
            id: `cmp-${Date.now()}`,
            name: goal,
            status: scheduleDate ? 'Scheduled' : 'Active',
            audience: audience,
            channel: channel,
            sentCount: 0, // Mock
            openRate: 0,
            revenue: 0,
            content: {
                ...draft,
                imageUrl: draftImage || undefined
            },
            scheduledFor: scheduleDate ? new Date(`${scheduleDate}T${scheduleTime || '09:00'}`) : new Date()
        };
        setCampaigns([newCampaign, ...campaigns]);
        setIsCreating(false);
        setStep(1);
        setGoal('');
        setAudience('');
        setDraft(null);
        setDraftImage(null);
        setScheduleDate('');
        setScheduleTime('');
    };

    // Social Media Handlers
    const handleSocialImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onloadend = async () => {
                const base64String = (reader.result as string).split(',')[1];
                setSocialImage(`data:image/jpeg;base64,${base64String}`);
                
                // Auto-generate content
                setIsGeneratingSocial(true);
                try {
                    const model = getModel(taskAssignments.analysis);
                    const result = await generateSocialContent(base64String, socialPlatform, 'Engaging & Professional', model);
                    setSocialCaption(result.caption);
                    setSocialHashtags(result.hashtags);
                } catch (error) {
                    console.error("Social generation failed", error);
                } finally {
                    setIsGeneratingSocial(false);
                }
            };
        }
    };

    // Retention Handlers
    const handleGenerateWinBack = async (customer: LostCustomer) => {
        setSelectedLostCustomer(customer);
        setIsGeneratingWinBack(true);
        setWinBackDraft(null);
        
        try {
            const model = getModel(taskAssignments.drafting);
            const result = await generateWinBackMessage(customer.name, customer.lastPurchase, appMode, model);
            setWinBackDraft(result);
        } catch (error) {
            console.error("Win-back generation failed", error);
        } finally {
            setIsGeneratingWinBack(false);
        }
    };

    // Referral Handlers
    const handleGenerateReferral = async () => {
        if (!referralCandidate) return;
        setIsGeneratingReferral(true);
        try {
            const model = getModel(taskAssignments.drafting);
            const result = await generateReferralMessage(referralCandidate.name, referralReward, model);
            setReferralDraft(result);
        } catch (error) {
            console.error("Referral generation failed", error);
        } finally {
            setIsGeneratingReferral(false);
        }
    };

    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto space-y-8">
            <UpgradeModal 
                isOpen={showUpgrade} 
                onClose={() => setShowUpgrade(false)} 
                onUpgrade={() => { setShowUpgrade(false); onUpgrade(); }} 
                featureName="Marketing Suite"
            />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Marketing & Growth</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Proactively reach out to past customers to drive revenue.</p>
                </div>
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg overflow-x-auto no-scrollbar max-w-full">
                    <Button 
                        variant={activeTab === 'campaigns' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTab('campaigns')}
                        className={`gap-2 whitespace-nowrap ${activeTab === 'campaigns' ? `${theme.bg} ${theme.hover} text-white` : ''}`}
                    >
                        <Megaphone className="w-4 h-4" /> Campaigns
                    </Button>
                    <Button 
                        variant={activeTab === 'social' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTab('social')}
                        className={`gap-2 whitespace-nowrap ${activeTab === 'social' ? `${theme.bg} ${theme.hover} text-white` : ''}`}
                    >
                        <Instagram className="w-4 h-4" /> Social Media
                    </Button>
                    <Button 
                        variant={activeTab === 'retention' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTab('retention')}
                        className={`gap-2 whitespace-nowrap ${activeTab === 'retention' ? `${theme.bg} ${theme.hover} text-white` : ''}`}
                    >
                        <HeartHandshake className="w-4 h-4" /> Retention
                    </Button>
                    <Button 
                        variant={activeTab === 'referrals' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTab('referrals')}
                        className={`gap-2 whitespace-nowrap ${activeTab === 'referrals' ? `${theme.bg} ${theme.hover} text-white` : ''}`}
                    >
                        <Share2 className="w-4 h-4" /> Referrals
                    </Button>
                </div>
            </div>

            {/* TAB: REFERRALS (VIRAL LOOP) */}
            {activeTab === 'referrals' && (
                <div className="animate-slide-up space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className={`bg-gradient-to-br ${theme.gradient} text-white border-0`}>
                            <CardContent className="p-6">
                                <div className="text-sm text-white/80 mb-1 flex items-center gap-2">
                                    <Users className="w-4 h-4" /> Viral Coefficient
                                </div>
                                <div className="text-2xl font-bold">1.4</div>
                                <div className="text-xs text-white/70 mt-1">Every 10 users bring 4 new ones.</div>
                            </CardContent>
                        </Card>
                        {/* Other stats cards ... */}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Top Advocates List */}
                        <Card className="lg:col-span-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                            <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
                                <CardTitle>Advocate Leaderboard</CardTitle>
                                <CardDescription>Customers driving the most revenue through referrals.</CardDescription>
                            </CardHeader>
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {mockAdvocates.map((adv, i) => (
                                    <div key={adv.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-8 h-8 rounded-full ${theme.lightBg} dark:bg-opacity-20 flex items-center justify-center ${theme.text} dark:${theme.text.replace('600','400')} font-bold text-sm`}>
                                                {i + 1}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 dark:text-white text-sm">{adv.name}</div>
                                                <div className="text-xs text-gray-500 flex items-center gap-2">
                                                    <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">{adv.code}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-green-600 dark:text-green-400 text-sm">${adv.revenue}</div>
                                            <div className="text-xs text-gray-500">{adv.referrals} Friends</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Generator */}
                        <Card className={`bg-white dark:bg-gray-900 border-2 ${theme.border} dark:border-opacity-30 shadow-xl sticky top-4 animate-scale-in`}>
                            <CardHeader className={`bg-gradient-to-r ${theme.gradient} text-white rounded-t-lg py-4`}>
                                <CardTitle className="text-base flex items-center gap-2 text-white">
                                    <Link className="w-4 h-4" /> Turn Guest into Advocate
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Select Happy Customer</label>
                                    <select 
                                        className="flex h-9 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-1 text-sm shadow-sm"
                                        onChange={(e) => setReferralCandidate(mockLostCustomers.find(c => c.id === e.target.value) || null)}
                                    >
                                        <option value="">-- Select --</option>
                                        {mockLostCustomers.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Reward Amount</label>
                                    <div className="flex gap-2">
                                        {['$25', '$50', '$100'].map(r => (
                                            <button 
                                                key={r}
                                                onClick={() => setReferralReward(r)}
                                                className={`flex-1 py-1 text-xs rounded border ${referralReward === r ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}
                                            >
                                                {r}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Button 
                                    className={`w-full ${theme.bg} ${theme.hover} text-white`}
                                    disabled={!referralCandidate || isGeneratingReferral}
                                    onClick={handleGenerateReferral}
                                >
                                    {isGeneratingReferral ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                                    Generate Invite
                                </Button>

                                {referralDraft && (
                                    <div className="animate-fade-in pt-2 border-t border-gray-100 dark:border-gray-800">
                                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 mb-3">
                                            <div className="flex justify-between items-center mb-2">
                                                <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0">{referralDraft.code}</Badge>
                                                <button className="text-xs text-gray-400 hover:text-gray-600"><Copy className="w-3 h-3" /></button>
                                            </div>
                                            <p className="text-xs text-gray-600 dark:text-gray-300 italic">"{referralDraft.message}"</p>
                                        </div>
                                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => { alert("Sent!"); setReferralDraft(null); }}>
                                            <Send className="w-4 h-4 mr-2" /> Send to {referralCandidate?.name.split(' ')[0]}
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* TAB: RETENTION (BOUNCE BACK ENGINE) */}
            {activeTab === 'retention' && (
                <div className="animate-slide-up space-y-6">
                    {/* ... (Stats cards remain standard) ... */}
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* List of Dormant Customers */}
                        <Card className="lg:col-span-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                            <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
                                <CardTitle>At-Risk VIPs</CardTitle>
                                <CardDescription>High value customers who haven't visited in 90+ days.</CardDescription>
                            </CardHeader>
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {mockLostCustomers.map(customer => (
                                    <div key={customer.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <img src={customer.avatar} alt={customer.name} className="w-10 h-10 rounded-full object-cover" />
                                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${customer.status === 'At Risk' ? 'bg-yellow-500' : customer.status === 'Dormant' ? 'bg-orange-500' : 'bg-red-500'}`}></div>
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 dark:text-white text-sm">{customer.name}</div>
                                                <div className="text-xs text-gray-500 flex items-center gap-2">
                                                    <span>Last seen: {customer.lastVisit}</span>
                                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                    <span className={`${theme.text} dark:${theme.text.replace('600','400')} font-medium`}>LTV: ${customer.ltv}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button 
                                            size="sm" 
                                            variant="outline"
                                            onClick={() => handleGenerateWinBack(customer)}
                                            className={`${selectedLostCustomer?.id === customer.id ? `${theme.border} ${theme.lightBg} dark:bg-opacity-20` : ''}`}
                                        >
                                            Recover
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Win-Back Action Card */}
                        <div className="relative">
                            {selectedLostCustomer ? (
                                <Card className={`bg-white dark:bg-gray-900 border-2 ${theme.border} dark:border-opacity-50 shadow-xl sticky top-4 animate-scale-in`}>
                                    <CardHeader className={`bg-gradient-to-r ${theme.gradient} text-white rounded-t-lg py-4`}>
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="text-base flex items-center gap-2 text-white">
                                                <Sparkles className="w-4 h-4" /> Bounce Back Engine
                                            </CardTitle>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-white/20" onClick={() => setSelectedLostCustomer(null)}>
                                                <div className="sr-only">Close</div>
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-5 space-y-4">
                                        {isGeneratingWinBack ? (
                                            <div className="py-12 flex flex-col items-center text-center text-gray-500">
                                                <Loader2 className={`w-8 h-8 animate-spin ${theme.text} mb-3`} />
                                                <p className="text-sm">Analyzing purchase history...</p>
                                                <p className="text-xs mt-1">Drafting personalized offer for {selectedLostCustomer.name}</p>
                                            </div>
                                        ) : winBackDraft ? (
                                            <>
                                                <div className={`${theme.lightBg} dark:bg-opacity-20 p-3 rounded-lg text-xs ${theme.text} dark:${theme.text.replace('600','300')} border ${theme.border} dark:border-opacity-30`}>
                                                    <span className="font-bold block mb-1 uppercase tracking-wide text-[10px]">AI Reasoning</span>
                                                    "{winBackDraft.thoughtProcess}"
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-500 uppercase">Draft Message</label>
                                                    <Textarea 
                                                        className="min-h-[150px] text-sm bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800"
                                                        value={winBackDraft.message}
                                                        onChange={(e) => setWinBackDraft({...winBackDraft, message: e.target.value})}
                                                    />
                                                </div>

                                                <div className="pt-2 flex gap-2">
                                                    <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20">
                                                        <Send className="w-4 h-4 mr-2" /> Send Offer
                                                    </Button>
                                                </div>
                                            </>
                                        ) : null}
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                                    <MessageCircle className="w-12 h-12 mb-3 opacity-20" />
                                    <p className="text-sm font-medium">Select a customer to generate a win-back offer.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: SOCIAL MEDIA */}
            {activeTab === 'social' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up">
                    {/* Left: Configuration */}
                    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                        <CardHeader>
                            <CardTitle>Social Post Creator</CardTitle>
                            <CardDescription>Upload a photo and let Vision AI write the caption.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Upload Area */}
                            <div 
                                className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {socialImage ? (
                                    <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                                        <img src={socialImage} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <p className="text-white font-medium flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Change Image</p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className={`w-12 h-12 ${theme.lightBg} dark:bg-opacity-20 rounded-full flex items-center justify-center mb-3 ${theme.text} dark:${theme.text.replace('600','400')}`}>
                                            <UploadCloud className="w-6 h-6" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Click to upload photo</p>
                                        <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG</p>
                                    </>
                                )}
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*" 
                                    onChange={handleSocialImageUpload} 
                                />
                            </div>

                            {/* Platform Selector */}
                            <div className="grid grid-cols-3 gap-2">
                                {['Instagram', 'Facebook', 'LinkedIn'].map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setSocialPlatform(p as any)}
                                        className={`flex items-center justify-center gap-2 p-2 rounded-lg border text-sm font-medium transition-all ${socialPlatform === p ? `${theme.borderStrong} ${theme.lightBg} ${theme.text} dark:${theme.text.replace('600','300')} dark:bg-opacity-20` : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                    >
                                        {p === 'Instagram' && <Instagram className="w-4 h-4" />}
                                        {p === 'Facebook' && <Facebook className="w-4 h-4" />}
                                        {p === 'LinkedIn' && <Linkedin className="w-4 h-4" />}
                                        <span className="hidden sm:inline">{p}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Caption Editor */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-gray-500 uppercase">AI Caption</label>
                                    {isGeneratingSocial && <span className={`text-xs ${theme.text} flex items-center gap-1 animate-pulse`}><Sparkles className="w-3 h-3" /> Generating...</span>}
                                </div>
                                <Textarea 
                                    value={socialCaption}
                                    onChange={(e) => setSocialCaption(e.target.value)}
                                    placeholder="Upload an image to generate caption..."
                                    className="min-h-[120px] text-sm resize-none"
                                    disabled={isGeneratingSocial}
                                />
                            </div>

                            {/* Hashtags */}
                            {socialHashtags.length > 0 && (
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Suggested Tags</label>
                                    <div className="flex flex-wrap gap-2">
                                        {socialHashtags.map((tag, i) => (
                                            <Badge key={i} variant="secondary" className={`bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:${theme.lightBg} dark:hover:bg-opacity-20 cursor-pointer`} onClick={() => setSocialCaption(prev => `${prev} ${tag}`)}>
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Button className={`w-full ${theme.bg} ${theme.hover} text-white`} disabled={!socialImage}>
                                Schedule Post
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Right: Mobile Preview */}
                    <div className="lg:col-span-2 flex items-center justify-center bg-gray-100 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 p-8">
                        <div className="w-[320px] bg-white dark:bg-black rounded-[2.5rem] border-8 border-gray-800 dark:border-gray-700 shadow-2xl overflow-hidden relative">
                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 dark:bg-gray-700 rounded-b-xl z-20"></div>
                            
                            {/* Header */}
                            <div className="pt-10 px-4 pb-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`w-8 h-8 ${theme.bg} rounded-full`}></div>
                                    <span className="font-semibold text-sm text-gray-900 dark:text-white">We Do</span>
                                </div>
                                <div className="text-gray-400 text-xs">...</div>
                            </div>

                            {/* Image */}
                            <div className="aspect-square bg-gray-100 dark:bg-gray-900 w-full relative">
                                {socialImage ? (
                                    <img src={socialImage} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">No Image Selected</div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="px-4 py-3 flex justify-between">
                                <div className="flex gap-4 text-gray-800 dark:text-gray-200">
                                    <div className="w-5 h-5 border-2 border-current rounded-full"></div>
                                    <div className="w-5 h-5 border-2 border-current rounded-full"></div>
                                    <div className="w-5 h-5 border-2 border-current rounded-full"></div>
                                </div>
                                <div className="w-5 h-5 border-2 border-gray-800 dark:border-gray-200 rounded-full"></div>
                            </div>

                            {/* Caption */}
                            <div className="px-4 pb-8 text-xs space-y-1">
                                <div className="font-bold text-gray-900 dark:text-white">1,234 likes</div>
                                <div className="text-gray-800 dark:text-gray-200 leading-relaxed">
                                    <span className="font-bold mr-1">wedo_official</span>
                                    {socialCaption || <span className="text-gray-400 italic">Your caption will appear here...</span>}
                                </div>
                                <div className="text-gray-400 pt-1">View all 12 comments</div>
                                <div className="text-gray-400 text-[10px] uppercase">2 hours ago</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: CAMPAIGNS */}
            {activeTab === 'campaigns' && (
                <>
                    {!isCreating ? (
                        <div className="space-y-8 animate-slide-up">
                            <div className="flex justify-end">
                                <Button onClick={handleCreateClick} className={`${theme.bg} ${theme.hover} text-white`}>
                                    <Plus className="w-4 h-4 mr-2" /> New Campaign
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Analytics */}
                                <Card className="lg:col-span-2 bg-white dark:bg-gray-900">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <TrendingUp className={`w-5 h-5 ${theme.text}`} /> Campaign Revenue
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData}>
                                                <defs>
                                                    <linearGradient id={`colorRev-${theme.name}`} x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor={theme.hex} stopOpacity={0.8}/>
                                                        <stop offset="95%" stopColor={theme.hex} stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="day" />
                                                <YAxis />
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <Tooltip />
                                                <Area type="monotone" dataKey="revenue" stroke={theme.hex} fillOpacity={1} fill={`url(#colorRev-${theme.name})`} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                                {/* Stats Cards */}
                                <div className="space-y-6">
                                    <Card className={`${theme.lightBg} dark:bg-opacity-10 border-${theme.name}-100 dark:border-opacity-30`}>
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue Generated</h3>
                                                <DollarSign className={`w-5 h-5 ${theme.text}`} />
                                            </div>
                                            <div className="text-3xl font-bold text-gray-900 dark:text-white">$4,700</div>
                                            <div className="text-xs text-green-600 flex items-center mt-1">
                                                <TrendingUp className="w-3 h-3 mr-1" /> +12% this month
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Open Rate</h3>
                                                <Mail className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <div className="text-3xl font-bold text-gray-900 dark:text-white">63%</div>
                                            <div className="text-xs text-gray-500 mt-1">Industry avg: 25%</div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Recent Campaigns */}
                                <div className="lg:col-span-3">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Campaigns</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {campaigns.map(cmp => (
                                            <Card key={cmp.id} className="group hover:shadow-md transition-all">
                                                <CardContent className="p-5">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h4 className="font-bold text-gray-900 dark:text-white">{cmp.name}</h4>
                                                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                                                <Badge variant="outline">{cmp.channel}</Badge>
                                                                <span>To: {cmp.audience}</span>
                                                            </div>
                                                        </div>
                                                        <Badge 
                                                            variant={cmp.status === 'Scheduled' ? 'outline' : 'secondary'} 
                                                            className={cmp.status === 'Active' ? `${theme.bg} ${theme.hover} text-white border-0` : ''}
                                                        >
                                                            {cmp.status}
                                                        </Badge>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                                                        <div>
                                                            <div className="text-[10px] text-gray-400 uppercase">Sent</div>
                                                            <div className="font-semibold">{cmp.sentCount}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[10px] text-gray-400 uppercase">Open Rate</div>
                                                            <div className="font-semibold">{(cmp.openRate * 100).toFixed(0)}%</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[10px] text-gray-400 uppercase">Revenue</div>
                                                            <div className="font-semibold text-green-600">${cmp.revenue}</div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-6xl mx-auto animate-slide-up">
                            <div className="mb-8">
                                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                                    <span>Step {step} of 3</span>
                                    <button onClick={() => setIsCreating(false)} className="text-red-500 hover:underline">Cancel</button>
                                </div>
                                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div className={`h-full ${theme.bg} transition-all duration-500`} style={{ width: `${(step / 3) * 100}%` }}></div>
                                </div>
                            </div>

                            <Card className="border-0 shadow-xl bg-white dark:bg-gray-900">
                                <CardContent className="p-8">
                                    {step === 1 && (
                                        <div className="space-y-6 animate-fade-in">
                                            <div className="text-center mb-8">
                                                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">What is your goal?</h2>
                                                <p className="text-gray-500">Select a template or type a custom goal.</p>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {['Fill Vacancy / Slow Night', 'Promote New Offering', 'Holiday Greeting'].map((g) => (
                                                    <button 
                                                        key={g}
                                                        onClick={() => setGoal(g)}
                                                        className={`p-6 rounded-xl border-2 text-left transition-all ${goal === g ? `${theme.borderStrong} ${theme.lightBg} dark:bg-opacity-20` : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'}`}
                                                    >
                                                        <Zap className={`w-6 h-6 mb-3 ${goal === g ? theme.text : 'text-gray-400'}`} />
                                                        <div className="font-semibold text-gray-900 dark:text-white">{g}</div>
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="relative">
                                                <span className="absolute left-3 top-3 text-gray-400 text-sm">Custom:</span>
                                                <Input 
                                                    className="pl-16" 
                                                    placeholder="e.g. Invite locals to wine tasting..." 
                                                    value={goal}
                                                    onChange={(e) => setGoal(e.target.value)}
                                                />
                                            </div>
                                            <div className="flex justify-end">
                                                <Button onClick={() => setStep(2)} disabled={!goal} className={`${theme.bg} ${theme.hover} text-white`}>Next Step <ArrowRight className="w-4 h-4 ml-2" /></Button>
                                            </div>
                                        </div>
                                    )}

                                    {step === 2 && (
                                        <div className="space-y-6 animate-fade-in">
                                            <div className="text-center mb-8">
                                                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Target & Channel</h2>
                                                <p className="text-gray-500">Who are we sending this to?</p>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Audience Segment</label>
                                                    <div className="grid grid-cols-1 gap-3">
                                                        {['Past Guests (Last 90 Days)', 'VIP Clients (High Spend)', 'Local Customers', 'All Contacts'].map((aud) => (
                                                            <button 
                                                                key={aud}
                                                                onClick={() => setAudience(aud)}
                                                                className={`p-3 rounded-lg border text-left transition-all flex items-center justify-between ${audience === aud ? `${theme.borderStrong} ${theme.lightBg} dark:bg-opacity-20` : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'}`}
                                                            >
                                                                <span className="text-sm font-medium text-gray-900 dark:text-white">{aud}</span>
                                                                {audience === aud && <CheckCircle2 className={`w-4 h-4 ${theme.text}`} />}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Channel</label>
                                                    <div className="grid grid-cols-1 gap-3">
                                                        {['Email', 'SMS', 'WhatsApp'].map((ch) => (
                                                            <button 
                                                                key={ch}
                                                                onClick={() => setChannel(ch as any)}
                                                                className={`p-3 rounded-lg border text-left transition-all flex items-center justify-between ${channel === ch ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'}`}
                                                            >
                                                                <span className="text-sm font-medium text-gray-900 dark:text-white">{ch}</span>
                                                                {channel === ch && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-4">
                                                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                                                <Button onClick={handleGenerate} disabled={!audience || isGenerating} className={`${theme.bg} ${theme.hover} text-white`}>
                                                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                                                    Generate with AI
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {step === 3 && draft && (
                                        <div className="space-y-6 animate-fade-in h-full flex flex-col">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                                                {/* Editor Column */}
                                                <div className="space-y-4 flex flex-col h-full">
                                                    <div className="flex justify-between items-center">
                                                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                                            <Wand2 className={`w-4 h-4 ${theme.text}`} /> Campaign Editor
                                                        </h3>
                                                    </div>
                                                    
                                                    {/* AI Toolbar */}
                                                    <div className="flex flex-wrap gap-2 items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                                                        <Button variant="ghost" size="sm" className={`text-xs h-7 gap-1 ${theme.text} hover:${theme.lightBg} dark:hover:bg-opacity-20`} onClick={handleGenerateVisual} disabled={isGeneratingImage}>
                                                            {isGeneratingImage ? <Loader2 className="w-3 h-3 animate-spin" /> : <ImageIcon className="w-3 h-3" />}
                                                            Generate Visual
                                                        </Button>
                                                        <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                                                        <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => handleRefine('shorten')} disabled={isRefining}>Shorten</Button>
                                                        <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => handleRefine('professional')} disabled={isRefining}>Formal</Button>
                                                        <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => handleRefine('emojis')} disabled={isRefining}>Emojis</Button>
                                                        <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => handleRefine('rewrite')} disabled={isRefining}>Rewrite</Button>
                                                    </div>

                                                    <div className="space-y-3 flex-1">
                                                        <div>
                                                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Subject Line</label>
                                                            <Input value={draft.subject} onChange={(e) => setDraft({...draft, subject: e.target.value})} />
                                                        </div>
                                                        <div className="flex-1 flex flex-col">
                                                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Message Body</label>
                                                            <Textarea 
                                                                value={draft.body} 
                                                                onChange={(e) => setDraft({...draft, body: e.target.value})} 
                                                                className={`flex-1 min-h-[300px] resize-none font-sans text-sm leading-relaxed ${isRefining ? 'opacity-50 pointer-events-none' : ''}`}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Preview Column */}
                                                <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center relative overflow-hidden min-h-[500px]">
                                                    {/* Preview Toggles */}
                                                    <div className="absolute top-4 right-4 bg-white dark:bg-gray-900 p-1 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex z-10">
                                                        <button 
                                                            onClick={() => setActivePreviewMode('email')}
                                                            className={`p-1.5 rounded ${activePreviewMode === 'email' ? `${theme.lightBg} ${theme.text} dark:bg-opacity-20` : 'text-gray-400 hover:text-gray-600'}`}
                                                        >
                                                            <Monitor className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => setActivePreviewMode('mobile')}
                                                            className={`p-1.5 rounded ${activePreviewMode === 'mobile' ? `${theme.lightBg} ${theme.text} dark:bg-opacity-20` : 'text-gray-400 hover:text-gray-600'}`}
                                                        >
                                                            <Smartphone className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    <div className={`transition-all duration-500 w-full flex justify-center items-center ${activePreviewMode === 'mobile' ? 'max-w-[320px]' : 'max-w-full'}`}>
                                                        {activePreviewMode === 'mobile' ? (
                                                            <div className="w-full bg-white dark:bg-black rounded-[2.5rem] border-8 border-gray-800 dark:border-gray-700 shadow-2xl overflow-hidden h-[500px] relative flex flex-col">
                                                                <div className="absolute top-0 left-0 w-full h-6 bg-gray-100 dark:bg-gray-800 z-20 flex justify-center">
                                                                    <div className="w-20 h-4 bg-gray-800 dark:bg-black rounded-b-xl"></div>
                                                                </div>
                                                                <div className="pt-10 px-4 pb-4 h-full overflow-y-auto bg-white dark:bg-black flex flex-col">
                                                                    <div className="flex-1 flex flex-col justify-end pb-4 gap-2">
                                                                        {draftImage && (
                                                                            <div className="rounded-2xl rounded-bl-none overflow-hidden max-w-[80%] self-start shadow-sm border border-gray-100 dark:border-gray-800">
                                                                                <img src={draftImage} className="w-full h-auto" alt="MMS" />
                                                                            </div>
                                                                        )}
                                                                        <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl rounded-tl-none p-3 text-sm text-gray-800 dark:text-gray-200 shadow-sm inline-block self-start max-w-[85%]">
                                                                            {draft.body}
                                                                        </div>
                                                                        <div className="text-[10px] text-gray-400 ml-1">Delivered</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="w-full bg-white dark:bg-black rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden h-[500px] flex flex-col">
                                                                <div className="bg-gray-50 dark:bg-gray-900 p-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                                                                    <div className="flex gap-1.5">
                                                                        <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                                                                        <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                                                                    </div>
                                                                    <div className="flex-1 bg-white dark:bg-gray-800 rounded px-2 py-1 text-xs text-center text-gray-500 shadow-sm truncate">
                                                                        Subject: {draft.subject}
                                                                    </div>
                                                                </div>
                                                                <div className="p-4 border-b border-gray-100 dark:border-gray-800 text-xs text-gray-500">
                                                                    <span className="font-bold text-gray-900 dark:text-white">From:</span> We Do Marketing &lt;hello@wedo.com&gt;
                                                                </div>
                                                                <div className="flex-1 overflow-y-auto bg-white dark:bg-black">
                                                                    {draftImage && (
                                                                        <div className="w-full h-48 bg-gray-100 dark:bg-gray-900 overflow-hidden">
                                                                            <img src={draftImage} className="w-full h-full object-cover" alt="Header" />
                                                                        </div>
                                                                    )}
                                                                    <div className="p-8 text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-serif max-w-2xl mx-auto">
                                                                        {draft.body}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700 gap-4">
                                                <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                                                
                                                <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                                                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                                                        <Clock className="w-4 h-4 text-gray-400 ml-2" />
                                                        <input 
                                                            type="date" 
                                                            className="bg-transparent border-none text-xs text-gray-600 dark:text-gray-300 focus:ring-0 p-0"
                                                            value={scheduleDate}
                                                            onChange={(e) => setScheduleDate(e.target.value)}
                                                        />
                                                        <input 
                                                            type="time" 
                                                            className="bg-transparent border-none text-xs text-gray-600 dark:text-gray-300 focus:ring-0 p-0"
                                                            value={scheduleTime}
                                                            onChange={(e) => setScheduleTime(e.target.value)}
                                                        />
                                                    </div>
                                                    <Button onClick={handleLaunch} className={`${scheduleDate ? theme.bg : 'bg-green-600'} ${scheduleDate ? theme.hover : 'hover:bg-green-700'} text-white shadow-lg`}>
                                                        {scheduleDate ? <Calendar className="w-4 h-4 mr-2" /> : <Send className="w-4 h-4 mr-2" />} 
                                                        {scheduleDate ? 'Schedule Campaign' : 'Send Now'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Marketing;

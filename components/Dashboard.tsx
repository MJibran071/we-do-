
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { analyticsData } from '../data';
import { Activity, MessageCircle, Zap, Clock, Sun, ListChecks, Loader2, AlertTriangle, CheckCircle2, Info, TrendingUp, DollarSign, Calendar, Send, Lock, Sparkles, UtensilsCrossed, ShoppingBag, PlayCircle, PauseCircle, Volume2, Search, BrainCircuit, Bell, Star, ArrowUpRight, Package, Bot, PenTool, RefreshCw, Globe, GripHorizontal, BedDouble, Users, Percent, TrendingDown, CheckCircle, Wrench, PartyPopper, Heart, Briefcase, Car, Ticket, ChevronUp, ChevronDown, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Platform, MorningBriefingItem, Thread, Booking, MessageStatus, PlanTier, AppMode, AIModel, VoiceCommand, Apartment, Restaurant } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { generateMorningBriefing, generateGapNightPromo, generateLeadRecoveryMessage } from '../services/geminiService';
import { UpgradeModal } from './ui/UpgradeModal';
import { socket } from '../services/socketService';
import { Input } from './ui/input';
import { getTheme } from '../utils/theme';
import { logger } from '../utils/logger';

interface DashboardProps {
    threads: Thread[];
    bookings: Booking[];
    currentPlan: PlanTier;
    onUpgrade: () => void;
    appMode: AppMode;
    models: AIModel[];
    onVoiceCommand: (command: VoiceCommand) => void;
    apartments: Apartment[];
    restaurants: Restaurant[];
}

const Dashboard: React.FC<DashboardProps> = ({ threads, bookings, currentPlan, onUpgrade, appMode, models, onVoiceCommand, apartments, restaurants }) => {
  const theme = getTheme(appMode);

  // Weekly Heatmap Component
  const HEATMAP_DATA = [
    { day: 'Mon', morning: 20, afternoon: 45, evening: 30 },
    { day: 'Tue', morning: 15, afternoon: 55, evening: 60 },
    { day: 'Wed', morning: 25, afternoon: 50, evening: 75 },
    { day: 'Thu', morning: 30, afternoon: 60, evening: 85 },
    { day: 'Fri', morning: 40, afternoon: 80, evening: 100 },
    { day: 'Sat', morning: 65, afternoon: 95, evening: 90 },
    { day: 'Sun', morning: 55, afternoon: 70, evening: 50 },
  ];

  const WeeklyHeatmap = () => {
    const getColor = (val: number) => {
        if (val > 80) return `${theme.bg}`;
        if (val > 50) return `${theme.bg} opacity-70`;
        if (val > 20) return `${theme.lightBg} dark:${theme.darkBgSubtle}`;
        return 'bg-gray-100 dark:bg-gray-800/50';
    };

    const timeLabels = appMode === 'restaurant' 
        ? ['Lunch', 'Afternoon', 'Dinner'] 
        : ['Morning', 'Day', 'Night'];

    return (
        <div className="grid grid-cols-8 gap-1 text-xs">
            <div className="col-span-1 text-gray-400 font-medium flex flex-col justify-end pb-1 gap-3">
                <div className="h-6 flex items-center">{timeLabels[0]}</div>
                <div className="h-6 flex items-center">{timeLabels[1]}</div>
                <div className="h-6 flex items-center">{timeLabels[2]}</div>
            </div>
            {HEATMAP_DATA.map((d) => (
                <div key={d.day} className="col-span-1 flex flex-col gap-1">
                    <div className={`h-6 rounded ${getColor(d.morning)} transition-all hover:opacity-80`} title={`${timeLabels[0]}: ${d.morning}%`}></div>
                    <div className={`h-6 rounded ${getColor(d.afternoon)} transition-all hover:opacity-80`} title={`${timeLabels[1]}: ${d.afternoon}%`}></div>
                    <div className={`h-6 rounded ${getColor(d.evening)} transition-all hover:opacity-80`} title={`${timeLabels[2]}: ${d.evening}%`}></div>
                    <div className="text-center text-gray-500 font-medium mt-1">{d.day}</div>
                </div>
            ))}
        </div>
    );
  };

  const StatsCard: React.FC<{ title: string; value: string; change: string; icon: React.ReactNode; color: string; delay: number }> = ({ title, value, change, icon, color, delay }) => (
    <div className="animate-slide-up opacity-0" style={{ animationDelay: `${delay}ms` }}>
        <Card className="hover:shadow-lg transition-all duration-300 cursor-default border-none bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg group">
            <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full group-hover:scale-110 transition-transform duration-300 ${color.replace('bg-', 'bg-opacity-10 text-')} ${color.replace('bg-', 'bg-').replace('500', '100')} dark:bg-opacity-20`}>
                    {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: `w-6 h-6` })}
                </div>
                <span className={`text-sm font-medium ${change.startsWith('+') || change === 'On Time' || change === 'Busy' || change === 'Optimal' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {change}
                </span>
            </div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wide">{title}</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
            </CardContent>
        </Card>
    </div>
  );

  // Real-time platform stats from props
  const platformCounts = threads.reduce((acc, thread) => {
    acc[thread.platform] = (acc[thread.platform] || 0) + 1;
    return acc;
  }, {} as Record<Platform, number>);

  const platformData = [
    { name: 'Airbnb', value: platformCounts[Platform.Airbnb] || 0, color: '#FF385C' },
    { name: 'WhatsApp', value: platformCounts[Platform.WhatsApp] || 0, color: '#25D366' },
    { name: 'Lodgify', value: platformCounts[Platform.Lodgify] || 0, color: '#2563EB' },
    { name: 'Email', value: platformCounts[Platform.Email] || 0, color: '#6B7280' },
  ].filter(d => d.value > 0);

  const [briefingItems, setBriefingItems] = useState<MorningBriefingItem[]>([]);
  const [isBriefingLoading, setIsBriefingLoading] = useState(false);
  const [hasBriefing, setHasBriefing] = useState(false);
  
  // Audio Briefing State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioBriefingSrc, setAudioBriefingSrc] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Revenue Intelligence State
  const [revActionLoading, setRevActionLoading] = useState<string | null>(null);
  const [promoDraft, setPromoDraft] = useState<string | null>(null);
  const [leadRecoveryDraft, setLeadRecoveryDraft] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<'gap' | 'lead' | null>(null);

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Listen for backend scheduled briefings
  useEffect(() => {
      if (socket.connected) {
          socket.on('morning_briefing_update', (data: { text: string, audio: string }) => {
              if (data.audio) {
                  setAudioBriefingSrc(`data:audio/mp3;base64,${data.audio}`);
              }
          });
      }
      return () => { socket.off('morning_briefing_update'); };
  }, []);

  const handleGenerateBriefing = async () => {
      setIsBriefingLoading(true);
      try {
          const model = models.find(m => m.modelId.includes('pro')) || models[0];
          const items = await generateMorningBriefing(threads, model);
          const briefingWithIds: MorningBriefingItem[] = items.map((item, i) => ({
              ...item,
              id: `briefing-${Date.now()}-${i}`
          }));
          setBriefingItems(briefingWithIds);
          setHasBriefing(true);
      } catch (error) {
          logger.error("Failed to generate briefing", error);
      } finally {
          setIsBriefingLoading(false);
      }
  };

  const toggleAudio = () => {
      if (!audioRef.current) return;
      if (isPlayingAudio) {
          audioRef.current.pause();
      } else {
          audioRef.current.play();
      }
      setIsPlayingAudio(!isPlayingAudio);
  };

  // --- Dynamic Metrics Calculation ---
  const getIndustryMetrics = () => {
    const totalRev = bookings.reduce((acc, b) => acc + b.totalPrice, 0);
    
    if (appMode === 'restaurant') {
        const covers = bookings.reduce((acc, b) => acc + b.guests, 0);
        const avgCheck = bookings.length ? (totalRev / bookings.length).toFixed(0) : '0';
        return [
            { title: "Today's Covers", value: covers.toString(), change: "+12%", icon: <Users />, color: "bg-orange-500" },
            { title: "Avg Check Size", value: `$${avgCheck}`, change: "+5%", icon: <DollarSign />, color: "bg-green-500" },
            { title: "Active Tables", value: "8/12", change: "Busy", icon: <UtensilsCrossed />, color: "bg-blue-500" },
            { title: "Wait Time", value: "15m", change: "-2m", icon: <Clock />, color: "bg-red-500" },
        ];
    }
    
    if (appMode === 'ecommerce') {
        const orders = bookings.length;
        const aov = orders ? (totalRev / orders).toFixed(2) : '0';
        return [
            { title: "Total Orders", value: orders.toString(), change: "+8%", icon: <ShoppingBag />, color: "bg-purple-500" },
            { title: "Avg Order Value", value: `$${aov}`, change: "+15%", icon: <TrendingUp />, color: "bg-green-500" },
            { title: "Conversion Rate", value: "3.2%", change: "+0.4%", icon: <Percent />, color: "bg-blue-500" },
            { title: "Return Rate", value: "4.5%", change: "-1.2%", icon: <TrendingDown />, color: "bg-yellow-500" },
        ];
    }

    if (appMode === 'automotive') {
        return [
            { title: "Vehicles in Shop", value: "8", change: "Busy", icon: <Car />, color: "bg-slate-500" },
            { title: "Turnaround Time", value: "4h", change: "-30m", icon: <Clock />, color: "bg-green-500" },
            { title: "Parts Revenue", value: "$4,200", change: "+15%", icon: <DollarSign />, color: "bg-blue-500" },
            { title: "Approval Rate", value: "85%", change: "+5%", icon: <CheckCircle />, color: "bg-yellow-500" },
        ];
    }

    if (appMode === 'service') {
        return [
            { title: "Appointments", value: "12", change: "+2", icon: <Calendar />, color: "bg-cyan-500" },
            { title: "Rebook Rate", value: "65%", change: "+5%", icon: <RefreshCw />, color: "bg-green-500" },
            { title: "Utilization", value: "82%", change: "Optimal", icon: <Activity />, color: "bg-blue-500" },
            { title: "No-Shows", value: "1", change: "-2", icon: <AlertTriangle />, color: "bg-red-500" },
        ];
    }

    if (appMode === 'event') {
        return [
            { title: "Active Events", value: "3", change: "On Track", icon: <PartyPopper />, color: "bg-rose-500" },
            { title: "Ticket Sales", value: "450", change: "+50", icon: <Ticket />, color: "bg-green-500" },
            { title: "New Leads", value: "15", change: "+4", icon: <TrendingUp />, color: "bg-blue-500" },
            { title: "Vendor Tasks", value: "24", change: "Pending", icon: <ListChecks />, color: "bg-yellow-500" },
        ];
    }

    if (appMode === 'custom') {
        return [
            { title: "Active Clients", value: "18", change: "+2", icon: <Briefcase />, color: "bg-teal-500" },
            { title: "Open Tasks", value: "14", change: "Busy", icon: <ListChecks />, color: "bg-amber-500" },
            { title: "Invoices Due", value: "$4,500", change: "-10%", icon: <DollarSign />, color: "bg-green-500" },
            { title: "Response Time", value: "5m", change: "Fast", icon: <Clock />, color: "bg-blue-500" },
        ];
    }

    // Property (Default)
    const occupancy = "78%";
    return [
        { title: "Arrivals Today", value: "4", change: "On Time", icon: <CheckCircle />, color: "bg-green-500" },
        { title: "Occupancy Rate", value: occupancy, change: "+5% YoY", icon: <BedDouble />, color: "bg-indigo-500" },
        { title: "RevPAR", value: "$145", change: "+$12", icon: <DollarSign />, color: "bg-blue-500" },
        { title: "Avg Rating", value: "4.8", change: "Top 5%", icon: <Star />, color: "bg-yellow-500" },
    ];
  };

  const currentMetrics = getIndustryMetrics();

  const handleFillGap = async () => {
      if (currentPlan === 'Starter') {
        setShowUpgradeModal(true);
        return;
      }
      setRevActionLoading('gap');
      setActiveAction('gap');
      try {
          let target = "next week";
          let offer = "20%";
          
          if (appMode === 'restaurant') {
              target = "Tuesday Dinner Service";
              offer = "Free Dessert";
          } else if (appMode === 'ecommerce') {
              target = "Winter Collection";
              offer = "Free Shipping";
          } else {
              const d = new Date();
              d.setDate(d.getDate() + 7);
              target = `${d.toLocaleDateString()} - ${new Date(d.getTime() + 86400000 * 2).toLocaleDateString()}`;
          }
          
          const draft = await generateGapNightPromo(target, offer, appMode, models[0]);
          setPromoDraft(draft);
      } catch (error) {
          logger.error("Failed to generate promo", error);
      } finally {
          setRevActionLoading(null);
      }
  };

  const handleRecoverLead = async () => {
      if (currentPlan === 'Starter') {
        setShowUpgradeModal(true);
        return;
      }
      setRevActionLoading('lead');
      setActiveAction('lead');
      try {
          const staleThread = threads.find(t => t.status === MessageStatus.Pending || t.status === MessageStatus.Unread);
          const name = staleThread ? staleThread.participants[0].name : "Sarah Jenkins";
          let details = "next weekend"; 

          if (appMode === 'restaurant') details = "dinner for 6 this Friday";
          if (appMode === 'ecommerce') details = "items in cart";
          
          const draft = await generateLeadRecoveryMessage(name, details, appMode, models[0]);
          setLeadRecoveryDraft(draft);
      } catch (error) {
          logger.error("Failed to generate recovery msg", error);
      } finally {
          setRevActionLoading(null);
      }
  };

  const handleSendAction = () => {
      setPromoDraft(null);
      setLeadRecoveryDraft(null);
      setActiveAction(null);
      alert("Message queued for sending!");
  };

  const getPriorityIcon = (priority: string) => {
      switch(priority) {
          case 'Urgent': return <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse-subtle" />;
          case 'Action': return <ListChecks className="w-4 h-4 text-yellow-500" />;
          default: return <Info className="w-4 h-4 text-blue-500" />;
      }
  };

  const isLocked = currentPlan === 'Starter';

  // Dynamic titles and descriptions for Revenue Intelligence Agents
  let gapAgentTitle = "Gap Night Filler";
  let gapAgentDesc = "Detected a 2-night gap next week.";
  let gapAgentIcon = <Calendar className={`w-4 h-4 ${theme.text}`} />;
  
  let leadAgentTitle = "Abandoned Inquiry";
  let leadAgentDesc = "Guest ghosted after asking about availability.";

  if (appMode === 'restaurant') {
      gapAgentTitle = "Slow Shift Boost";
      gapAgentDesc = "Tuesday Dinner is only 30% booked.";
      gapAgentIcon = <UtensilsCrossed className={`w-4 h-4 ${theme.text}`} />;
      leadAgentTitle = "Unconfirmed Res";
      leadAgentDesc = "Guest inquired for large party but didn't confirm.";
  } else if (appMode === 'ecommerce') {
      gapAgentTitle = "Inventory Clearance";
      gapAgentDesc = "Overstock detected in Accessories.";
      gapAgentIcon = <Package className={`w-4 h-4 ${theme.text}`} />;
      leadAgentTitle = "Cart Recovery";
      leadAgentDesc = "Customer left items in cart 24h ago.";
  } else if (appMode === 'automotive') {
      gapAgentTitle = "Idle Bay Filler";
      gapAgentDesc = "Bay 3 is empty tomorrow afternoon.";
      gapAgentIcon = <Wrench className={`w-4 h-4 ${theme.text}`} />;
      leadAgentTitle = "Quote Follow-up";
      leadAgentDesc = "Customer viewed quote but didn't book.";
  } else if (appMode === 'service') {
      gapAgentTitle = "Slot Filler";
      gapAgentDesc = "3 massage slots open this Friday.";
      leadAgentTitle = "Rebooking Agent";
      leadAgentDesc = "Client hasn't visited in 6 weeks.";
  }

  // Occupancy Data
  const occupancyValue = appMode === 'restaurant' ? 68 : appMode === 'ecommerce' ? 92 : 75;
  const occupancyLabel = appMode === 'restaurant' ? 'Tables Booked' : appMode === 'ecommerce' ? 'Stock Health' : appMode === 'automotive' ? 'Bay Utilization' : 'Occupancy Rate';
  const occupancyData = [
      { name: 'Used', value: occupancyValue, color: theme.hex },
      { name: 'Free', value: 100 - occupancyValue, color: '#e5e7eb' }
  ];

  // Mock AI Logs
  const aiLogs = [
      { id: 1, action: "Auto-drafted reply to 'Late Check-out' inquiry", time: "2m ago", icon: PenTool, color: "text-purple-500" },
      { id: 2, action: "Synced calendar with Airbnb (3 updates)", time: "15m ago", icon: RefreshCw, color: "text-blue-500" },
      { id: 3, action: "Analyzed sentiment for new review (Positive)", time: "1h ago", icon: BrainCircuit, color: "text-green-500" },
      { id: 4, action: "Detected pricing opportunity for next weekend", time: "3h ago", icon: TrendingUp, color: "text-emerald-500" },
      { id: 5, action: "Flagged maintenance keyword 'leaking'", time: "5h ago", icon: AlertTriangle, color: "text-red-500" },
  ];

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto space-y-8">
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
        onUpgrade={() => {
            setShowUpgradeModal(false);
            onUpgrade();
        }}
        featureName="Revenue Intelligence"
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Performance Overview</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Live tracking of {threads.length} conversations and {bookings.length} active events.</p>
        </div>
        <div className="flex gap-2">
            {audioBriefingSrc && <audio ref={audioRef} src={audioBriefingSrc} onEnded={() => setIsPlayingAudio(false)} />}
            
            {hasBriefing && (
                <Button 
                    onClick={toggleAudio} 
                    className={`transition-all ${isPlayingAudio ? theme.bg : `bg-white ${theme.text} dark:${theme.darkText} ${theme.border} dark:${theme.darkBorder} hover:${theme.lightBg} dark:hover:${theme.darkBgSubtle}`} shadow-sm`}
                >
                    {isPlayingAudio ? (
                        <><PauseCircle className="w-4 h-4 mr-2 animate-pulse" /> Playing...</>
                    ) : (
                        <><PlayCircle className="w-4 h-4 mr-2" /> Listen</>
                    )}
                </Button>
            )}

            <Button 
                onClick={handleGenerateBriefing} 
                disabled={isBriefingLoading}
                className={`bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0 shadow-lg hover:shadow-orange-500/20 transition-all duration-300`}
            >
                {isBriefingLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sun className="w-4 h-4 mr-2" />}
                {hasBriefing ? 'Refresh Briefing' : 'Morning Briefing'}
            </Button>
        </div>
      </div>

      {(hasBriefing || isBriefingLoading) && (
          <div className="animate-slide-up">
            <Card className="bg-gradient-to-br from-orange-50/90 to-white/90 dark:from-orange-950/30 dark:to-gray-900/80 border-orange-100 dark:border-orange-900/50 backdrop-blur">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-orange-900 dark:text-orange-100">
                                <Sun className="w-5 h-5 text-orange-500" /> Morning Briefing
                            </CardTitle>
                            <CardDescription>
                                AI-generated prioritized to-do list based on live data.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isBriefingLoading ? (
                        <div className="py-8 flex flex-col items-center justify-center text-gray-400">
                            <Loader2 className="w-8 h-8 animate-spin mb-2 text-orange-500" />
                            <p>Analyzing {threads.length} conversations...</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {briefingItems.map((item, index) => (
                                <div 
                                    key={item.id} 
                                    className="flex items-start gap-3 p-3 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm animate-slide-up opacity-0 backdrop-blur-sm"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="mt-0.5">{getPriorityIcon(item.priority)}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-sm text-gray-900 dark:text-white">{item.title}</span>
                                            <Badge variant="outline" className="text-[10px] h-5">{item.category}</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-xs">View</Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentMetrics.map((metric, i) => (
            <StatsCard 
                key={i}
                title={metric.title} 
                value={metric.value} 
                change={metric.change} 
                icon={metric.icon} 
                color={metric.color} 
                delay={i * 100}
            />
        ))}
      </div>

      {/* Revenue Intelligence Section */}
      <div className="animate-slide-up relative">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className={`w-5 h-5 ${theme.text} dark:${theme.darkText}`} /> Revenue Intelligence
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gap Night Agent */}
              <Card className={`${theme.lightBg}/50 dark:${theme.darkBgSubtle} border-${theme.name}-100 dark:${theme.darkBorder} relative overflow-hidden ${isLocked ? 'opacity-80' : ''}`}>
                  {isLocked && (
                    <div className="absolute inset-0 z-20 bg-white/50 dark:bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
                        <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg mb-3">
                            <Lock className={`w-5 h-5 ${theme.text} dark:${theme.darkText}`} />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{gapAgentTitle}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 max-w-[200px]">Detect revenue gaps and send targeted offers.</p>
                        <Button size="sm" onClick={() => setShowUpgradeModal(true)} className={`bg-gradient-to-r ${theme.gradient} text-white border-0`}>
                            Upgrade to Unlock <Sparkles className="w-3 h-3 ml-2" />
                        </Button>
                    </div>
                  )}
                  
                  <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-base">
                          {gapAgentIcon}
                          {gapAgentTitle}
                      </CardTitle>
                      <CardDescription>{gapAgentDesc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <div className="flex items-center justify-between mb-4">
                          <div className="text-sm">
                              <span className="block text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Opportunity</span>
                              <span className="font-bold text-gray-900 dark:text-white blur-sm select-none">$350 Potential Revenue</span>
                          </div>
                          <Badge className={`${theme.badge} border-0`}>High Prob.</Badge>
                      </div>
                      
                      {activeAction === 'gap' && promoDraft ? (
                          <div className="mb-4 bg-white dark:bg-gray-900 p-3 rounded-md border border-gray-200 dark:border-gray-700 text-sm italic">
                              "{promoDraft}"
                          </div>
                      ) : null}

                      <div className="flex gap-2">
                          {activeAction === 'gap' && promoDraft ? (
                               <Button onClick={handleSendAction} className={`w-full ${theme.bg} hover:${theme.hover.replace('hover:', '')} text-white`}>
                                   <Send className="w-4 h-4 mr-2" /> Send Blast
                               </Button>
                          ) : (
                               <Button 
                                  variant="outline"
                                  onClick={handleFillGap} 
                                  disabled={revActionLoading === 'gap'}
                                  className={`w-full bg-white ${theme.text} dark:${theme.darkText} ${theme.border} dark:${theme.darkBorder} hover:${theme.lightBg} dark:hover:${theme.darkBgSubtle} dark:bg-gray-800`}
                               >
                                   {revActionLoading === 'gap' ? <Loader2 className="w-4 h-4 animate-spin" /> : "Draft Promo"}
                               </Button>
                          )}
                      </div>
                  </CardContent>
              </Card>

              {/* Lead Recovery Agent */}
              <Card className={`${theme.lightBg}/50 dark:${theme.darkBgSubtle} border-${theme.name}-100 dark:${theme.darkBorder} relative overflow-hidden ${isLocked ? 'opacity-80' : ''}`}>
                  {isLocked && (
                    <div className="absolute inset-0 z-20 bg-white/50 dark:bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
                        <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg mb-3">
                            <Lock className={`w-5 h-5 ${theme.text} dark:${theme.darkText}`} />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{leadAgentTitle}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 max-w-[200px]">Re-engage potential customers.</p>
                        <Button size="sm" onClick={() => setShowUpgradeModal(true)} className={`bg-gradient-to-r ${theme.gradient} text-white border-0`}>
                            Upgrade to Unlock <Sparkles className="w-3 h-3 ml-2" />
                        </Button>
                    </div>
                  )}

                  <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-base">
                          <DollarSign className={`w-4 h-4 ${theme.text} dark:${theme.darkText}`} /> 
                          {leadAgentTitle}
                      </CardTitle>
                      <CardDescription>{leadAgentDesc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                       <div className="flex items-center justify-between mb-4">
                          <div className="text-sm">
                              <span className="block text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Target</span>
                              <span className="font-bold text-gray-900 dark:text-white blur-sm select-none">Sarah Jenkins (2d ago)</span>
                          </div>
                          <Badge className={`${theme.badge} border-0`}>Warm Lead</Badge>
                      </div>

                      {activeAction === 'lead' && leadRecoveryDraft ? (
                          <div className="mb-4 bg-white dark:bg-gray-900 p-3 rounded-md border border-gray-200 dark:border-gray-700 text-sm italic">
                              "{leadRecoveryDraft}"
                          </div>
                      ) : null}

                      <div className="flex gap-2">
                          {activeAction === 'lead' && leadRecoveryDraft ? (
                               <Button onClick={handleSendAction} className={`w-full ${theme.bg} hover:${theme.hover.replace('hover:', '')} text-white`}>
                                   <Send className="w-4 h-4 mr-2" /> Send Follow-up
                               </Button>
                          ) : (
                               <Button 
                                  variant="outline"
                                  onClick={handleRecoverLead} 
                                  disabled={revActionLoading === 'lead'}
                                  className={`w-full bg-white ${theme.text} dark:${theme.darkText} ${theme.border} dark:${theme.darkBorder} hover:${theme.lightBg} dark:hover:${theme.darkBgSubtle} dark:bg-gray-800`}
                               >
                                   {revActionLoading === 'lead' ? <Loader2 className="w-4 h-4 animate-spin" /> : "Recover Lead"}
                               </Button>
                          )}
                      </div>
                  </CardContent>
              </Card>
          </div>
      </div>

      {/* New Section: AI Logs & Channel Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
          {/* AI Agent Log */}
          <Card className="lg:col-span-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border-none">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                      <Bot className={`w-5 h-5 ${theme.text} dark:${theme.darkText}`} /> AI Agent Log
                  </CardTitle>
                  <CardDescription>Real-time background tasks performed by your assistant.</CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="space-y-4">
                      {aiLogs.map((log) => (
                          <div key={log.id} className="flex items-center justify-between group p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                              <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800 ${log.color}`}>
                                      <log.icon className="w-4 h-4" />
                                  </div>
                                  <span className="text-sm text-gray-700 dark:text-gray-200 font-mono">{log.action}</span>
                              </div>
                              <span className="text-xs text-gray-400 whitespace-nowrap">{log.time}</span>
                          </div>
                      ))}
                  </div>
              </CardContent>
          </Card>

          {/* Channel Distribution */}
          <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border-none">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-500" /> Channel Mix
                  </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie
                              data={platformData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                          >
                            {platformData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          />
                          <Legend />
                      </PieChart>
                  </ResponsiveContainer>
              </CardContent>
          </Card>
      </div>
    </div>
  );
};

export default Dashboard;

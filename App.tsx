
import React, { useState, useEffect, Suspense, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import { CommandMenu } from './components/CommandMenu';
import { Login } from './components/auth/Login';
import { SignUp } from './components/auth/SignUp';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { LandingPage } from './components/LandingPage';
import { OnboardingWizard } from './components/OnboardingWizard';
import { FeedbackChannel } from './components/FeedbackChannel';
import { AIConfig, KnowledgeBaseData, Integration, AIModel, TaskAssignment, Theme, AppMode, Apartment, Restaurant, Thread, Booking, Notification, Priority, MessageStatus, Platform, Subscription, MaintenanceIssue, VoiceCommand, BookingStatus, MessageTemplate, TeamMember, CustomerProfile, SmartRailContext } from './types';
import { initialIntegrations, defaultModels, defaultTaskAssignment, mockBookings, mockApartments, mockThreads, mockMaintenanceIssues, mockRestaurants, initialPropertyKnowledgeBases, initialRestaurantKnowledgeBases, initialEcommerceKnowledgeBase, mockTemplates, mockTeamMembers, mockCustomers } from './data';
import { Menu, Search, Loader2 } from 'lucide-react';
import { saveToStorage, loadFromStorage, KEYS } from './utils/storage';
import { generateRandomEvent } from './services/simulationService';
import { NotificationCenter } from './components/NotificationCenter';
import { socket } from './services/socketService';
import { ErrorBoundary } from './components/ErrorBoundary';
import { getTheme } from './utils/theme';
import { Toaster } from './components/ui/sonner';
import { api } from './utils/api';
import { toast } from 'sonner';
import { SmartRail } from './components/SmartRail';

// Lazy Load Components for Performance
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const Inbox = React.lazy(() => import('./components/Inbox'));
const Settings = React.lazy(() => import('./components/Settings'));
const KnowledgeBase = React.lazy(() => import('./components/KnowledgeBase'));
const Integrations = React.lazy(() => import('./components/Integrations'));
const Models = React.lazy(() => import('./components/Models'));
const CalendarView = React.lazy(() => import('./components/CalendarView'));
const Billing = React.lazy(() => import('./components/Billing'));
const Workflows = React.lazy(() => import('./components/Workflows'));
const Records = React.lazy(() => import('./components/Records'));
const Operations = React.lazy(() => import('./components/Operations'));
const Templates = React.lazy(() => import('./components/Templates'));
const Marketing = React.lazy(() => import('./components/Marketing'));
const Fundraising = React.lazy(() => import('./components/Fundraising').then(module => ({ default: module.Fundraising })));
const Customers = React.lazy(() => import('./components/Customers').then(module => ({ default: module.Customers })));
const BusinessCopilot = React.lazy(() => import('./components/BusinessCopilot').then(module => ({ default: module.BusinessCopilot })));
const LegalVault = React.lazy(() => import('./components/LegalVault').then(module => ({ default: module.LegalVault })));

const App: React.FC = () => {
    // Authentication State with Persistence
    const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('access_token'));
    const [authView, setAuthView] = useState<'login' | 'signup' | 'forgot-password' | 'fundraising'>('login');

    // Landing Page State - Skip if already authenticated
    const [showLandingPage, setShowLandingPage] = useState(() => !localStorage.getItem('access_token'));

    // Onboarding State
    const [hasOnboarded, setHasOnboarded] = useState<boolean>(() => loadFromStorage(KEYS.ONBOARDING_COMPLETE, false));

    const [currentView, setCurrentView] = useState<'dashboard' | 'inbox' | 'records' | 'operations' | 'settings' | 'knowledge-base' | 'templates' | 'integrations' | 'models' | 'calendar' | 'billing' | 'workflows' | 'marketing' | 'crm' | 'copilot' | 'voice-command' | 'legal'>('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);

    // Smart Rail State
    const [smartRailContext, setSmartRailContext] = useState<SmartRailContext>({ type: 'none', data: null });
    const [isSmartRailOpen, setIsSmartRailOpen] = useState(false);

    // Feedback
    const [showFeedback, setShowFeedback] = useState(false);
    const [isOnline, setIsOnline] = useState(false);

    // --- PERSISTENT STATE INITIALIZATION ---

    const [theme, setTheme] = useState<Theme>(() => loadFromStorage(KEYS.THEME, 'light'));
    const [appMode, setAppMode] = useState<AppMode>(() => loadFromStorage(KEYS.APP_MODE, 'property'));

    const [aiConfig, setAiConfig] = useState<AIConfig>(() => loadFromStorage(KEYS.CONFIG, {
        tone: 'Friendly',
        autoPilot: false,
        autoPilotDelay: 5,
        language: 'English',
        aiName: 'Assistant'
    }));

    // Subscription State
    const [subscription, setSubscription] = useState<Subscription>(() => loadFromStorage(KEYS.SUBSCRIPTION, {
        tier: 'Starter',
        interval: 'monthly',
        status: 'active'
    }));

    // Lifted State: Threads (Messages) & Bookings
    const [threads, setThreads] = useState<Thread[]>(() => loadFromStorage(KEYS.THREADS, mockThreads));
    const [bookings, setBookings] = useState<Booking[]>(() => loadFromStorage(KEYS.BOOKINGS, mockBookings));
    const [maintenanceIssues, setMaintenanceIssues] = useState<MaintenanceIssue[]>(() => loadFromStorage('wedo_maint_v1', mockMaintenanceIssues));
    const [customers, setCustomers] = useState<CustomerProfile[]>(() => loadFromStorage('wedo_customers_v1', mockCustomers));

    // Global Draft State for Voice Commands
    const [globalDraft, setGlobalDraft] = useState<string | null>(null);

    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Other Data
    const [apartments, setApartments] = useState<Apartment[]>(() => loadFromStorage(KEYS.APARTMENTS, mockApartments));
    const [restaurants, setRestaurants] = useState<Restaurant[]>(() => loadFromStorage('wedo_rest_v1', mockRestaurants));
    const [propertyKBs, setPropertyKBs] = useState<Record<string, KnowledgeBaseData>>(() => loadFromStorage(KEYS.KB_PROPERTY, initialPropertyKnowledgeBases));
    const [restaurantKBs, setRestaurantKBs] = useState<Record<string, KnowledgeBaseData>>(() => loadFromStorage('wedo_kb_rest_v1', initialRestaurantKnowledgeBases));
    const [ecommerceKB, setEcommerceKB] = useState<KnowledgeBaseData>(() => loadFromStorage(KEYS.KB_ECOMMERCE, initialEcommerceKnowledgeBase));
    const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);
    const [models, setModels] = useState<AIModel[]>(() => loadFromStorage('wedo_models_v1', defaultModels));
    const [taskAssignments, setTaskAssignments] = useState<TaskAssignment>(() => loadFromStorage('wedo_task_assignments_v1', defaultTaskAssignment));

    // Templates State
    const [templates, setTemplates] = useState<MessageTemplate[]>(() => loadFromStorage('wedo_templates_v1', mockTemplates));

    // Team State
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => loadFromStorage('wedo_team_v1', mockTeamMembers));

    // Current User State (RBAC) - Restore from storage or Default to Admin
    const [currentUser, setCurrentUser] = useState<TeamMember>(() => {
        try {
            const stored = localStorage.getItem('wedo_user');
            return stored ? JSON.parse(stored) : mockTeamMembers[0];
        } catch (e) {
            // Fallback to default admin if parsing fails
            setCurrentUser(mockTeamMembers[0]);
        }
    });

    const currentTheme = getTheme(appMode);

    // RBAC View Enforcement
    useEffect(() => {
        if (currentUser.role === 'Maintenance') {
            setCurrentView('operations');
        }
    }, [currentUser.role]);

    // Fetch Data from Backend on Mount
    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchData = async () => {
            try {
                // 1. Fetch Chat Threads
                const threadsData = await api.get<Thread[]>('/api/chat/threads', { skipErrorHandling: true });
                if (threadsData && threadsData.length > 0) {
                    setThreads(threadsData);
                    setIsOnline(true);
                    toast.success("Connected to Cloud", { description: "Synced with backend server." });
                }

                // 2. Fetch Operations Data
                const bookingsData = await api.get<Booking[]>('/api/operations/bookings', { skipErrorHandling: true });
                if (bookingsData && bookingsData.length > 0) {
                    setBookings(bookingsData);
                }

                const maintData = await api.get<MaintenanceIssue[]>('/api/operations/maintenance', { skipErrorHandling: true });
                if (maintData && maintData.length > 0) {
                    setMaintenanceIssues(maintData);
                }

                // 3. Fetch CRM Customers
                const customersData = await api.get<CustomerProfile[]>('/api/crm/customers', { skipErrorHandling: true });
                if (customersData && customersData.length > 0) {
                    setCustomers(customersData);
                }

                // 4. Fetch AI Models
                const modelsData = await api.get<AIModel[]>('/api/ai/models', { skipErrorHandling: true });
                if (modelsData && modelsData.length > 0) {
                    setModels(modelsData);
                }

                // 5. Fetch Task Assignments
                const taskAssignmentsData = await api.get<TaskAssignment>('/api/ai/task-assignments', { skipErrorHandling: true });
                if (taskAssignmentsData) {
                    setTaskAssignments(taskAssignmentsData);
                }

            } catch (error) {
                console.warn("Backend unavailable, using local mock data.");
                setIsOnline(false);
            }
        };
        fetchData();
    }, [isAuthenticated]);

    // Theme Effect
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        saveToStorage(KEYS.THEME, theme);
    }, [theme]);

    // App Mode Effect
    useEffect(() => {
        saveToStorage(KEYS.APP_MODE, appMode);
    }, [appMode]);

    // Persistence Effect (Sync local storage when backend is offline)
    useEffect(() => {
        if (!isOnline) {
            saveToStorage(KEYS.THREADS, threads);
            saveToStorage(KEYS.BOOKINGS, bookings);
            saveToStorage('wedo_maint_v1', maintenanceIssues);
            saveToStorage('wedo_team_v1', teamMembers);
            saveToStorage('wedo_customers_v1', customers);
            // ... save other critical data
        }
    }, [threads, bookings, maintenanceIssues, teamMembers, customers, isOnline]);

    // Persist models and task assignments (always save, not just when offline)
    useEffect(() => {
        saveToStorage('wedo_models_v1', models);
    }, [models]);

    useEffect(() => {
        saveToStorage('wedo_task_assignments_v1', taskAssignments);
    }, [taskAssignments]);

    // Simulation Loop (disabled - using real backend data)
    useEffect(() => {
        // Simulation disabled - backend provides real-time data via WebSocket
        return () => { };
    }, [appMode]);

    const handleLogin = useCallback(() => {
        setIsAuthenticated(true);
        setShowLandingPage(false);

        // Try to load user from storage if login just happened
        try {
            const stored = localStorage.getItem('wedo_user');
            if (stored) setCurrentUser(JSON.parse(stored));
        } catch (e) {
            // Fallback to default admin if parsing fails
            setCurrentUser(mockTeamMembers[0]);
        }

        toast.success("Welcome back!", { description: "You are securely logged in." });
    }, []);

    const handleLogout = useCallback(() => {
        setIsAuthenticated(false);
        setShowLandingPage(true);
        setCurrentView('dashboard');
        localStorage.removeItem('access_token');
        localStorage.removeItem('wedo_user');
    }, []);

    const handleVoiceCommand = useCallback((cmd: VoiceCommand) => {
        if (cmd.type === 'NAVIGATE') {
            // Heuristic mapping
            const transcript = cmd.originalTranscript.toLowerCase();
            if (transcript.includes('inbox') || transcript.includes('messages')) setCurrentView('inbox');
            else if (transcript.includes('calendar')) setCurrentView('calendar');
            else if (transcript.includes('settings')) setCurrentView('settings');
            else if (transcript.includes('billing')) setCurrentView('billing');
            else if (transcript.includes('marketing')) setCurrentView('marketing');
            else if (transcript.includes('legal') || transcript.includes('contract')) setCurrentView('legal');
            else setCurrentView('dashboard'); // Default
            toast.success(`Navigated to ${cmd.type}`);
        } else if (cmd.type === 'DRAFT_MESSAGE') {
            setGlobalDraft(cmd.data?.text || cmd.originalTranscript);
            setCurrentView('inbox');
            toast.success("Draft created from voice command");
        }
    }, []);

    const handleCloseMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(false);
    }, []);

    const handleUpdateRecord = useCallback((r: Booking) => {
        setBookings(prev => prev.map(b => b.id === r.id ? { ...b, ...r } : b));
        toast.success("Record updated");
    }, []);

    // New Handlers for Staff Portal
    const handleUpdateBooking = useCallback((updated: Booking) => {
        setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
    }, []);

    const handleUpdateIssue = useCallback((updated: MaintenanceIssue) => {
        setMaintenanceIssues(prev => prev.map(i => i.id === updated.id ? updated : i));
    }, []);

    const handleAddBooking = useCallback((newBooking: Booking) => {
        setBookings(prev => [newBooking, ...prev]);
        toast.success("Task added");
    }, []);

    const handleAddIssue = useCallback((newIssue: MaintenanceIssue) => {
        setMaintenanceIssues(prev => [newIssue, ...prev]);
        toast.success("Issue reported");
    }, []);

    const handleAddToKnowledgeBase = useCallback((q: string, a: string, eid?: string) => {
        if (appMode === 'property') {
            setPropertyKBs(prev => ({ ...prev, [eid || apartments[0].id]: { ...prev[eid || apartments[0].id], faqs: [...prev[eid || apartments[0].id].faqs, { id: Date.now().toString(), question: q, answer: a }] } }));
        } else if (appMode === 'restaurant') {
            setRestaurantKBs(prev => ({ ...prev, [eid || restaurants[0].id]: { ...prev[eid || restaurants[0].id], faqs: [...prev[eid || restaurants[0].id].faqs, { id: Date.now().toString(), question: q, answer: a }] } }));
        } else {
            setEcommerceKB(prev => ({ ...prev, faqs: [...prev.faqs, { id: Date.now().toString(), question: q, answer: a }] }));
        }
        toast.success("Knowledge Base Updated", { description: "AI will use this new rule immediately." });
    }, [appMode, apartments, restaurants]);

    // Smart Rail Trigger Handler
    const handleSelectContext = useCallback((context: SmartRailContext) => {
        setSmartRailContext(context);
        setIsSmartRailOpen(true);
    }, []);

    // Platform Distribution Data for Copilot
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

    // Routing Logic
    if (authView === 'fundraising') {
        return (
            <Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-950"><Loader2 className="w-12 h-12 animate-spin text-indigo-600" /></div>}>
                <Fundraising onBack={() => { setShowLandingPage(true); setAuthView('login'); }} />
            </Suspense>
        );
    }

    if (showLandingPage) {
        return <LandingPage onNavigate={(view) => {
            if (view === 'login' || view === 'signup') {
                setAuthView(view);
                setShowLandingPage(false);
            }
        }} onModeSelect={setAppMode} onInvest={() => setAuthView('fundraising')} />;
    }

    if (!isAuthenticated) {
        if (authView === 'login') return <Login onLogin={handleLogin} onNavigate={(v) => setAuthView(v)} appMode={appMode} />;
        if (authView === 'signup') return <SignUp onLogin={handleLogin} onNavigate={(v) => setAuthView(v)} appMode={appMode} />;
        if (authView === 'forgot-password') return <ForgotPassword onNavigate={(v) => setAuthView(v)} />;
    }

    if (!hasOnboarded) {
        return <OnboardingWizard
            onComplete={() => { setHasOnboarded(true); saveToStorage(KEYS.ONBOARDING_COMPLETE, true); }}
            setAppMode={setAppMode}
            setConfig={setAiConfig}
            config={aiConfig}
            setIntegrations={setIntegrations}
        />;
    }



    return (
        <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-950 transition-colors duration-300 relative">
            <Toaster />

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={handleCloseMobileMenu}></div>
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <Sidebar
                    currentView={currentView}
                    setView={setCurrentView}
                    onLogout={handleLogout}
                    onClose={handleCloseMobileMenu}
                    onOpenFeedback={() => setShowFeedback(true)}
                    appMode={appMode}
                    currentUser={currentUser}
                />
            </div>

            <main className="flex-1 flex flex-col h-full w-full relative overflow-hidden transition-all duration-300">
                {/* Header / Toolbar */}
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-40 flex gap-1 sm:gap-2 items-center">

                    <NotificationCenter
                        notifications={notifications}
                        onMarkRead={(id) => setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x))}
                        onClearAll={() => setNotifications([])}
                    />
                    <button onClick={() => setIsCommandMenuOpen(true)} className="p-1.5 sm:p-2 bg-white dark:bg-gray-800 rounded-full shadow-md text-gray-500 hover:text-indigo-600 transition-colors border border-gray-200 dark:border-gray-700">
                        <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-1.5 sm:p-2 bg-white dark:bg-gray-800 rounded-full shadow-md text-gray-500 border border-gray-200 dark:border-gray-700">
                        <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>

                <ErrorBoundary>
                    <Suspense fallback={
                        <div className="flex h-full w-full items-center justify-center bg-gray-50 dark:bg-gray-950">
                            <Loader2 className={`w-12 h-12 ${currentTheme.text} animate-spin`} />
                        </div>
                    }>
                        {currentView === 'dashboard' && (
                            <Dashboard
                                threads={threads}
                                bookings={bookings}
                                currentPlan={subscription.tier}
                                onUpgrade={() => setCurrentView('billing')}
                                appMode={appMode}
                                models={models}
                                onVoiceCommand={handleVoiceCommand}
                                apartments={apartments}
                                restaurants={restaurants}
                            />
                        )}
                        {currentView === 'copilot' && (
                            <div className="p-3 sm:p-4 md:p-6 lg:p-8 h-full overflow-y-auto">
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Business Copilot</h1>
                                <BusinessCopilot
                                    appMode={appMode}
                                    threads={threads}
                                    bookings={bookings}
                                    platformData={platformData}
                                    models={models}
                                    apartments={apartments}
                                    restaurants={restaurants}
                                />
                            </div>
                        )}
                        {currentView === 'legal' && <LegalVault appMode={appMode} />}
                        {currentView === 'inbox' && (
                            <Inbox
                                threads={threads}
                                setThreads={setThreads}
                                config={aiConfig}
                                propertyKnowledgeBases={propertyKBs}
                                restaurantKnowledgeBases={restaurantKBs}
                                ecommerceKnowledgeBase={ecommerceKB}
                                apartments={apartments}
                                restaurants={restaurants}
                                models={models}
                                taskAssignments={taskAssignments}
                                onAddToKnowledgeBase={handleAddToKnowledgeBase}
                                appMode={appMode}
                                currentPlan={subscription.tier}
                                onUpgrade={() => setCurrentView('billing')}
                                maintenanceIssues={maintenanceIssues}
                                setMaintenanceIssues={setMaintenanceIssues}
                                globalDraft={globalDraft}
                                onClearGlobalDraft={() => setGlobalDraft(null)}
                                templates={templates}
                                onSelectContext={handleSelectContext}
                            />
                        )}
                        {currentView === 'calendar' && (
                            <CalendarView
                                bookings={bookings}
                                setBookings={setBookings}
                                appMode={appMode}
                                integrations={integrations}
                                apartments={apartments}
                                restaurants={restaurants}
                                currentTheme={theme}
                                onSelectContext={handleSelectContext}
                            />
                        )}
                        {currentView === 'operations' && (
                            <Operations
                                bookings={bookings}
                                setBookings={setBookings}
                                maintenanceIssues={maintenanceIssues}
                                setMaintenanceIssues={setMaintenanceIssues}
                                apartments={apartments}
                                restaurants={restaurants}
                                integrations={integrations}
                                appMode={appMode}
                                onSelectContext={handleSelectContext}
                            />
                        )}
                        {currentView === 'records' && <Records records={bookings} appMode={appMode} apartments={apartments} restaurants={restaurants} onUpdateRecord={handleUpdateRecord} />}
                        {currentView === 'settings' && <Settings config={aiConfig} setConfig={setAiConfig} theme={theme} setTheme={setTheme} appMode={appMode} setAppMode={setAppMode} apartments={apartments} setApartments={setApartments} restaurants={restaurants} setRestaurants={setRestaurants} setPropertyKBs={setPropertyKBs} setRestaurantKBs={setRestaurantKBs} teamMembers={teamMembers} setTeamMembers={setTeamMembers} currentUser={currentUser} setCurrentUser={setCurrentUser} />}
                        {currentView === 'knowledge-base' && <KnowledgeBase appMode={appMode} apartments={apartments} restaurants={restaurants} propertyKBs={propertyKBs} setPropertyKBs={setPropertyKBs} restaurantKBs={restaurantKBs} setRestaurantKBs={setRestaurantKBs} ecommerceKB={ecommerceKB} setEcommerceKB={setEcommerceKB} />}
                        {currentView === 'integrations' && <Integrations integrations={integrations} setIntegrations={setIntegrations} appMode={appMode} />}
                        {currentView === 'models' && <Models models={models} setModels={setModels} taskAssignments={taskAssignments} setTaskAssignments={setTaskAssignments} appMode={appMode} />}
                        {currentView === 'billing' && <Billing subscription={subscription} onUpdatePlan={(tier, interval) => setSubscription({ tier, interval, status: 'active' })} appMode={appMode} />}
                        {currentView === 'workflows' && <Workflows appMode={appMode} />}
                        {currentView === 'templates' && <Templates appMode={appMode} apartments={apartments} restaurants={restaurants} templates={templates} setTemplates={setTemplates} />}
                        {currentView === 'marketing' && <Marketing appMode={appMode} currentPlan={subscription.tier} onUpgrade={() => setCurrentView('billing')} models={models} taskAssignments={taskAssignments} />}
                        {currentView === 'crm' && <Customers customers={customers} setCustomers={setCustomers} appMode={appMode} models={models} taskAssignments={taskAssignments} />}
                    </Suspense>
                </ErrorBoundary>
            </main>

            <CommandMenu isOpen={isCommandMenuOpen} setIsOpen={setIsCommandMenuOpen} setView={setCurrentView} toggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} appMode={appMode} />
            <FeedbackChannel isOpen={showFeedback} onClose={() => setShowFeedback(false)} appMode={appMode} />

            {/* Global Smart Rail */}
            <SmartRail
                isOpen={isSmartRailOpen}
                onClose={() => setIsSmartRailOpen(false)}
                context={smartRailContext}
                appMode={appMode}
                customers={customers}
            />
        </div>
    );
};

export default App;

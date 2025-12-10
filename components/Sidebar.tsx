
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, MessageSquare, Settings, Bot, Book, Network, X, BrainCircuit, Calendar as CalendarIcon, LogOut, CreditCard, GitFork, Users, ClipboardList, LayoutTemplate, Megaphone, MessageCircle, UserCheck, Scale, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Logo } from './Logo';
import { AppMode, TeamMember } from '../types';
import { getTheme } from '../utils/theme';

interface SidebarProps {
  currentView: 'dashboard' | 'inbox' | 'records' | 'operations' | 'settings' | 'knowledge-base' | 'templates' | 'integrations' | 'models' | 'calendar' | 'billing' | 'workflows' | 'marketing' | 'crm' | 'copilot' | 'voice-command' | 'legal';
  setView: (view: any) => void;
  onClose?: () => void;
  onLogout: () => void;
  onOpenFeedback?: () => void;
  appMode: AppMode;
  currentUser: TeamMember;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onClose, onLogout, onOpenFeedback, appMode, currentUser }) => {
  const theme = getTheme(appMode);
  const [isMinimized, setIsMinimized] = useState(() => {
    // Auto-minimize on mobile, allow manual control on desktop
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768; // md breakpoint
    }
    return false;
  });

  // Auto-minimize on mobile resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && !isMinimized) {
        setIsMinimized(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMinimized]);

  const handleLinkClick = (view: any) => {
    setView(view);
    if (onClose) onClose();
  };

  // RBAC Logic
  const isAllowed = (view: string) => {
      if (currentUser.role === 'Admin') return true;
      
          const permissions: Record<string, string[]> = {
              'Agent': ['dashboard', 'inbox', 'calendar', 'operations', 'records', 'marketing', 'workflows', 'templates', 'knowledge-base', 'settings', 'crm', 'copilot', 'voice-command', 'legal'],
              'Maintenance': ['operations', 'settings'],
              'Owner': ['dashboard', 'calendar', 'records', 'settings', 'copilot', 'legal']
          };

      return permissions[currentUser.role]?.includes(view) || false;
  };

  const getNavLabels = () => {
    switch (appMode) {
      case 'ecommerce':
        return { 
          dashboard: 'Store Overview',
          calendar: 'Delivery Schedule',
          inbox: 'Support Inbox',
          operations: 'Fulfillment', 
          records: 'Orders',
          marketing: 'Campaigns',
          crm: 'Customers'
        };
      case 'restaurant':
        return { 
          dashboard: 'Restaurant Dash',
          calendar: 'Bookings & Tables',
          inbox: 'Concierge',
          operations: 'Kitchen & FOH', 
          records: 'Reservations', 
          marketing: 'Promotions',
          crm: 'Guests'
        };
      case 'service':
        return { 
          dashboard: 'Practice Overview',
          calendar: 'Appointments',
          inbox: 'Client Chat',
          operations: 'Front Desk', 
          records: 'History',
          marketing: 'Retention',
          crm: 'Clients'
        };
      case 'automotive':
        return { 
          dashboard: 'Shop Overview',
          calendar: 'Service Schedule',
          inbox: 'Customer Updates',
          operations: 'Shop Floor', 
          records: 'Job Cards',
          marketing: 'Recall & Offers',
          crm: 'Owners'
        };
      case 'event':
        return { 
          dashboard: 'Event Command',
          calendar: 'Run of Show',
          inbox: 'Vendor Chat',
          operations: 'Logistics', 
          records: 'Guest Lists',
          marketing: 'Ticket Sales',
          crm: 'Attendees'
        };
      case 'custom':
        return { 
          dashboard: 'Overview',
          calendar: 'Schedule',
          inbox: 'Inbox',
          operations: 'Tasks', 
          records: 'Logs',
          marketing: 'Outreach',
          crm: 'Contacts'
        };
      default: // Property
        return { 
          dashboard: 'Dashboard',
          calendar: 'Calendar',
          inbox: 'Unified Inbox',
          operations: 'Operations', 
          records: 'Records', 
          marketing: 'Marketing',
          crm: 'People'
        };
    }
  };
  
  const labels = getNavLabels();

  const NavItem = ({ view, icon: Icon, label }: { view: any, icon: any, label: string }) => {
    if (!isAllowed(view)) return null;
    
    const isActive = currentView === view;

    return (
      <Button 
          variant={isActive ? 'secondary' : 'ghost'} 
          className={`w-full ${isMinimized ? 'justify-center px-2' : 'justify-start'} transition-all duration-300 mb-1 relative overflow-hidden group 
            ${isActive 
                ? `${theme.lightBg} ${theme.text} dark:${theme.darkBgSubtle} dark:${theme.darkText}` 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/30'
            }`} 
          onClick={() => handleLinkClick(view)}
          title={isMinimized ? label : undefined}
      >
          {isActive && !isMinimized && (
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.bg} rounded-r-full animate-slide-in-right`} />
          )}
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isMinimized ? '' : 'mr-2 sm:mr-3'} transition-transform group-hover:scale-110 
            ${isActive ? `${theme.text} dark:${theme.darkText}` : 'text-gray-500 dark:text-gray-500'}`} 
          />
          {!isMinimized && <span className="font-medium text-sm sm:text-base truncate">{label}</span>}
      </Button>
    );
  };

  return (
    <div className={`${isMinimized ? 'w-16 sm:w-20' : 'w-64 sm:w-72'} h-full flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out bg-white/95 dark:bg-gray-925/95 backdrop-blur-xl border-r border-gray-200/60 dark:border-gray-800/40 shadow-2xl z-20`}>
      <div className={`p-3 sm:p-4 md:p-6 flex items-center ${isMinimized ? 'justify-center' : 'justify-between'}`}>
        {!isMinimized && (
          <Logo 
              className="w-8 h-8" 
              textClassName="text-2xl" 
              color={theme.hex}
              secondaryColor={theme.hex === '#4f46e5' ? '#9333EA' : theme.hex}
          />
        )}
        {isMinimized && (
          <Logo 
              className="w-6 h-6" 
              textClassName="hidden" 
              color={theme.hex}
              secondaryColor={theme.hex === '#4f46e5' ? '#9333EA' : theme.hex}
          />
        )}
        {onClose && !isMinimized && (
          <button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-transform active:scale-90">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Toggle Button - Hidden on mobile, shown on desktop */}
      <div className={`px-2 sm:px-4 mb-2 hidden md:block ${isMinimized ? 'flex justify-center' : ''}`}>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className={`${isMinimized ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-full'} flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all group border border-gray-200 dark:border-gray-700/50`}
          title={isMinimized ? 'Expand sidebar' : 'Minimize sidebar'}
        >
          {isMinimized ? (
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200">Minimize</span>
            </>
          )}
        </button>
      </div>

      {!isMinimized && (
        <div className="px-3 sm:px-4 md:px-6 mb-4 sm:mb-6">
            <div className="flex items-center gap-3 group cursor-pointer p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700/50">
                <div className={`relative w-10 h-10 rounded-full p-[2px] ${theme.bg} bg-opacity-20 transition-all duration-300 group-hover:shadow-md`}>
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full rounded-full object-cover border-2 border-white dark:border-gray-800" />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-925 rounded-full"></div>
                </div>
                <div className="overflow-hidden">
                    <div className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{currentUser.name}</div>
                    <div className={`text-[10px] font-medium tracking-wider uppercase ${theme.text} dark:${theme.darkText} opacity-90`}>
                        {currentUser.role}
                    </div>
                </div>
            </div>
        </div>
      )}
      
      {isMinimized && (
        <div className="px-2 sm:px-4 mb-4 sm:mb-6 flex justify-center">
            <div className={`relative w-10 h-10 rounded-full p-[2px] ${theme.bg} bg-opacity-20 cursor-pointer hover:shadow-md transition-all`} title={`${currentUser.name} (${currentUser.role})`}>
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full rounded-full object-cover border-2 border-white dark:border-gray-800" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-925 rounded-full"></div>
            </div>
        </div>
      )}

      <div className="flex-1 px-2 sm:px-3 md:px-4 py-2 space-y-4 sm:space-y-6 overflow-y-auto no-scrollbar">
        {currentUser.role !== 'Maintenance' && (
            <div>
                {!isMinimized && (
                  <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 px-3">
                  Overview
                  </div>
                )}
                <NavItem view="dashboard" icon={LayoutDashboard} label={labels.dashboard} />
                <NavItem view="calendar" icon={CalendarIcon} label={labels.calendar} />
                <NavItem view="inbox" icon={MessageSquare} label={labels.inbox} />
                <NavItem view="crm" icon={UserCheck} label={labels.crm} />
                <NavItem view="operations" icon={ClipboardList} label={labels.operations} />
                <NavItem view="records" icon={Users} label={labels.records} />
            </div>
        )}

        {currentUser.role !== 'Maintenance' && (
            <div>
                {!isMinimized && (
                  <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 px-3">
                  AI Tools
                  </div>
                )}
                <NavItem view="copilot" icon={Bot} label="Business Copilot" />
                <NavItem view="legal" icon={Scale} label="Legal Vault" />
            </div>
        )}

        {currentUser.role !== 'Maintenance' && currentUser.role !== 'Owner' && (
            <div>
                {!isMinimized && (
                  <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 px-3">
                  Growth & Automation
                  </div>
                )}
                <NavItem view="marketing" icon={Megaphone} label={labels.marketing} />
                <NavItem view="workflows" icon={GitFork} label="Workflows" />
                <NavItem view="templates" icon={LayoutTemplate} label="Templates" />
                <NavItem view="models" icon={BrainCircuit} label="Models & API" />
                <NavItem view="knowledge-base" icon={Book} label="Knowledge Base" />
            </div>
        )}

        <div>
            {!isMinimized && (
              <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 px-3">
              System
              </div>
            )}
            <NavItem view="integrations" icon={Network} label="Integrations" />
            <NavItem view="settings" icon={Settings} label="Settings" />
            <NavItem view="billing" icon={CreditCard} label="Billing" />
        </div>
      </div>

      <div className="p-2 sm:p-3 md:p-4 mt-auto space-y-2 sm:space-y-3 md:space-y-4 bg-gradient-to-t from-white/90 via-white/50 to-transparent dark:from-gray-900/90 dark:via-gray-900/50">
        
        {/* Founder Channel Button */}
        {!isMinimized ? (
          <button 
              onClick={onOpenFeedback}
              className={`w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${theme.gradient} text-white hover:shadow-lg transition-all group`}
          >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                  <div className="text-xs font-bold">Talk to Team</div>
                  <div className="text-[10px] text-white/80">Feature request?</div>
              </div>
          </button>
        ) : (
          <button 
              onClick={onOpenFeedback}
              className={`w-full flex items-center justify-center p-3 rounded-xl bg-gradient-to-r ${theme.gradient} text-white hover:shadow-lg transition-all`}
              title="Talk to Team"
          >
              <MessageCircle className="w-4 h-4 text-white" />
          </button>
        )}

        <Button 
          variant="ghost" 
          className={`w-full ${isMinimized ? 'justify-center px-2' : 'justify-start'} text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20`}
          onClick={onLogout}
          title={isMinimized ? 'Sign Out' : undefined}
        >
          <LogOut className={`w-4 h-4 ${isMinimized ? '' : 'mr-2'}`} />
          {!isMinimized && 'Sign Out'}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

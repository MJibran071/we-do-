

import React, { useState, useEffect } from 'react';
import { AppMode, AIConfig, Integration } from '../types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Building, UtensilsCrossed, ShoppingBag, ArrowRight, Bot, Sparkles, CheckCircle, Loader2, Database, Briefcase, User, Check, Zap, Wand2, Globe, Link, Heart, Wrench, PartyPopper, Briefcase as BriefcaseIcon } from 'lucide-react';
import { scrapeUrlForConfig } from '../services/geminiService';
import { getTheme } from '../utils/theme';

interface OnboardingWizardProps {
  onComplete: () => void;
  setAppMode: (mode: AppMode) => void;
  setConfig: React.Dispatch<React.SetStateAction<AIConfig>>;
  config: AIConfig;
  setIntegrations: React.Dispatch<React.SetStateAction<Integration[]>>;
}

const BUSINESS_TYPES = [
    { id: 'property', label: 'Property', icon: Building, desc: 'Rentals, Hotels', color: 'indigo' },
    { id: 'restaurant', label: 'Restaurant', icon: UtensilsCrossed, desc: 'Dining, Cafes', color: 'orange' },
    { id: 'ecommerce', label: 'Retail', icon: ShoppingBag, desc: 'Online Stores', color: 'purple' },
    { id: 'service', label: 'Wellness', icon: Heart, desc: 'Spas, Salons', color: 'cyan' },
    { id: 'automotive', label: 'Automotive', icon: Wrench, desc: 'Repair Shops', color: 'slate' },
    { id: 'event', label: 'Events', icon: PartyPopper, desc: 'Venues, Planning', color: 'rose' },
    { id: 'custom', label: 'Other / Custom', icon: BriefcaseIcon, desc: 'Agency, Consultant', color: 'teal' },
] as const;

const IMPORT_CONFIG: Record<AppMode, { title: string; desc: string; placeholder: string; icon: React.ElementType }> = {
    property: {
        title: "Import Listing",
        desc: "Paste your Airbnb, VRBO, or Booking.com link to auto-configure.",
        placeholder: "https://www.airbnb.com/rooms/12345678",
        icon: Building
    },
    restaurant: {
        title: "Sync Menu & Info",
        desc: "Paste your website, Google Maps link, or OpenTable URL.",
        placeholder: "https://www.opentable.com/r/my-restaurant",
        icon: UtensilsCrossed
    },
    ecommerce: {
        title: "Connect Store",
        desc: "Paste your Shopify, WooCommerce, or Etsy shop URL.",
        placeholder: "https://mystore.myshopify.com",
        icon: ShoppingBag
    },
    service: {
        title: "Import Services",
        desc: "Paste your booking page (Mindbody, Fresha) or website.",
        placeholder: "https://www.fresha.com/a/my-salon",
        icon: Heart
    },
    automotive: {
        title: "Sync Shop Details",
        desc: "Paste your Google Business Profile or website URL.",
        placeholder: "https://g.page/r/my-mechanic",
        icon: Wrench
    },
    event: {
        title: "Import Venue",
        desc: "Paste your venue listing (The Knot, WeddingWire) or site.",
        placeholder: "https://www.theknot.com/marketplace/my-venue",
        icon: PartyPopper
    },
    custom: {
        title: "Import Business Info",
        desc: "Paste your website or social media URL to analyze context.",
        placeholder: "https://mybusiness.com",
        icon: BriefcaseIcon
    }
};

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete, setAppMode, setConfig, config, setIntegrations }) => {
  const [step, setStep] = useState(1);
  const [selectedMode, setSelectedMode] = useState<AppMode>('property');
  const [aiName, setAiName] = useState('');
  const [selectedTone, setSelectedTone] = useState(config.tone);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const theme = getTheme(selectedMode);
  
  // Magic Import State
  const [importUrl, setImportUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const importConfig = IMPORT_CONFIG[selectedMode];
  const ImportIcon = importConfig.icon;

  const handleModeSelect = (mode: AppMode) => {
    setSelectedMode(mode);
    setAppMode(mode); // Update global state immediately for preview
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleSavePersona = () => {
    setConfig(prev => ({ ...prev, tone: selectedTone, aiName: aiName || 'Assistant' }));
    handleNext();
  };

  const handleMagicImport = async () => {
      if (!importUrl) return;
      setIsImporting(true);
      try {
          const result = await scrapeUrlForConfig(importUrl);
          
          // Auto-configure based on scrape
          setSelectedMode(result.businessType);
          setAppMode(result.businessType);
          setAiName(`${result.name} AI`);
          setSelectedTone(result.tone);
          setConfig(prev => ({
              ...prev,
              aiName: `${result.name} AI`,
              tone: result.tone
          }));
          
          // Skip to success
          setTimeout(() => {
              setIsImporting(false);
              setStep(3); // Jump to integration/data step
              setIsConnected(true); // Mock successful data sync from "Scrape"
          }, 2000);
      } catch (error) {
          console.error(error);
          setIsImporting(false);
      }
  };

  const handleConnect = () => {
    setIsConnecting(true);
    // Simulate connection delay
    setTimeout(() => {
        setIsConnecting(false);
        setIsConnected(true);
        
        // Simulate enabling the relevant integration
        setIntegrations(prev => prev.map(i => {
            if (selectedMode === 'property' && i.name === 'Airbnb') return { ...i, status: 'Connected', lastSync: new Date() };
            if (selectedMode === 'restaurant' && i.name === 'OpenTable') return { ...i, status: 'Connected', lastSync: new Date() }; 
            if (selectedMode === 'ecommerce' && i.name === 'Shopify') return { ...i, status: 'Connected', lastSync: new Date() }; 
            // Add mocks for new modes if we had full integration objects for them
            return i;
        }));
    }, 2000);
  };

  const getIntegrationInfo = () => {
      switch (selectedMode) {
          case 'property': return { name: 'Airbnb', icon: 'https://cdn.simpleicons.org/airbnb/FF5A5F' };
          case 'restaurant': return { name: 'Toast POS', icon: 'https://cdn.iconscout.com/icon/free/png-256/free-toast-3629115-3030255.png' };
          case 'ecommerce': return { name: 'Shopify', icon: 'https://cdn.simpleicons.org/shopify/96BF48' };
          case 'service': return { name: 'Mindbody', icon: 'https://cdn.simpleicons.org/mindbody/FF5A5F' }; // Placeholder color
          case 'automotive': return { name: 'ShopMonkey', icon: 'https://cdn.simpleicons.org/monkeytie/000000' }; // Placeholder
          case 'event': return { name: 'Cvent', icon: 'https://cdn.simpleicons.org/cvent/005696' };
          case 'custom': return { name: 'CRM Sync', icon: 'https://cdn.simpleicons.org/salesforce/00A1E0' };
          default: return { name: 'System', icon: 'https://cdn.simpleicons.org/zapier/FF4F00' };
      }
  };

  const integrationInfo = getIntegrationInfo();

  // Dynamic background colors based on mode
  const getBlobColor = (pos: 'top' | 'bottom') => {
      if (pos === 'top') {
          switch(selectedMode) {
              case 'restaurant': return 'bg-orange-500/20';
              case 'ecommerce': return 'bg-purple-500/20';
              case 'service': return 'bg-cyan-500/20';
              case 'automotive': return 'bg-slate-500/20';
              case 'event': return 'bg-rose-500/20';
              case 'custom': return 'bg-teal-500/20';
              default: return 'bg-indigo-500/20';
          }
      } else {
          switch(selectedMode) {
              case 'restaurant': return 'bg-red-500/20';
              case 'ecommerce': return 'bg-pink-500/20';
              case 'service': return 'bg-teal-500/20';
              case 'automotive': return 'bg-zinc-500/20';
              case 'event': return 'bg-pink-500/20';
              case 'custom': return 'bg-emerald-500/20';
              default: return 'bg-blue-500/20';
          }
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black/90 p-4 relative overflow-hidden">
        {/* Background decorative blobs */}
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] transition-colors duration-700 ${getBlobColor('top')}`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] transition-colors duration-700 ${getBlobColor('bottom')}`}></div>

        <Card className="w-full max-w-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl border border-gray-200 dark:border-gray-800 relative z-10 overflow-hidden">
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 dark:bg-gray-800">
                <div 
                    className={`h-full bg-gradient-to-r ${theme.gradient} transition-all duration-500`}
                    style={{ width: `${(step / 3) * 100}%` }}
                ></div>
            </div>

            <div className="p-8 md:p-12">
                
                {/* STEP 1: BUSINESS TYPE + MAGIC IMPORT */}
                {step === 1 && (
                    <div className="animate-slide-up">
                        <div className="text-center mb-8">
                            <div className={`w-16 h-16 ${theme.lightBg} dark:bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors`}>
                                <Briefcase className={`w-8 h-8 ${theme.text}`} />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Let's setup your workspace</h2>
                            <p className="text-gray-500 dark:text-gray-400">Choose your industry to customize the AI.</p>
                        </div>

                        {/* Magic Import Section */}
                        <div className={`mb-8 p-1 rounded-xl bg-gradient-to-r ${theme.gradient} transition-colors duration-500`}>
                            <div className="bg-white dark:bg-gray-900 rounded-lg p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <ImportIcon className={`w-5 h-5 ${theme.text}`} />
                                    <h3 className="font-bold text-gray-900 dark:text-white">{importConfig.title}</h3>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    {importConfig.desc}
                                </p>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Link className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                        <Input 
                                            placeholder={importConfig.placeholder}
                                            className="pl-9" 
                                            value={importUrl}
                                            onChange={(e) => setImportUrl(e.target.value)}
                                        />
                                    </div>
                                    <Button 
                                        onClick={handleMagicImport} 
                                        disabled={isImporting || !importUrl}
                                        className={`bg-gradient-to-r ${theme.gradient} hover:opacity-90 text-white border-0`}
                                    >
                                        {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="relative mb-8">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-200 dark:border-gray-700"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">Or Select Manually</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                            {BUSINESS_TYPES.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => handleModeSelect(type.id as AppMode)}
                                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-lg flex flex-col items-center md:items-start gap-3 ${
                                        selectedMode === type.id 
                                            ? `border-${type.color}-500 bg-${type.color}-50 dark:bg-${type.color}-900/20` 
                                            : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                                >
                                    <div className={`p-3 rounded-full transition-colors ${
                                        selectedMode === type.id 
                                            ? `bg-white dark:bg-gray-800 text-${type.color}-600 dark:text-${type.color}-400` 
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                                    }`}>
                                        <type.icon className="w-6 h-6" />
                                    </div>
                                    <div className="text-center md:text-left">
                                        <div className="font-bold text-gray-900 dark:text-white text-sm">{type.label}</div>
                                        <div className="text-[10px] text-gray-500 mt-1">{type.desc}</div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-end">
                            <Button size="lg" onClick={handleNext} className={`w-full md:w-auto ${theme.bg} ${theme.hover} text-white group`}>
                                Continue <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* STEP 2: AI PERSONA */}
                {step === 2 && (
                    <div className="animate-slide-up">
                        <div className="text-center mb-10">
                            <div className={`w-16 h-16 ${theme.lightBg} dark:bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                                <Bot className={`w-8 h-8 ${theme.text}`} />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Design your AI Agent</h2>
                            <p className="text-gray-500 dark:text-gray-400">Give your assistant a name and a personality.</p>
                        </div>

                        <div className="space-y-6 mb-8 max-w-md mx-auto">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Agent Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <Input 
                                        placeholder="e.g. Alfred, Concierge, Support Bot" 
                                        className="pl-10 h-12 text-lg" 
                                        value={aiName}
                                        onChange={(e) => setAiName(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Tone of Voice</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Friendly', 'Professional', 'Concise', 'Urgent'].map((tone) => (
                                        <div 
                                            key={tone}
                                            onClick={() => setSelectedTone(tone as any)}
                                            className={`cursor-pointer px-4 py-3 rounded-lg border flex items-center justify-between transition-all ${selectedTone === tone ? `${theme.borderStrong} ${theme.lightBg} dark:bg-opacity-20 ${theme.text} dark:${theme.text.replace('600','300')}` : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 text-gray-600 dark:text-gray-400'}`}
                                        >
                                            <span className="font-medium">{tone}</span>
                                            {selectedTone === tone && <Sparkles className="w-4 h-4" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button size="lg" onClick={handleSavePersona} className={`w-full md:w-auto ${theme.bg} ${theme.hover} text-white`}>
                                Next Step <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* STEP 3: CONNECT DATA */}
                {step === 3 && (
                    <div className="animate-slide-up">
                        <div className="text-center mb-10">
                            <div className={`w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4`}>
                                <Database className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Connect Data Source</h2>
                            <p className="text-gray-500 dark:text-gray-400">Let's import your {selectedMode === 'property' ? 'listings' : selectedMode === 'restaurant' ? 'menu and tables' : selectedMode === 'ecommerce' ? 'products' : 'services'}.</p>
                        </div>

                        <div className="max-w-md mx-auto mb-10">
                            <div className={`p-6 rounded-2xl border-2 transition-all flex items-center gap-4 ${isConnected ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center shrink-0 overflow-hidden p-2">
                                    <img src={integrationInfo.icon} alt={integrationInfo.name} className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 dark:text-white">{integrationInfo.name}</h3>
                                    <p className="text-sm text-gray-500">{isConnected ? 'Data synced successfully' : 'Recommended integration'}</p>
                                </div>
                                {isConnected ? (
                                    <div className="h-8 w-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center text-green-600">
                                        <Check className="w-5 h-5" />
                                    </div>
                                ) : (
                                    <Button onClick={handleConnect} disabled={isConnecting} size="sm" variant="outline">
                                        {isConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Connect'}
                                    </Button>
                                )}
                            </div>
                            
                            {isConnecting && (
                                <div className="mt-4 text-center text-sm text-gray-500 animate-pulse">
                                    Authenticating and syncing past 30 days of data...
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <Button 
                                size="lg" 
                                onClick={onComplete} 
                                disabled={!isConnected}
                                className={`w-full md:w-auto transition-all duration-300 ${isConnected ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/30' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                            >
                                <span className="flex items-center gap-2">
                                    {isConnected ? <Zap className="w-4 h-4 fill-current" /> : null} 
                                    Finish Setup
                                </span>
                            </Button>
                        </div>
                        {!isConnected && (
                            <div className="text-center mt-4">
                                <button onClick={onComplete} className="text-sm text-gray-400 hover:text-gray-600 underline">
                                    Skip for now
                                </button>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </Card>
    </div>
  );
};
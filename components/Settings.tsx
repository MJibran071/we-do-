
import React, { useState, useRef } from 'react';
import { AIConfig, Theme, AppMode, Apartment, KnowledgeBaseData, Restaurant, MessageTemplate, TeamMember } from '../types';
import { Sliders, Zap, Globe, UserCheck, Moon, Sun, Briefcase, Home, ShoppingBag, Building, Plus, Trash2, UtensilsCrossed, Timer, Layout, Image as ImageIcon, Paperclip, X, Sparkles, CheckCircle2, Users, User, Wrench, Heart, PartyPopper } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { getTheme } from '../utils/theme';
import { TeamManagement } from './TeamManagement';
import { api } from '../utils/api';
import { toast } from 'sonner';

interface SettingsProps {
  config: AIConfig;
  setConfig: React.Dispatch<React.SetStateAction<AIConfig>>;
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  appMode: AppMode;
  setAppMode: React.Dispatch<React.SetStateAction<AppMode>>;
  apartments: Apartment[];
  setApartments: React.Dispatch<React.SetStateAction<Apartment[]>>;
  restaurants: Restaurant[];
  setRestaurants: React.Dispatch<React.SetStateAction<Restaurant[]>>;
  setPropertyKBs: React.Dispatch<React.SetStateAction<Record<string, KnowledgeBaseData>>>;
  setRestaurantKBs: React.Dispatch<React.SetStateAction<Record<string, KnowledgeBaseData>>>;
  templates?: MessageTemplate[];
  setTemplates?: React.Dispatch<React.SetStateAction<MessageTemplate[]>>;
  teamMembers: TeamMember[];
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  currentUser: TeamMember;
  setCurrentUser: React.Dispatch<React.SetStateAction<TeamMember>>;
}

const Settings: React.FC<SettingsProps> = ({ config, setConfig, theme, setTheme, appMode, setAppMode, apartments, setApartments, restaurants, setRestaurants, setPropertyKBs, setRestaurantKBs, teamMembers, setTeamMembers, currentUser, setCurrentUser }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'team' | 'ai'>('general');
  const [newItemName, setNewItemName] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const currentTheme = getTheme(appMode);

  const handleAddApartment = () => {
      if (!newItemName.trim()) return;
      const newId = `apt-${Date.now()}`;
      const newApt: Apartment = { id: newId, name: newItemName };
      
      setApartments(prev => [...prev, newApt]);
      
      // Initialize empty KB for this apartment
      setPropertyKBs(prev => ({
          ...prev,
          [newId]: {
              generalInfo: `House rules for ${newItemName}...`,
              faqs: []
          }
      }));

      setNewItemName('');
      setIsAddingItem(false);
  };

  const handleAddRestaurant = () => {
      if (!newItemName.trim()) return;
      const newId = `rest-${Date.now()}`;
      const newRest: Restaurant = { id: newId, name: newItemName, cuisine: 'General' };
      
      setRestaurants(prev => [...prev, newRest]);
      
      // Initialize empty KB
      setRestaurantKBs(prev => ({
          ...prev,
          [newId]: {
              generalInfo: `Operational details for ${newItemName}...`,
              faqs: []
          }
      }));

      setNewItemName('');
      setIsAddingItem(false);
  };

  const handleDeleteApartment = (id: string) => {
      setApartments(prev => prev.filter(a => a.id !== id));
  };

  const handleDeleteRestaurant = (id: string) => {
      setRestaurants(prev => prev.filter(r => r.id !== id));
  };

  const applyIndustryPreset = () => {
      if (appMode === 'restaurant') {
          setConfig({ ...config, tone: 'Friendly', autoPilot: true, autoPilotDelay: 1 });
      } else if (appMode === 'property') {
          setConfig({ ...config, tone: 'Professional', autoPilot: true, autoPilotDelay: 5 });
      } else {
          setConfig({ ...config, tone: 'Concise', autoPilot: true, autoPilotDelay: 0 });
      }
  };

  const handleSaveAll = async () => {
      setIsSaving(true);
      try {
          // Persist settings to backend
          await api.put('/api/users/profile', {
              appMode,
              theme,
              config // AI Config
          }, { skipErrorHandling: true }); // Skip error handling to avoid toast on offline dev mode
          
          toast.success("Settings Saved", { description: "Configuration updated successfully." });
      } catch (error) {
          // Fallback message if backend isn't ready
          console.warn("Backend save failed, saved locally.");
          toast.success("Settings Saved Locally", { description: "Changes applied to current session." });
      } finally {
          setIsSaving(false);
      }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto h-full overflow-y-auto flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Customize your workspace and manage team access.</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6">
          <button 
              onClick={() => setActiveTab('general')}
              className={`pb-3 px-4 text-sm font-medium transition-all border-b-2 ${activeTab === 'general' ? `${currentTheme.tabBorder} ${currentTheme.tabText}` : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
          >
              General
          </button>
          <button 
              onClick={() => setActiveTab('team')}
              className={`pb-3 px-4 text-sm font-medium transition-all border-b-2 ${activeTab === 'team' ? `${currentTheme.tabBorder} ${currentTheme.tabText}` : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
          >
              Team & Roles
          </button>
          <button 
              onClick={() => setActiveTab('ai')}
              className={`pb-3 px-4 text-sm font-medium transition-all border-b-2 ${activeTab === 'ai' ? `${currentTheme.tabBorder} ${currentTheme.tabText}` : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
          >
              AI Configuration
          </button>
      </div>

      <div className="space-y-6 flex-1">
        
        {/* GENERAL TAB */}
        {activeTab === 'general' && (
            <div className="space-y-6 animate-slide-up">
                
                {/* Demo User Switcher */}
                <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-2">
                            <UserCheck className={`w-5 h-5 ${currentTheme.text}`} />
                            <CardTitle>Simulate User Role</CardTitle>
                        </div>
                        <CardDescription>Switch personas to test role-based access controls (RBAC).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                            {teamMembers.map((member) => (
                                <button
                                    key={member.id}
                                    onClick={() => setCurrentUser(member)}
                                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                                        currentUser.id === member.id 
                                            ? `${currentTheme.activeBorder} ${currentTheme.activeBg} ${currentTheme.activeBgDark} ring-1 ${currentTheme.activeRing}` 
                                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300'
                                    }`}
                                >
                                    <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full bg-gray-200" />
                                    <div className="text-left overflow-hidden">
                                        <div className="text-sm font-bold text-gray-900 dark:text-white truncate">{member.name}</div>
                                        <div className="text-xs text-gray-500">{member.role}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Business Mode Selection */}
                <Card className={`border-${currentTheme.name}-200 dark:border-${currentTheme.name}-900 ${currentTheme.lightBg}/30 dark:bg-opacity-10`}>
                <CardContent className="p-4 md:p-6 flex flex-col gap-4">
                    <div className="flex gap-4">
                        <div className={`p-3 ${currentTheme.lightBg} dark:bg-opacity-20 rounded-lg h-fit shrink-0`}>
                            <Briefcase className={`w-6 h-6 ${currentTheme.text} dark:${currentTheme.text.replace('600','400')}`} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Business Type</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                Switching modes will update the chat context and knowledge base.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 bg-white dark:bg-gray-900 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
                        <Button 
                            variant={appMode === 'property' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setAppMode('property')}
                            className={`flex-1 h-9 px-4 ${appMode === 'property' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : ''}`}
                        >
                            <Home className="w-4 h-4 mr-2" /> Property
                        </Button>
                        <Button 
                            variant={appMode === 'restaurant' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setAppMode('restaurant')}
                            className={`flex-1 h-9 px-4 ${appMode === 'restaurant' ? 'bg-orange-600 hover:bg-orange-700 text-white' : ''}`}
                        >
                            <UtensilsCrossed className="w-4 h-4 mr-2" /> Restaurant
                        </Button>
                        <Button 
                            variant={appMode === 'ecommerce' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setAppMode('ecommerce')}
                            className={`flex-1 h-9 px-4 ${appMode === 'ecommerce' ? 'bg-purple-600 hover:bg-purple-700 text-white' : ''}`}
                        >
                            <ShoppingBag className="w-4 h-4 mr-2" /> Retail
                        </Button>
                        <Button 
                            variant={appMode === 'service' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setAppMode('service')}
                            className={`flex-1 h-9 px-4 ${appMode === 'service' ? 'bg-cyan-600 hover:bg-cyan-700 text-white' : ''}`}
                        >
                            <Heart className="w-4 h-4 mr-2" /> Wellness
                        </Button>
                        <Button 
                            variant={appMode === 'automotive' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setAppMode('automotive')}
                            className={`flex-1 h-9 px-4 ${appMode === 'automotive' ? 'bg-slate-600 hover:bg-slate-700 text-white' : ''}`}
                        >
                            <Wrench className="w-4 h-4 mr-2" /> Automotive
                        </Button>
                        <Button 
                            variant={appMode === 'event' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setAppMode('event')}
                            className={`flex-1 h-9 px-4 ${appMode === 'event' ? 'bg-rose-600 hover:bg-rose-700 text-white' : ''}`}
                        >
                            <PartyPopper className="w-4 h-4 mr-2" /> Event
                        </Button>
                        <Button 
                            variant={appMode === 'custom' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setAppMode('custom')}
                            className={`flex-1 h-9 px-4 ${appMode === 'custom' ? 'bg-teal-600 hover:bg-teal-700 text-white' : ''}`}
                        >
                            <Briefcase className="w-4 h-4 mr-2" /> Custom
                        </Button>
                    </div>
                </CardContent>
                </Card>

                {/* Location/Unit Management Section */}
                {(appMode === 'property' || appMode === 'restaurant') && (
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2">
                                <Building className={`w-5 h-5 ${currentTheme.text}`} />
                                <CardTitle>{appMode === 'property' ? 'Properties & Units' : 'Restaurant Locations'}</CardTitle>
                            </div>
                            <CardDescription>Manage the list of {appMode === 'property' ? 'apartments or units' : 'restaurants/branches'} you manage.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {(appMode === 'property' ? apartments : restaurants).map(item => (
                                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-white dark:bg-gray-900 rounded flex items-center justify-center border border-gray-200 dark:border-gray-700">
                                                {appMode === 'property' ? <Home className="w-4 h-4 text-gray-500" /> : <UtensilsCrossed className="w-4 h-4 text-gray-500" />}
                                            </div>
                                            <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500" onClick={() => appMode === 'property' ? handleDeleteApartment(item.id) : handleDeleteRestaurant(item.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                
                                {isAddingItem ? (
                                    <div className={`flex items-center gap-2 p-2 ${currentTheme.lightBg} dark:bg-opacity-20 rounded-lg`}>
                                        <Input 
                                            placeholder={appMode === 'property' ? "e.g. Seaside Villa Unit 1" : "e.g. Downtown Branch"} 
                                            className="bg-white dark:bg-gray-900"
                                            value={newItemName}
                                            onChange={(e) => setNewItemName(e.target.value)}
                                        />
                                        <Button size="sm" onClick={appMode === 'property' ? handleAddApartment : handleAddRestaurant} className={`${currentTheme.bg} ${currentTheme.hover} text-white`}>Save</Button>
                                        <Button size="sm" variant="ghost" onClick={() => setIsAddingItem(false)}>Cancel</Button>
                                    </div>
                                ) : (
                                    <Button variant="outline" className="w-full border-dashed" onClick={() => setIsAddingItem(true)}>
                                        <Plus className="w-4 h-4 mr-2" /> Add {appMode === 'property' ? 'Property' : 'Location'}
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Appearance */}
                <Card>
                <CardContent className="p-4 md:p-6 flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg h-fit shrink-0">
                            {theme === 'light' ? <Sun className="w-6 h-6 text-amber-500" /> : <Moon className="w-6 h-6 text-indigo-400" />}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Switch between light and dark mode.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
                        <Button 
                            variant="ghost"
                            size="sm"
                            onClick={() => setTheme('light')}
                            className={`h-8 px-3 ${theme === 'light' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                        >
                            <Sun className="w-4 h-4 mr-2" /> Light
                        </Button>
                        <Button 
                            variant="ghost"
                            size="sm"
                            onClick={() => setTheme('dark')}
                            className={`h-8 px-3 ${theme === 'dark' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                        >
                            <Moon className="w-4 h-4 mr-2" /> Dark
                        </Button>
                    </div>
                </CardContent>
                </Card>
            </div>
        )}

        {/* TEAM TAB */}
        {activeTab === 'team' && (
            <TeamManagement 
                teamMembers={teamMembers} 
                setTeamMembers={setTeamMembers} 
                appMode={appMode} 
            />
        )}

        {/* AI CONFIG TAB */}
        {activeTab === 'ai' && (
            <div className="animate-slide-up">
                <Card className={`overflow-hidden border-${currentTheme.name}-200 dark:border-${currentTheme.name}-900 shadow-sm`}>
                <CardHeader className={`${currentTheme.lightBg}/50 dark:bg-opacity-20 border-b border-${currentTheme.name}-100 dark:border-${currentTheme.name}-900/50`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sparkles className={`w-5 h-5 ${currentTheme.text}`} />
                            <CardTitle>AI Assistant Configuration</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-7 text-xs border-dashed" onClick={applyIndustryPreset}>
                                Auto-Configure for {appMode}
                            </Button>
                            {config.autoPilot && <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">Active</span>}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-8">
                    
                    {/* Auto-Pilot Toggle Section */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-4">
                            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg h-fit shrink-0">
                                <Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Auto-Pilot Mode</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-lg">
                                    Automatically reply to "Low Priority" and "Routine" inquiries using the selected tone.
                                </p>
                            </div>
                        </div>
                        
                        {/* Custom Toggle Switch */}
                        <button 
                            onClick={() => setConfig({...config, autoPilot: !config.autoPilot})}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:${currentTheme.ring} focus:ring-offset-2 ${config.autoPilot ? currentTheme.bg : 'bg-gray-200 dark:bg-gray-700'}`}
                        >
                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out ${config.autoPilot ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    {/* Configuration Options */}
                    <div className={`space-y-6 transition-opacity duration-300 ${config.autoPilot ? 'opacity-100' : 'opacity-60'}`}>
                        
                        {/* Reply Delay */}
                        <div className="md:ml-14 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <Timer className={`w-4 h-4 ${currentTheme.text.replace('600', '500')}`} />
                                    <label className="text-sm font-medium text-gray-900 dark:text-white">Reply Delay</label>
                                </div>
                                <span className={`text-sm font-bold ${currentTheme.text} ${currentTheme.lightBg} border ${currentTheme.border} px-2 py-1 rounded shadow-sm dark:bg-opacity-20`}>
                                    {config.autoPilotDelay} minutes
                                </span>
                            </div>
                            <input 
                                type="range" 
                                min="1" 
                                max="60" 
                                step="1"
                                disabled={!config.autoPilot}
                                value={config.autoPilotDelay} 
                                onChange={(e) => setConfig({...config, autoPilotDelay: parseInt(e.target.value)})}
                                className={`w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-${currentTheme.name}-600`}
                            />
                            <div className="flex justify-between text-[10px] text-gray-400 mt-2 uppercase tracking-wide">
                                <span>Instant (1m)</span>
                                <span>Standard (5m)</span>
                                <span>Relaxed (60m)</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 dark:border-gray-800"></div>

                        {/* Tone & Voice Section */}
                        <div className="flex gap-4">
                            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg h-fit shrink-0">
                                <Sliders className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="w-full">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tone & Voice</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">Define the personality of the AI generated drafts.</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {['Friendly', 'Professional', 'Concise'].map((tone) => (
                                        <button
                                            key={tone}
                                            onClick={() => setConfig({...config, tone: tone as any})}
                                            className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                                                config.tone === tone 
                                                    ? `border-${currentTheme.name}-600 ${currentTheme.lightBg} dark:bg-opacity-30 ${currentTheme.text} dark:${currentTheme.text.replace('600','300')} shadow-sm` 
                                                    : `border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:border-${currentTheme.name}-200`
                                            }`}
                                        >
                                            <span className="font-medium">{tone}</span>
                                            {config.tone === tone && <CheckCircle2 className="w-4 h-4 ml-2" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
                </Card>
            </div>
        )}

        <div className="flex justify-end pt-4 gap-3 border-t border-gray-100 dark:border-gray-800 mt-4">
            <Button size="lg" onClick={handleSaveAll} disabled={isSaving} className={`shadow-lg shadow-${currentTheme.name}-500/20 ${currentTheme.bg} ${currentTheme.hover} text-white`}>
                {isSaving ? "Saving..." : "Save Changes"}
            </Button>
        </div>

      </div>
    </div>
  );
};

export default Settings;

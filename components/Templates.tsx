
import React, { useState, useRef, useEffect } from 'react';
import { MessageTemplate, AppMode, Apartment, Restaurant } from '../types';
import { LayoutTemplate, Plus, Trash2, Image as ImageIcon, Paperclip, X, Search, Building, UtensilsCrossed, ShoppingBag, Globe, Tag, Check, Heart, Wrench, PartyPopper } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { getTheme } from '../utils/theme';

interface TemplatesProps {
  appMode: AppMode;
  apartments: Apartment[];
  restaurants: Restaurant[];
  templates: MessageTemplate[];
  setTemplates: React.Dispatch<React.SetStateAction<MessageTemplate[]>>;
}

const getCategories = (mode: AppMode) => {
    switch(mode) {
        case 'restaurant': return ['Reservation', 'Menu Info', 'Dietary', 'Events', 'Directions', 'Hours', 'Parking'];
        case 'ecommerce': return ['Order Status', 'Shipping', 'Returns', 'Product Info', 'Stock Check', 'Payment'];
        case 'service': return ['Appointment', 'Pre-care', 'Post-care', 'Cancellation', 'Location', 'Pricing'];
        case 'automotive': return ['Quote', 'Status Update', 'Warranty', 'Pickup', 'General'];
        case 'event': return ['Vendor Info', 'Directions', 'Capacity', 'Pricing', 'Availability'];
        case 'property': 
        default: return ['Check-in', 'Check-out', 'House Rules', 'Wifi', 'Directions', 'Recommendations', 'Emergency', 'General'];
    }
};

const Templates: React.FC<TemplatesProps> = ({ appMode, apartments, restaurants, templates, setTemplates }) => {
  const theme = getTheme(appMode);
  const categories = getCategories(appMode);
  const [selectedEntityId, setSelectedEntityId] = useState<string>('global');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingTemplate, setIsAddingTemplate] = useState(false);
  
  // Form State
  const [newTemplate, setNewTemplate] = useState<Partial<MessageTemplate>>({});
  const [createTargetId, setCreateTargetId] = useState<string>('global');
  
  const templateFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      if (isAddingTemplate) {
          setCreateTargetId(selectedEntityId);
      }
  }, [isAddingTemplate, selectedEntityId]);

  const handleSaveTemplate = () => {
      if (!newTemplate.title || !newTemplate.content) return;
      
      const template: MessageTemplate = {
          id: `tmp-${Date.now()}`,
          title: newTemplate.title,
          content: newTemplate.content,
          category: newTemplate.category || 'General',
          imageUrls: newTemplate.imageUrls || [],
          entityId: createTargetId === 'global' ? undefined : createTargetId
      };
      
      setTemplates(prev => [...prev, template]);
      setNewTemplate({});
      setIsAddingTemplate(false);
  };

  const handleDeleteTemplate = (id: string) => {
      setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const handleTemplateFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          const newUrls = Array.from(e.target.files).map(file => URL.createObjectURL(file as Blob));
          setNewTemplate(prev => ({
              ...prev,
              imageUrls: [...(prev.imageUrls || []), ...newUrls]
          }));
      }
      if (templateFileInputRef.current) templateFileInputRef.current.value = '';
  };

  const removeNewTemplateImage = (index: number) => {
      setNewTemplate(prev => ({
          ...prev,
          imageUrls: prev.imageUrls?.filter((_, i) => i !== index)
      }));
  };

  const filteredTemplates = templates.filter(t => {
      // Filter by Entity (View Mode)
      const matchEntity = selectedEntityId === 'global' 
          ? !t.entityId // Show only global templates
          : t.entityId === selectedEntityId; // Show specific property templates

      // Filter by Search
      const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchEntity && matchSearch;
  });

  const getEntityLabel = () => {
      switch(appMode) {
          case 'property': return 'Properties';
          case 'restaurant': return 'Restaurants';
          case 'service': return 'Locations / Clinics';
          case 'automotive': return 'Shops / Garages';
          case 'event': return 'Venues';
          default: return 'Locations';
      }
  };

  const getIcon = () => {
      switch(appMode) {
          case 'property': return <Building className={`w-6 h-6 ${theme.text}`} />;
          case 'restaurant': return <UtensilsCrossed className={`w-6 h-6 ${theme.text}`} />;
          case 'ecommerce': return <ShoppingBag className={`w-6 h-6 ${theme.text}`} />;
          case 'service': return <Heart className={`w-6 h-6 ${theme.text}`} />;
          case 'automotive': return <Wrench className={`w-6 h-6 ${theme.text}`} />;
          case 'event': return <PartyPopper className={`w-6 h-6 ${theme.text}`} />;
          default: return <Globe className="w-6 h-6 text-gray-500" />;
      }
  };

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Message Templates</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Create canned responses with images for specific contexts.</p>
        </div>
        
        {/* View Context Selector */}
        <div className="flex items-center gap-2 bg-white dark:bg-gray-900 p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm min-w-[250px]">
             <span className="text-xs font-medium text-gray-500 dark:text-gray-400 pl-2 uppercase tracking-wide">View:</span>
             <div className="relative flex-1">
                 <select 
                    className="h-9 w-full text-sm bg-transparent text-gray-900 dark:text-white border-0 rounded-md focus:ring-0 pl-2 pr-8 font-medium cursor-pointer"
                    value={selectedEntityId}
                    onChange={(e) => { setSelectedEntityId(e.target.value); setIsAddingTemplate(false); }}
                 >
                     <option value="global">Global Templates</option>
                     {appMode !== 'ecommerce' && (
                         <optgroup label={getEntityLabel()}>
                            {appMode === 'property' 
                                ? apartments.map(apt => (<option key={apt.id} value={apt.id}>{apt.name}</option>))
                                : restaurants.map(rest => (<option key={rest.id} value={rest.id}>{rest.name}</option>))
                            }
                            {/* Fallback for other modes if they used the shared arrays or empty */}
                            {(appMode !== 'property' && appMode !== 'restaurant') && restaurants.map(rest => (<option key={rest.id} value={rest.id}>{rest.name}</option>))}
                         </optgroup>
                     )}
                 </select>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Templates List */}
        <div className="lg:col-span-2 space-y-6">
            
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <Input 
                        placeholder="Search templates..." 
                        className="pl-9 bg-white dark:bg-gray-900"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button onClick={() => { setIsAddingTemplate(true); setNewTemplate({}); }} className={`${theme.bg} ${theme.hover} text-white`}>
                    <Plus className="w-4 h-4 mr-2" /> Create Template
                </Button>
            </div>

            {isAddingTemplate && (
                <Card className={`bg-white dark:bg-gray-900 border-2 ${theme.border} dark:border-opacity-50 shadow-lg animate-scale-in relative overflow-hidden`}>
                    <div className={`absolute top-0 left-0 w-1 h-full ${theme.bg}`}></div>
                    <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <LayoutTemplate className={`w-5 h-5 ${theme.text}`} /> New Response Template
                            </CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setIsAddingTemplate(false)}><X className="w-4 h-4" /></Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-5 pt-5">
                        
                        {/* Assign To */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Assign To</label>
                            <select 
                                className={`flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 ${theme.ring} disabled:cursor-not-allowed disabled:opacity-50`}
                                value={createTargetId}
                                onChange={(e) => setCreateTargetId(e.target.value)}
                            >
                                <option value="global">Global (Available everywhere)</option>
                                {appMode !== 'ecommerce' && (
                                    <optgroup label={`Specific ${getEntityLabel().slice(0, -1)}`}>
                                        {appMode === 'property' 
                                            ? apartments.map(apt => (<option key={apt.id} value={apt.id}>{apt.name}</option>))
                                            : restaurants.map(rest => (<option key={rest.id} value={rest.id}>{rest.name}</option>))
                                        }
                                    </optgroup>
                                )}
                            </select>
                        </div>

                        <Input 
                            placeholder="Template Title (e.g. Late Check-in Instructions)" 
                            className="text-base font-medium border-gray-200 dark:border-gray-700"
                            value={newTemplate.title || ''}
                            onChange={e => setNewTemplate({...newTemplate, title: e.target.value})}
                        />

                        {/* Categories */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Category</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setNewTemplate({...newTemplate, category: cat})}
                                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors border ${
                                            newTemplate.category === cat 
                                                ? `${theme.lightBg} ${theme.text} ${theme.border} dark:bg-opacity-20` 
                                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                            <div className="relative">
                                <Tag className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                <Input 
                                    placeholder="Or type custom category..." 
                                    className="pl-9 h-9 text-sm"
                                    value={newTemplate.category || ''}
                                    onChange={e => setNewTemplate({...newTemplate, category: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase">Attachments</label>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="h-8 text-xs border-dashed"
                                    onClick={() => templateFileInputRef.current?.click()}
                                >
                                    <Paperclip className="w-3 h-3 mr-2" /> Add Images
                                </Button>
                                <input 
                                    type="file" 
                                    ref={templateFileInputRef}
                                    onChange={handleTemplateFileUpload}
                                    className="hidden"
                                    multiple
                                    accept="image/*"
                                />
                            </div>
                            
                            {newTemplate.imageUrls && newTemplate.imageUrls.length > 0 ? (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                                    {newTemplate.imageUrls.map((url, i) => (
                                        <div key={i} className="relative aspect-square group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50">
                                            <img src={url} className="w-full h-full object-cover" alt="preview" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button 
                                                    onClick={() => removeNewTemplateImage(i)}
                                                    className="bg-red-500 text-white p-1.5 rounded-full hover:scale-110 transition-transform"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-xs text-gray-400 italic mb-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded text-center border border-dashed border-gray-200 dark:border-gray-700">
                                    No images attached. Useful for maps, menus, or visual guides.
                                </div>
                            )}
                        </div>

                        <Textarea 
                            placeholder="Type the message content here..." 
                            className="min-h-[150px] text-sm resize-none"
                            value={newTemplate.content || ''}
                            onChange={e => setNewTemplate({...newTemplate, content: e.target.value})}
                        />
                        
                        <div className="flex justify-end gap-3 pt-2">
                            <Button variant="ghost" onClick={() => { setIsAddingTemplate(false); setNewTemplate({}); }}>Cancel</Button>
                            <Button onClick={handleSaveTemplate} className={`${theme.bg} ${theme.hover} text-white`}>
                                <Check className="w-4 h-4 mr-2" /> Save Template
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTemplates.length === 0 && !isAddingTemplate ? (
                    <div className="col-span-2 text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                        <LayoutTemplate className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No templates found</h3>
                        <p className="text-gray-500 text-sm mt-1">Create canned responses for faster communication.</p>
                        <Button variant="link" onClick={() => setIsAddingTemplate(true)} className={`mt-2 ${theme.text}`}>Create your first template</Button>
                    </div>
                ) : (
                    filteredTemplates.map(tpl => (
                        <Card key={tpl.id} className="group hover:shadow-md transition-all border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                            <CardContent className="p-5 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 ${theme.lightBg} dark:bg-opacity-20 rounded-lg ${theme.text} dark:${theme.text.replace('600', '400')} shrink-0`}>
                                            <LayoutTemplate className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate pr-2">{tpl.title}</h3>
                                            <Badge variant="secondary" className="text-[10px] h-5 px-1.5 mt-0.5 font-normal bg-gray-100 dark:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-700">
                                                {tpl.category}
                                            </Badge>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity -mr-2 -mt-2" onClick={() => handleDeleteTemplate(tpl.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                                
                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 flex-1 whitespace-pre-wrap leading-relaxed">
                                    {tpl.content}
                                </p>

                                {tpl.imageUrls && tpl.imageUrls.length > 0 && (
                                    <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800">
                                        <div className="flex gap-2 overflow-x-auto pb-1">
                                            {tpl.imageUrls.slice(0, 3).map((url, i) => (
                                                <img key={i} src={url} className="w-10 h-10 rounded-md object-cover border border-gray-200 dark:border-gray-700 shrink-0" />
                                            ))}
                                            {tpl.imageUrls.length > 3 && (
                                                <div className="w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs text-gray-500 border border-gray-200 dark:border-gray-700 shrink-0">
                                                    +{tpl.imageUrls.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
            <Card className={`${theme.lightBg} border-${theme.name}-100 dark:bg-opacity-20 dark:border-opacity-30`}>
                <CardHeader>
                    <CardTitle className={`${theme.text} dark:${theme.text.replace('600','200')} text-base`}>Best Practices</CardTitle>
                </CardHeader>
                <CardContent className={`text-sm ${theme.text} dark:${theme.text.replace('600','300')} space-y-3`}>
                    <p><strong>Scope:</strong> Use "Global" for general greetings. Use specific {getEntityLabel().toLowerCase()} templates for unique instructions.</p>
                    <p><strong>Visuals:</strong> Attach photos of menus, maps, or guides to reduce questions.</p>
                    <p><strong>Smart AI:</strong> The AI assistant automatically pulls these templates when drafting if the context matches.</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Current View</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center shrink-0">
                            {selectedEntityId === 'global' ? <Globe className="w-6 h-6 text-gray-500" /> : getIcon()}
                        </div>
                        <div className="overflow-hidden">
                            <div className="font-medium text-gray-900 dark:text-white truncate" title={selectedEntityId === 'global' ? 'Global Templates' : apartments.find(a=>a.id === selectedEntityId)?.name || restaurants.find(r=>r.id === selectedEntityId)?.name}>
                                {selectedEntityId === 'global' ? 'Global Templates' : 
                                 apartments.find(a=>a.id === selectedEntityId)?.name || 
                                 restaurants.find(r=>r.id === selectedEntityId)?.name}
                            </div>
                            <div className="text-xs text-gray-500">
                                {filteredTemplates.length} active templates
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

      </div>
    </div>
  );
};

export default Templates;

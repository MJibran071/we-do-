
import React, { useState, useEffect, useRef } from 'react';
import { KnowledgeBaseData, FAQ, AppMode, Apartment, Restaurant } from '../types';
import { Plus, Trash2, Save, BookOpen, AlertCircle, Home, ShoppingBag, UtensilsCrossed, FileUp, FileText, Loader2, CheckCircle2, Search, Pencil, X, Wrench, Heart, PartyPopper, Briefcase, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { ingestDocument } from '../services/geminiService';
import { getTheme } from '../utils/theme';
import { socket } from '../services/socketService';
import { toast } from 'sonner';
import { logger } from '../utils/logger';

interface KnowledgeBaseProps {
  appMode: AppMode;
  apartments: Apartment[];
  restaurants: Restaurant[];
  propertyKBs: Record<string, KnowledgeBaseData>;
  setPropertyKBs: React.Dispatch<React.SetStateAction<Record<string, KnowledgeBaseData>>>;
  restaurantKBs: Record<string, KnowledgeBaseData>;
  setRestaurantKBs: React.Dispatch<React.SetStateAction<Record<string, KnowledgeBaseData>>>;
  ecommerceKB: KnowledgeBaseData;
  setEcommerceKB: React.Dispatch<React.SetStateAction<KnowledgeBaseData>>;
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ appMode, apartments, restaurants, propertyKBs, setPropertyKBs, restaurantKBs, setRestaurantKBs, ecommerceKB, setEcommerceKB }) => {
  const theme = getTheme(appMode);
  const [selectedEntityId, setSelectedEntityId] = useState<string>('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  
  // Edit State
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  
  // PDF Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [ingestionStatus, setIngestionStatus] = useState<string | null>(null);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      if (appMode === 'property' && apartments.length > 0) {
          setSelectedEntityId(apartments[0].id);
      } else if (appMode === 'restaurant' && restaurants.length > 0) {
          setSelectedEntityId(restaurants[0].id);
      }
  }, [appMode, apartments, restaurants]);

  // Listen for job completion
  useEffect(() => {
      if (!socket.connected) socket.connect();

      const handleJobComplete = (job: any) => {
          if (job.id === activeJobId && job.type === 'ingest_document') {
              setIsUploading(false);
              setIngestionStatus('Completed');
              setActiveJobId(null);
              toast.success("Document Ingested", { 
                  description: `Successfully processed ${job.result?.chunksProcessed || 'new'} segments.` 
              });
              
              // Refresh generic KB reload if we were fetching from backend
              // For this demo, we just notify
          }
      };

      socket.on('job_completed', handleJobComplete);
      return () => { socket.off('job_completed', handleJobComplete); };
  }, [activeJobId]);

  // Helper to get currently active KB
  const activeKB = appMode === 'property' 
      ? (propertyKBs[selectedEntityId] || { generalInfo: '', faqs: [] }) 
      : appMode === 'restaurant' 
        ? (restaurantKBs[selectedEntityId] || { generalInfo: '', faqs: [] })
        : ecommerceKB;

  const updateKB = (newData: KnowledgeBaseData) => {
      if (appMode === 'property') {
          setPropertyKBs(prev => ({
              ...prev,
              [selectedEntityId]: newData
          }));
      } else if (appMode === 'restaurant') {
          setRestaurantKBs(prev => ({
              ...prev,
              [selectedEntityId]: newData
          }));
      } else {
          setEcommerceKB(newData);
      }
  };

  const handleAddFAQ = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    
    const newFAQ: FAQ = {
      id: Date.now().toString(),
      question: newQuestion,
      answer: newAnswer
    };

    updateKB({
      ...activeKB,
      faqs: [...activeKB.faqs, newFAQ]
    });
    
    setNewQuestion('');
    setNewAnswer('');
  };

  const handleDeleteFAQ = (id: string) => {
    updateKB({
      ...activeKB,
      faqs: activeKB.faqs.filter(f => f.id !== id)
    });
  };

  const startEditing = (faq: FAQ) => {
      setEditingFaqId(faq.id);
      setEditQuestion(faq.question);
      setEditAnswer(faq.answer);
  };

  const cancelEditing = () => {
      setEditingFaqId(null);
      setEditQuestion('');
      setEditAnswer('');
  };

  const saveEdit = () => {
      if (!editingFaqId || !editQuestion.trim() || !editAnswer.trim()) return;
      
      updateKB({
          ...activeKB,
          faqs: activeKB.faqs.map(f => f.id === editingFaqId ? { ...f, question: editQuestion, answer: editAnswer } : f)
      });
      
      cancelEditing();
  };

  const handleGeneralInfoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateKB({
      ...activeKB,
      generalInfo: e.target.value
    });
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      setIngestionStatus('Uploading...');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', appMode);

      try {
          const result = await ingestDocument(formData);
          if (result.success && result.jobId) {
              setIngestionStatus('Processing with Gemini...');
              setActiveJobId(result.jobId);
          } else {
              throw new Error('Upload failed');
          }
      } catch (error) {
          logger.error("Ingestion failed", error);
          setIsUploading(false);
          setIngestionStatus('Failed');
          toast.error("Upload failed", { description: "Could not ingest document." });
      } finally {
          if (fileInputRef.current) fileInputRef.current.value = '';
      }
  };

  // --- Industry Specific Configuration ---
  const getKBConfig = () => {
      switch (appMode) {
          case 'property':
              return {
                  generalLabel: "House Rules & Access Info",
                  placeholder: "e.g., Check-in is after 3PM. Quiet hours 10PM-8AM. Pool code 1234. Trash pick-up is Tuesday.",
                  tips: ["Access: Clearly state keybox or smart lock instructions.", "Wifi: Add network name and password.", "Emergency: List local emergency contacts."],
                  icon: Home,
                  questionPlaceholder: "e.g., Where do I park?"
              };
          case 'restaurant':
              return {
                  generalLabel: "Menu & Dining Policies",
                  placeholder: "e.g., Kitchen closes at 9:30 PM. We do not split checks for groups > 6. Happy Hour is 4-6 PM.",
                  tips: ["Dietary: List common allergens handled in kitchen.", "Reservations: State holding time (e.g. 15 mins).", "Parking: Mention valet cost or nearby garages."],
                  icon: UtensilsCrossed,
                  questionPlaceholder: "e.g., Do you have gluten-free pasta?"
              };
          case 'ecommerce':
              return {
                  generalLabel: "Store Policies (Shipping & Returns)",
                  placeholder: "e.g., Free shipping over $50. 30-day return window. International shipping via DHL.",
                  tips: ["Returns: Be specific about 'unworn' or 'original tags'.", "Shipping: List estimated days for standard vs express.", "Support: Hours of operation."],
                  icon: ShoppingBag,
                  questionPlaceholder: "e.g., How do I track my order?"
              };
          case 'service':
              return {
                  generalLabel: "Treatment Protocols & Cancellation",
                  placeholder: "e.g., Please arrive 15 mins early for intake. 24h notice required for cancellation.",
                  tips: ["Prep: What should clients wear or do before arrival?", "Late Policy: Grace period before rescheduling.", "Payment: Deposits required?"],
                  icon: Heart,
                  questionPlaceholder: "e.g., Do you accept insurance?"
              };
          case 'automotive':
              return {
                  generalLabel: "Warranty & Service Rates",
                  placeholder: "e.g., $120/hr labor rate. 12-month/12k mile warranty on parts. Loaner cars available.",
                  tips: ["Warranty: What is covered vs not covered?", "Pickup: After-hours key drop process.", "Estimates: Are diagnostic fees applied to repair?"],
                  icon: Wrench,
                  questionPlaceholder: "e.g., Is the diagnostic fee refundable?"
              };
          case 'event':
              return {
                  generalLabel: "Venue Specs & Vendor Rules",
                  placeholder: "e.g., Max capacity 200. Load-in via back alley. No open flames allowed.",
                  tips: ["Vendors: Insurance requirements for caterers.", "Noise: Curfew times for loud music.", "Decor: What can/cannot be hung on walls."],
                  icon: PartyPopper,
                  questionPlaceholder: "e.g., Can we bring our own alcohol?"
              };
          default:
              return {
                  generalLabel: "General Business Info",
                  placeholder: "e.g., Business hours, contact info, core services.",
                  tips: ["Be concise.", "Update regularly."],
                  icon: Briefcase,
                  questionPlaceholder: "e.g., What are your hours?"
              };
      }
  };

  const config = getKBConfig();

  const filteredFAQs = activeKB.faqs.filter(f => 
    f.question.toLowerCase().includes(faqSearchQuery.toLowerCase()) || 
    f.answer.toLowerCase().includes(faqSearchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Knowledge Base</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Teach the AI about your business rules and policies.</p>
        </div>
        
        {/* Context Selector or Badge */}
        {appMode === 'property' || appMode === 'restaurant' ? (
             <div className="flex items-center gap-2 bg-white dark:bg-gray-900 p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                 <span className="text-xs font-medium text-gray-500 dark:text-gray-400 pl-2">Editing for:</span>
                 <select 
                    className={`h-8 text-sm ${theme.lightBg} dark:bg-opacity-20 ${theme.text} dark:${theme.text.replace('600','300')} border-0 rounded-md focus:ring-0 px-3 pr-8 font-medium cursor-pointer`}
                    value={selectedEntityId}
                    onChange={(e) => setSelectedEntityId(e.target.value)}
                 >
                     {appMode === 'property' 
                        ? apartments.map(apt => (<option key={apt.id} value={apt.id}>{apt.name}</option>))
                        : restaurants.map(rest => (<option key={rest.id} value={rest.id}>{rest.name}</option>))
                     }
                 </select>
             </div>
        ) : (
            <Badge className={`${theme.lightBg} ${theme.text} dark:bg-opacity-20 border-0 px-3 py-1.5 text-sm flex items-center gap-2`}>
                <config.icon className="w-4 h-4" /> Brand Standard (Global)
            </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* PDF Import Card */}
          <Card className={`bg-gradient-to-r ${theme.softHex} to-white dark:bg-opacity-20 dark:to-gray-900 border-${theme.name}-100 dark:border-gray-800 overflow-hidden`}>
             <CardHeader>
                 <div className="flex items-center gap-2">
                     <FileUp className={`w-5 h-5 ${theme.text}`} />
                     <CardTitle>Import from Document</CardTitle>
                 </div>
                 <CardDescription>
                     Upload a PDF ({appMode === 'property' ? 'House Manual' : appMode === 'restaurant' ? 'Employee Handbook' : 'Policy Doc'}) and our AI will automatically extract Q&A pairs.
                 </CardDescription>
             </CardHeader>
             <CardContent>
                 <div className="flex items-center gap-4">
                     <div className="relative flex-1">
                         <input 
                             type="file" 
                             accept=".pdf" 
                             ref={fileInputRef}
                             onChange={handlePdfUpload}
                             disabled={isUploading}
                             className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:${theme.lightBg} file:${theme.text} hover:file:bg-opacity-80 dark:file:bg-opacity-30 cursor-pointer disabled:opacity-50`}
                         />
                     </div>
                     {isUploading ? (
                         <div className={`flex items-center gap-2 text-sm ${theme.text} animate-pulse font-medium`}>
                             <Loader2 className="w-4 h-4 animate-spin" /> {ingestionStatus || 'Uploading...'}
                         </div>
                     ) : ingestionStatus === 'Completed' ? (
                         <div className="flex items-center gap-2 text-sm text-green-600 animate-in fade-in slide-in-from-bottom-2 font-medium">
                             <CheckCircle2 className="w-4 h-4" /> Processed!
                         </div>
                     ) : ingestionStatus === 'Failed' ? (
                         <div className="flex items-center gap-2 text-sm text-red-500 font-medium">
                             <AlertCircle className="w-4 h-4" /> Failed
                         </div>
                     ) : null}
                 </div>
                 {activeJobId && isUploading && (
                     <div className="mt-2 w-full bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                         <div className={`h-full ${theme.bg} animate-progress-indeterminate`}></div>
                     </div>
                 )}
             </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className={`w-5 h-5 ${theme.text}`} />
                <CardTitle>{config.generalLabel}</CardTitle>
              </div>
              <CardDescription>
                Free-text context for the AI. Paste your policies, rules, or operational details here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                value={activeKB.generalInfo}
                onChange={handleGeneralInfoChange}
                placeholder={config.placeholder}
                className="min-h-[200px] text-base leading-relaxed"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className={`w-5 h-5 ${theme.text}`} />
                    <CardTitle>Specific Q&A (FAQs)</CardTitle>
                </div>
                <CardDescription>
                    Add specific questions. The AI will prioritize these answers over general info.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Search Bar */}
              <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <Input 
                    placeholder="Search FAQs..." 
                    className="pl-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                    value={faqSearchQuery}
                    onChange={(e) => setFaqSearchQuery(e.target.value)}
                  />
              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {filteredFAQs.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
                        {faqSearchQuery ? "No matching FAQs found." : "No FAQs added yet."}
                    </div>
                ) : (
                    filteredFAQs.map((faq) => (
                    <div key={faq.id} className={`p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 relative group hover:shadow-sm transition-all ${editingFaqId === faq.id ? `ring-2 ring-${theme.name}-500 bg-white dark:bg-gray-900` : ''}`}>
                        
                        {editingFaqId === faq.id ? (
                            <div className="space-y-3">
                                <Input 
                                    value={editQuestion} 
                                    onChange={(e) => setEditQuestion(e.target.value)} 
                                    className="font-semibold"
                                    placeholder="Question"
                                />
                                <Textarea 
                                    value={editAnswer} 
                                    onChange={(e) => setEditAnswer(e.target.value)}
                                    placeholder="Answer"
                                    className="text-sm min-h-[80px]"
                                />
                                <div className="flex justify-end gap-2">
                                    <Button size="sm" variant="ghost" onClick={cancelEditing} className="h-8">Cancel</Button>
                                    <Button size="sm" onClick={saveEdit} className={`h-8 ${theme.bg} ${theme.hover} text-white`}>Save Changes</Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => startEditing(faq)}
                                        className={`p-1.5 text-gray-400 hover:${theme.text} hover:${theme.lightBg} dark:hover:bg-gray-700 rounded transition-colors`}
                                        title="Edit"
                                    >
                                        <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteFAQ(faq.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 rounded transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1 pr-16 text-sm flex items-start gap-2">
                                    <span className={`${theme.text} font-bold`}>Q:</span> {faq.question}
                                </h4>
                                <p className="text-gray-600 dark:text-gray-300 text-sm flex items-start gap-2 pl-0.5">
                                    <span className="text-gray-400 font-bold">A:</span> {faq.answer}
                                </p>
                            </>
                        )}
                    </div>
                    ))
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add New FAQ
                </h4>
                <div className="space-y-3">
                  <Input 
                    placeholder={config.questionPlaceholder}
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                  />
                  <Textarea 
                    placeholder="Answer..." 
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <Button onClick={handleAddFAQ} className={`w-full ${theme.bg} ${theme.hover} text-white`} disabled={!newQuestion.trim() || !newAnswer.trim()}>
                    <Plus className="w-4 h-4 mr-2" /> Add to Knowledge Base
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Help */}
        <div className="space-y-6">
          <Card className={`${theme.lightBg} border-${theme.name}-100 dark:bg-opacity-20 dark:border-opacity-30 border`}>
            <CardHeader>
              <CardTitle className={`${theme.text} dark:${theme.text.replace('600', '200')} text-lg`}>Tips for {appMode === 'property' ? 'Hosts' : appMode === 'restaurant' ? 'Restaurants' : 'Managers'}</CardTitle>
            </CardHeader>
            <CardContent className={`text-sm ${theme.text} dark:${theme.text.replace('600', '300')} space-y-3`}>
              {config.tips.map((tip, i) => (
                  <p key={i}><strong>{i + 1}.</strong> {tip}</p>
              ))}
              <div className={`mt-4 p-3 bg-white dark:bg-black/20 rounded-lg border border-${theme.name}-200 dark:border-${theme.name}-900`}>
                  <p className="font-bold mb-1 text-xs uppercase">Current Context</p>
                  <p className="truncate">
                      {appMode === 'property' 
                        ? apartments.find(a => a.id === selectedEntityId)?.name 
                        : appMode === 'restaurant'
                            ? restaurants.find(r => r.id === selectedEntityId)?.name
                            : 'Global / Brand Standard'
                      }
                  </p>
              </div>
            </CardContent>
          </Card>

          <Card>
             <CardHeader>
                 <CardTitle className="text-base">Data Overview</CardTitle>
             </CardHeader>
             <CardContent>
                 <div className="space-y-4">
                     <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                         <span className="text-sm text-gray-500 dark:text-gray-400">Context Length</span>
                         <span className="font-medium text-gray-900 dark:text-white">{activeKB.generalInfo.length} chars</span>
                     </div>
                     <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                         <span className="text-sm text-gray-500 dark:text-gray-400">Total FAQs</span>
                         <span className="font-medium text-gray-900 dark:text-white">{activeKB.faqs.length}</span>
                     </div>
                     <div className="pt-4">
                         <Button variant="outline" className="w-full text-xs">
                            <Save className="w-4 h-4 mr-2" /> Export Backup
                         </Button>
                     </div>
                 </div>
             </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default KnowledgeBase;

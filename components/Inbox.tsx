
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Thread, Message, Platform, Priority, MessageStatus, AIConfig, KnowledgeBaseData, AIModel, TaskAssignment, Booking, MaintenanceIssue, LocationInfo, BookingDraft, FAQ, AppMode, UpsellOpportunity, Apartment, Restaurant, PlanTier, MessageType, TeamMember, User as AppUser, MessageTemplate, SmartRailContext } from '../types';
import { analyzeIncomingMessage, generateDraftReply, generateQuickReplies, generateResearchReply, transformText, extractMaintenanceIssues, findLocationsInChat, extractBookingDetails, detectNewKnowledge, detectUpsellOpportunities, transcribeAudioMessage, translateMessage, summarizeConversation } from '../services/geminiService';
import { Search, Filter, Send, Sparkles, RefreshCw, Paperclip, XCircle, Loader2, Bolt, MessageSquare, FileText, AlertTriangle, ArrowLeft, Info, User, Calendar, Tag, Phone, Mail, Plus, Globe, ExternalLink, Mic, PlayCircle, PenTool, Wand2, Languages, Maximize2, Wrench, MapPin, Navigation, CalendarPlus, Check, Lightbulb, ShoppingBag, Package, TrendingUp, DollarSign, Home, Lock, Square, BrainCircuit, Eye, StickyNote, Edit2, Save, X, PauseCircle, UtensilsCrossed, Clock, CheckCircle, Layout, Image as ImageIcon, Trash2, Award, Gift, CreditCard, AlignLeft, UserCircle, Sliders, ThumbsUp, ThumbsDown, Zap, BookOpen, ChevronDown, ChevronUp, ListFilter, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { UpgradeModal } from './ui/UpgradeModal';
import { socket } from '../services/socketService';
import { getTheme } from '../utils/theme';
import { logger } from '../utils/logger';

// --- NEW: Waveform Component ---
import { AudioWaveform } from './AudioWaveform';

interface InboxProps {
    threads: Thread[];
    setThreads: React.Dispatch<React.SetStateAction<Thread[]>>;
    config: AIConfig;
    propertyKnowledgeBases: Record<string, KnowledgeBaseData>;
    restaurantKnowledgeBases: Record<string, KnowledgeBaseData>;
    ecommerceKnowledgeBase: KnowledgeBaseData;
    apartments: Apartment[];
    restaurants: Restaurant[];
    models: AIModel[];
    taskAssignments: TaskAssignment;
    onAddToKnowledgeBase: (question: string, answer: string, entityId?: string) => void;
    appMode: AppMode;
    currentPlan: PlanTier;
    onUpgrade: () => void;
    maintenanceIssues: MaintenanceIssue[];
    setMaintenanceIssues: React.Dispatch<React.SetStateAction<MaintenanceIssue[]>>;
    globalDraft?: string | null;
    onClearGlobalDraft?: () => void;
    templates: MessageTemplate[];
    onSelectContext: (context: SmartRailContext) => void;
}

const Inbox: React.FC<InboxProps> = ({ threads, setThreads, config, propertyKnowledgeBases, restaurantKnowledgeBases, ecommerceKnowledgeBase, apartments, restaurants, models, taskAssignments, onAddToKnowledgeBase, appMode, currentPlan, onUpgrade, maintenanceIssues, setMaintenanceIssues, globalDraft, onClearGlobalDraft, templates, onSelectContext }) => {
    const theme = getTheme(appMode);
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiStatusText, setAiStatusText] = useState<string>('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [quickReplies, setQuickReplies] = useState<string[]>([]);
    const [isLoadingQuickReplies, setIsLoadingQuickReplies] = useState(false);

    // Advanced Draft Config
    const [draftTone, setDraftTone] = useState(config.tone);
    const [draftLength, setDraftLength] = useState<'Short' | 'Medium' | 'Long'>('Medium');
    const [draftExtras, setDraftExtras] = useState({
        includeGreeting: true,
        includePolicy: true,
        includeUpsell: false
    });

    // Summary State
    const [summaryText, setSummaryText] = useState<string | null>(null);
    const [isSummarizing, setIsSummarizing] = useState(false);

    // Attachment State
    const [attachments, setAttachments] = useState<File[]>([]); // Uploaded files
    const [templateAttachments, setTemplateAttachments] = useState<string[]>([]); // URLs from templates

    const [researchSources, setResearchSources] = useState<{ title: string, uri: string }[]>([]);
    const [isCheckingMaintenance, setIsCheckingMaintenance] = useState(false);
    const [foundLocations, setFoundLocations] = useState<LocationInfo[]>([]);
    const [detectedKnowledge, setDetectedKnowledge] = useState<FAQ | null>(null);
    const [upsellOpportunities, setUpsellOpportunities] = useState<UpsellOpportunity[]>([]);
    const [isCheckingUpsell, setIsCheckingUpsell] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [draftError, setDraftError] = useState<string | null>(null);

    // New Features State
    const [isInternalNoteMode, setIsInternalNoteMode] = useState(false);
    const [teamTyping, setTeamTyping] = useState<string[]>([]);
    const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

    // Translation State
    const [translatingMessageId, setTranslatingMessageId] = useState<string | null>(null);
    const [showOriginalFor, setShowOriginalFor] = useState<Record<string, boolean>>({});

    // Voice Recording State
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    // Template Picker State
    const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false);

    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [featureToUnlock, setFeatureToUnlock] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Memoize filtered threads for performance
    const filteredThreads = useMemo(() => {
        if (!searchQuery) return threads;
        const lowerQuery = searchQuery.toLowerCase();
        return threads.filter(t =>
            t.participants?.some(p => p?.name?.toLowerCase().includes(lowerQuery)) ||
            t.messages?.some(m => m?.content?.toLowerCase().includes(lowerQuery)) ||
            t.summary?.toLowerCase().includes(lowerQuery)
        );
    }, [threads, searchQuery]);

    // Memoize derived data for performance
    const selectedThread = useMemo(() => threads.find(t => t.id === selectedThreadId), [threads, selectedThreadId]);
    const selectedUser = useMemo(() => selectedThread?.participants[0], [selectedThread]);

    const activeKnowledgeBase = useMemo(() => selectedThread
        ? appMode === 'property' && selectedThread.apartmentId
            ? propertyKnowledgeBases[selectedThread.apartmentId]
            : appMode === 'restaurant' && selectedThread.restaurantId
                ? restaurantKnowledgeBases[selectedThread.restaurantId]
                : ecommerceKnowledgeBase
        : ecommerceKnowledgeBase, [selectedThread, appMode, propertyKnowledgeBases, restaurantKnowledgeBases, ecommerceKnowledgeBase]);

    const threadEntity = useMemo(() => selectedThread
        ? appMode === 'property'
            ? apartments.find(a => a.id === selectedThread.apartmentId)
            : appMode === 'restaurant'
                ? restaurants.find(r => r.id === selectedThread.restaurantId)
                : null
        : null, [selectedThread, appMode, apartments, restaurants]);

    const entityLabel = appMode === 'property' ? 'Guest' : appMode === 'restaurant' ? 'Diner' : 'Customer';

    const getModel = (assignmentId: string) => {
        return models.find(m => m.id === assignmentId);
    };

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        setTimeout(scrollToBottom, 100);
    }, [selectedThreadId, threads, attachments, templateAttachments]);

    useEffect(() => {
        setResearchSources([]);
        setReplyText('');
        setAttachments([]);
        setTemplateAttachments([]);
        setFoundLocations([]);
        setDetectedKnowledge(null);
        setUpsellOpportunities([]);
        setIsRecording(false);
        setIsInternalNoteMode(false);
        setPlayingAudioId(null);
        setIsTemplatePickerOpen(false);
        setSummaryText(null); // Clear summary on switch

        // Trigger Smart Rail
        if (selectedThread) {
            onSelectContext({ type: 'thread', data: selectedThread });
        } else {
            onSelectContext({ type: 'none', data: null });
        }
    }, [selectedThreadId]);

    useEffect(() => {
        if (globalDraft) {
            setReplyText(globalDraft);
            if (!selectedThreadId && threads.length > 0) {
                setSelectedThreadId(threads[0].id);
            }
            if (onClearGlobalDraft) onClearGlobalDraft();
        }
    }, [globalDraft, threads, onClearGlobalDraft, selectedThreadId]);

    useEffect(() => {
        if (socket.connected && selectedThreadId) {
            socket.on('typing_status', (data: { userId: string, isTyping: boolean, threadId: string }) => {
                if (data.threadId === selectedThreadId && data.userId !== 'me') {
                    setTeamTyping(prev => data.isTyping
                        ? [...prev, data.userId]
                        : prev.filter(id => id !== data.userId)
                    );
                }
            });
            return () => { socket.off('typing_status'); };
        }
    }, [selectedThreadId]);

    const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setReplyText(val);

        // Magic Command for Templates
        if (val.endsWith('/')) {
            setIsTemplatePickerOpen(true);
        }

        if (socket.connected && selectedThreadId) {
            socket.emit('typing', { threadId: selectedThreadId, isTyping: true });
            const timeoutId = setTimeout(() => {
                socket.emit('typing', { threadId: selectedThreadId, isTyping: false });
            }, 2000);
            return () => clearTimeout(timeoutId);
        }
    };

    useEffect(() => {
        if (selectedThread) {
            const analyze = async () => {
                if (!selectedThread.summary) {
                    setIsAnalyzing(true);
                    const lastMsg = selectedThread.messages[selectedThread.messages.length - 1];
                    if (!lastMsg.isMe) {
                        try {
                            const model = getModel(taskAssignments.analysis);
                            const result = await analyzeIncomingMessage(lastMsg.content, model);

                            const updatedThread = { ...selectedThread, sentiment: result.sentiment as 'Positive' | 'Neutral' | 'Negative' | 'Angry', priority: result.priority as Priority, summary: result.summary };

                            setThreads(prev => prev.map(t =>
                                t.id === selectedThread.id
                                    ? updatedThread
                                    : t
                            ));

                            // Update Smart Rail Context with new analysis
                            onSelectContext({ type: 'thread', data: updatedThread });

                        } catch (error) {
                            logger.error("Message analysis failed", error);
                        }
                    }
                    setIsAnalyzing(false);
                }

                if (currentPlan !== 'Starter') {
                    setIsCheckingMaintenance(true);
                    setIsCheckingUpsell(true);
                    try {
                        const model = getModel(taskAssignments.analysis);
                        const issuesPromise = extractMaintenanceIssues(selectedThread, model);
                        const upsellPromise = detectUpsellOpportunities(selectedThread, appMode, model);
                        const [issues, upsells] = await Promise.all([issuesPromise, upsellPromise]);

                        if (issues.length > 0) {
                            const newIssues: MaintenanceIssue[] = issues.map((i, index) => ({
                                ...i,
                                id: `auto-issue-${Date.now()}-${index}`,
                                reportedAt: new Date(),
                                apartmentId: selectedThread.apartmentId,
                                restaurantId: selectedThread.restaurantId,
                                status: 'Open' as const
                            }));
                            setMaintenanceIssues(prev => [...prev, ...newIssues]);
                        }

                        const newUpsells: UpsellOpportunity[] = upsells.map((u, index) => ({
                            ...u,
                            id: `upsell-${Date.now()}-${index}`
                        }));
                        setUpsellOpportunities(newUpsells);
                    } catch (error) {
                        logger.error("Analysis failed", error);
                    } finally {
                        setIsCheckingMaintenance(false);
                        setIsCheckingUpsell(false);
                    }
                }
            };
            analyze();
        }
    }, [selectedThreadId]);

    useEffect(() => {
        if (selectedThread) {
            const loadQuickReplies = async () => {
                setIsLoadingQuickReplies(true);
                try {
                    const context = selectedThread.messages.map(m => `${m.isMe ? 'Me' : entityLabel}: ${m.content}`).join('\n');
                    const model = getModel(taskAssignments.quickReplies);
                    const replies = await generateQuickReplies(context, model);
                    setQuickReplies(replies);
                } catch (error) {
                    logger.error("Quick replies generation failed", error);
                    setQuickReplies([]);
                } finally {
                    setIsLoadingQuickReplies(false);
                }
            };
            loadQuickReplies();
        } else {
            setQuickReplies([]);
        }
    }, [selectedThreadId, entityLabel]);

    const handleAttachClick = () => {
        if (currentPlan === 'Starter') {
            setFeatureToUnlock('Vision AI (Photo Analysis)');
            setShowUpgradeModal(true);
            return;
        }
        fileInputRef.current?.click();
    };

    const handleVoiceClick = async () => {
        if (currentPlan === 'Starter') {
            setFeatureToUnlock('Voice Commands');
            setShowUpgradeModal(true);
            return;
        }
        if (isRecording) {
            stopRecording();
        } else {
            await startRecording();
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || 'audio/webm' });
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = async () => {
                    const base64String = (reader.result as string).split(',')[1];
                    setIsGenerating(true);
                    setAiStatusText('Transcribing Audio...');
                    try {
                        const result = await transcribeAudioMessage(base64String, mediaRecorder.mimeType || 'audio/webm');
                        setReplyText(prev => prev ? `${prev} ${result.text}` : result.text);
                    } catch (error) {
                        logger.error("Transcription error", error);
                        setDraftError("Failed to transcribe audio. Please try again.");
                    } finally {
                        setIsGenerating(false);
                        setAiStatusText('');
                    }
                };
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            logger.error("Error starting recording", error);
            alert("Could not access microphone. Please check your permissions.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSelectTemplate = (template: MessageTemplate) => {
        setReplyText(template.content);
        if (template.imageUrls && template.imageUrls.length > 0) {
            setTemplateAttachments(template.imageUrls);
        } else {
            setTemplateAttachments([]);
        }
        setIsTemplatePickerOpen(false);
    };

    const removeAttachment = (index: number, type: 'file' | 'template') => {
        if (type === 'file') {
            setAttachments(prev => prev.filter((_, i) => i !== index));
        } else {
            setTemplateAttachments(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleSendMessage = () => {
        if ((!replyText.trim() && attachments.length === 0 && templateAttachments.length === 0) || !selectedThread) return;
        setIsSending(true);

        setTimeout(() => {
            const textSent = replyText;
            let contentToSend = replyText;

            // Process attachments into URLs (Mock)
            const fileUrls = attachments.map(f => URL.createObjectURL(f));
            const allAttachments = [...fileUrls, ...templateAttachments];

            const messageType: MessageType = isInternalNoteMode ? 'internal_note' : 'text';

            if (socket.connected) {
                socket.emit('send_message', {
                    threadId: selectedThread.id,
                    content: contentToSend,
                    senderId: 'me',
                    type: messageType,
                    attachments: allAttachments
                });
            }

            const newMessage: Message = {
                id: Date.now().toString(),
                sender: { id: 'me', name: 'Me', avatar: '' },
                content: contentToSend,
                timestamp: new Date(),
                isMe: true,
                type: messageType,
                attachments: allAttachments
            };

            setThreads(prev => prev.map(t =>
                t.id === selectedThread.id
                    ? {
                        ...t,
                        messages: [...t.messages, newMessage],
                        status: isInternalNoteMode ? t.status : MessageStatus.Replied,
                        draftReply: undefined
                    }
                    : t
            ));

            setReplyText('');
            setAttachments([]);
            setTemplateAttachments([]);
            setResearchSources([]);
            setDraftError(null);
            setIsSending(false);
            setIsInternalNoteMode(false);

            if (textSent.length > 10 && activeKnowledgeBase && !isInternalNoteMode) {
                detectNewKnowledge(textSent, activeKnowledgeBase)
                    .then(suggestion => {
                        if (suggestion) setDetectedKnowledge(suggestion);
                    })
                    .catch(err => logger.error("Auto-learn check failed", err));
            }
        }, 300);
    };

    const handleConfirmKnowledge = () => {
        if (detectedKnowledge) {
            const entityId = selectedThread?.apartmentId || selectedThread?.restaurantId;
            onAddToKnowledgeBase(detectedKnowledge.question, detectedKnowledge.answer, entityId);
            setDetectedKnowledge(null);
        }
    };

    const handleGenerateDraft = async () => {
        if (!selectedThread || !activeKnowledgeBase) return;
        setIsGenerating(true);
        setAiStatusText('Initializing...');
        setDraftError(null);
        setResearchSources([]);

        const statusUpdates = ["Reading context...", "Checking Knowledge Base...", "Analyzing Tone...", "Drafting Response..."];
        let step = 0;
        const statusInterval = setInterval(() => {
            if (step < statusUpdates.length) {
                setAiStatusText(statusUpdates[step]);
                step++;
            }
        }, 400);

        try {
            const model = getModel(taskAssignments.drafting);
            // Construct full config object with new options
            const adjustedConfig = {
                ...config,
                tone: draftTone,
                length: draftLength,
                extras: draftExtras
            };
            const draft = await generateDraftReply(selectedThread, adjustedConfig, activeKnowledgeBase, model);
            clearInterval(statusInterval);
            setReplyText(draft);
        } catch (error) {
            logger.error("Draft generation failed", error);
            setDraftError("Failed to generate draft. Please try again.");
        } finally {
            clearInterval(statusInterval);
            setIsGenerating(false);
            setAiStatusText('');
        }
    };

    const handleSummarize = async () => {
        if (!selectedThread) return;
        setIsSummarizing(true);
        try {
            const model = getModel(taskAssignments.analysis);
            const summary = await summarizeConversation(selectedThread, model);
            setSummaryText(summary);
        } catch (error) {
            logger.error("Summarization failed", error);
        } finally {
            setIsSummarizing(false);
        }
    };

    const handleTranslate = async (messageId: string, content: string) => {
        setTranslatingMessageId(messageId);
        try {
            const model = getModel(taskAssignments.analysis);
            const translation = await translateMessage(content, config.language, model);

            setThreads(prev => prev.map(t => {
                if (t.id === selectedThreadId) {
                    const newMessages = t.messages.map(m => {
                        if (m.id === messageId) {
                            return { ...m, translatedContent: translation };
                        }
                        return m;
                    });
                    return { ...t, messages: newMessages };
                }
                return t;
            }));
        } catch (error) {
            logger.error("Translation failed", error);
        } finally {
            setTranslatingMessageId(null);
        }
    };

    const handleResolveThread = () => {
        if (selectedThreadId) {
            setThreads(prev => prev.map(t =>
                t.id === selectedThreadId ? { ...t, status: MessageStatus.Archived } : t
            ));
            setSelectedThreadId(null);
        }
    };

    const handleSnoozeThread = () => {
        if (selectedThreadId) {
            setThreads(prev => prev.map(t =>
                t.id === selectedThreadId ? { ...t, status: MessageStatus.Pending } : t
            ));
            alert("Thread snoozed for 2 hours.");
            setSelectedThreadId(null);
        }
    };

    // Helper to determine Smart Actions
    const getSmartActions = () => {
        if (!selectedThread) return [];
        const actions = [];
        const summary = selectedThread.summary?.toLowerCase() || '';
        const sentiment = selectedThread.sentiment;

        if (sentiment === 'Negative' || sentiment === 'Angry') {
            actions.push({ label: 'De-escalation Reply', icon: Heart, text: "I am terribly sorry for the inconvenience. We want to make this right immediately." });
            actions.push({ label: 'Offer Refund', icon: CreditCard, text: "As a gesture of goodwill, I would like to offer a partial refund for the trouble." });
        } else {
            actions.push({ label: 'Approve Request', icon: ThumbsUp, text: "I'm happy to approve that request for you!" });
        }

        // Contextual Actions based on Business Type
        if (appMode === 'property') {
            if (summary.includes('check-in') || summary.includes('access')) {
                actions.push({ label: 'Send Check-in Guide', icon: MapPin, text: "Here is the detailed check-in guide with map and codes: [Link]" });
            }
            if (summary.includes('wifi') || summary.includes('internet')) {
                actions.push({ label: 'Send Wifi Info', icon: Bolt, text: "The Wifi Network is 'Guest' and the password is 'Welcome123'." });
            }
        } else if (appMode === 'restaurant') {
            if (summary.includes('table') || summary.includes('book')) {
                actions.push({ label: 'Confirm Reservation', icon: Calendar, text: "I've confirmed your table for 7:00 PM. We look forward to seeing you!" });
            }
            if (summary.includes('menu') || summary.includes('diet')) {
                actions.push({ label: 'Send Menu Link', icon: UtensilsCrossed, text: "Here is a link to our full digital menu, including allergen info: [Link]" });
            }
        } else if (appMode === 'ecommerce') {
            if (summary.includes('order') || summary.includes('track')) {
                actions.push({ label: 'Send Tracking', icon: Package, text: "Your order is on the way! Track it here: [Link]" });
            }
            if (summary.includes('return') || summary.includes('refund')) {
                actions.push({ label: 'Start Return', icon: RefreshCw, text: "You can start your return process here: [Link]. It's free and easy." });
            }
        }

        // Default fallback
        if (actions.length === 0) {
            actions.push({ label: 'Ask for Clarification', icon: Info, text: "Could you please clarify what you mean?" });
        }

        return actions;
    };

    const smartActions = getSmartActions();

    const getPlatformIcon = (platform: Platform) => {
        switch (platform) {
            case Platform.Airbnb: return <span className="text-red-500 font-bold">Ab</span>;
            case Platform.WhatsApp: return <span className="text-green-500 font-bold">Wa</span>;
            case Platform.Lodgify: return <span className="text-blue-500 font-bold">Lg</span>;
            default: return <span className="text-gray-500">Em</span>;
        }
    };

    const getPriorityBadge = (priority: Priority) => {
        const variants: Record<Priority, 'destructive' | 'secondary' | 'outline'> = {
            [Priority.High]: 'destructive',
            [Priority.Medium]: 'secondary',
            [Priority.Low]: 'outline',
        };
        return <Badge variant={variants[priority]}>{priority}</Badge>;
    };

    return (
        <div className="flex h-full bg-white/50 dark:bg-gray-900/50 w-full overflow-hidden">
            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                onUpgrade={() => {
                    setShowUpgradeModal(false);
                    onUpgrade();
                }}
                featureName={featureToUnlock}
            />

            <div className={`${selectedThreadId ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 border-r border-gray-200 dark:border-gray-800 flex-col h-full shrink-0 animate-slide-in-right bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg`}>
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 space-y-4 shrink-0">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{appMode === 'property' ? 'Inbox' : appMode === 'restaurant' ? 'Concierge' : 'Support'}</h2>
                        {appMode === 'ecommerce' && <ShoppingBag className={`w-5 h-5 ${theme.text}`} />}
                        {appMode === 'restaurant' && <UtensilsCrossed className={`w-5 h-5 ${theme.text}`} />}
                    </div>
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                        <Input
                            placeholder="Search messages..."
                            className="pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="secondary" size="sm" className="flex-1 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">All</Button>
                        <Button variant="ghost" size="sm" className="flex-1 text-gray-600 dark:text-gray-400">Unread</Button>
                        <Button variant="ghost" size="sm" className="flex-1 text-gray-600 dark:text-gray-400">Priority</Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredThreads.map(thread => {
                        const apt = thread.apartmentId ? apartments.find(a => a.id === thread.apartmentId) : null;
                        const rest = thread.restaurantId ? restaurants.find(r => r.id === thread.restaurantId) : null;
                        const entityName = apt ? apt.name : rest ? rest.name : null;
                        const isNegative = thread.sentiment === 'Negative' || thread.sentiment === 'Angry';

                        return (
                            <div
                                key={thread.id}
                                onClick={() => setSelectedThreadId(thread.id)}
                                className={`p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200 group ${selectedThreadId === thread.id ? `${theme.lightBg}/50 dark:bg-gray-800` : ''} ${isNegative ? 'border-l-4 border-l-red-500 bg-red-50/20 dark:bg-red-900/10' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0 transform transition-transform group-hover:scale-105 relative">
                                            <img src={thread.participants[0]?.avatar || ''} alt="" className="w-full h-full object-cover" />
                                            {isNegative && <div className="absolute bottom-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></div>}
                                        </div>
                                        <div className="min-w-0">
                                            <span className="font-semibold text-sm text-gray-900 dark:text-white block truncate">{thread.participants[0]?.name || 'Unknown User'}</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {new Date(thread.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <Badge variant="outline" className="text-[10px] px-1 py-0 h-5 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">{getPlatformIcon(thread.platform)}</Badge>
                                    {getPriorityBadge(thread.priority)}
                                    {entityName && (
                                        <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 h-5 ${theme.lightBg} ${theme.text} dark:${theme.lightBg.replace('bg-', 'bg-').replace('50', '900/30')} dark:${theme.lightText.replace('700', '300')} flex items-center gap-1 truncate max-w-[100px]`}>
                                            {appMode === 'property' ? <Home className="w-3 h-3" /> : <UtensilsCrossed className="w-3 h-3" />} {entityName}
                                        </Badge>
                                    )}
                                </div>

                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed group-hover:text-gray-900 dark:group-hover:text-gray-300 transition-colors">
                                    {thread.messages && thread.messages.length > 0 ? (
                                        thread.messages[thread.messages.length - 1].type === 'internal_note' ? (
                                            <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 italic"><StickyNote className="w-3 h-3" /> Internal Note</span>
                                        ) : thread.messages[thread.messages.length - 1].audioUrl ? (
                                            <span className="flex items-center gap-1 italic"><Mic className="w-3 h-3" /> Voice Message</span>
                                        ) : (
                                            thread.messages[thread.messages.length - 1].content
                                        )
                                    ) : (
                                        <span className="italic text-gray-400">No messages</span>
                                    )}
                                </p>

                                {thread.summary && (
                                    <div className={`mt-2 flex items-center gap-1 text-xs ${theme.text} dark:${theme.text.replace('600', '400')} ${theme.lightBg} dark:bg-opacity-30 px-2 py-1 rounded-md self-start inline-block font-medium animate-fade-in`}>
                                        <Sparkles className="w-3 h-3" />
                                        {thread.summary}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`${!selectedThreadId ? 'hidden md:flex' : 'flex'} flex-1 flex-col h-full overflow-hidden min-w-0 relative animate-fade-in bg-white/40 dark:bg-gray-900/40 backdrop-blur-md`}>
                {detectedKnowledge && (
                    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md animate-in slide-in-from-top-4 fade-in duration-500">
                        <Card className="bg-amber-50/90 dark:bg-amber-900/80 backdrop-blur border-amber-200 dark:border-amber-800/50 shadow-lg animate-bounce-gentle">
                            <div className="p-3 flex items-start gap-3">
                                <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg text-amber-600 dark:text-amber-400 shrink-0">
                                    <Lightbulb className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100">Smart Suggestion: Add to Knowledge Base?</h4>
                                    <p className="text-xs text-amber-800 dark:text-amber-200 mt-1 mb-2">
                                        I noticed you shared new info. Should I remember this?
                                    </p>
                                    <div className="bg-white dark:bg-gray-900 p-2 rounded text-xs border border-amber-100 dark:border-amber-900 mb-2">
                                        <span className="font-bold block">Q: {detectedKnowledge.question}</span>
                                        <span className="block mt-1 text-gray-600 dark:text-gray-400">A: {detectedKnowledge.answer}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" className="h-7 text-xs bg-amber-600 hover:bg-amber-700 text-white border-0" onClick={handleConfirmKnowledge}>Yes, Save It</Button>
                                        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setDetectedKnowledge(null)}>No thanks</Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {selectedThread ? (
                    <>
                        <div className="px-4 md:px-6 py-3 md:py-4 bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center shrink-0 backdrop-blur">
                            <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
                                <Button variant="ghost" size="icon" className="md:hidden -ml-2 mr-1" onClick={() => setSelectedThreadId(null)}>
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                                <div className="animate-slide-in-right">
                                    <h3 className="font-bold text-gray-900 dark:text-white text-base md:text-lg truncate">{selectedThread.participants[0]?.name || 'Unknown User'}</h3>
                                    <div className="flex items-center gap-2">
                                        {threadEntity && (
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                {appMode === 'property' ? <Home className="w-3 h-3" /> : <UtensilsCrossed className="w-3 h-3" />} {threadEntity.name}
                                            </span>
                                        )}
                                        <span className="text-xs text-gray-400 hidden md:inline">
                                            • via {selectedThread.platform}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 shrink-0 items-center">
                                <Button variant="outline" size="sm" className="hidden md:flex gap-1 bg-white dark:bg-gray-800" onClick={handleSummarize} disabled={isSummarizing}>
                                    {isSummarizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlignLeft className={`w-4 h-4 ${theme.text}`} />}
                                    <span className="text-xs">Summarize</span>
                                </Button>
                                <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-1"></div>
                                <Button variant="ghost" size="sm" className="hidden md:flex gap-1 text-gray-500 hover:text-green-600" onClick={handleResolveThread} title="Resolve Thread">
                                    <CheckCircle className="w-4 h-4" /> <span className="text-xs">Resolve</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="hidden md:flex gap-1 text-gray-500 hover:text-orange-500" onClick={handleSnoozeThread} title="Snooze">
                                    <Clock className="w-4 h-4" /> <span className="text-xs">Snooze</span>
                                </Button>

                                {teamTyping.length > 0 && (
                                    <div className="flex -space-x-2 mr-2 animate-fade-in">
                                        {teamTyping.map((userId, i) => (
                                            <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white relative" title="Typing...">
                                                <img src={`https://picsum.photos/seed/${userId}/50`} className="w-full h-full rounded-full" />
                                                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-1"></div>

                                <Button variant="ghost" size="icon" onClick={() => onSelectContext({ type: 'thread', data: selectedThread })} className="text-gray-500 dark:text-gray-400">
                                    <Info className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 relative">

                            {/* Summary Overlay */}
                            {summaryText && (
                                <div className="sticky top-0 z-30 mb-4 animate-slide-up">
                                    <div className={`${theme.lightBg}/95 dark:bg-gray-800/90 backdrop-blur shadow-md rounded-xl p-4 border ${theme.border.replace('200', '100')} dark:${theme.border.replace('200', '800')} relative`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className={`text-sm font-bold ${theme.text.replace('600', '900')} dark:${theme.text.replace('600', '100')} flex items-center gap-2`}>
                                                <Sparkles className={`w-4 h-4 ${theme.text.replace('600', '500')}`} /> Conversation Summary
                                            </h4>
                                            <button onClick={() => setSummaryText(null)} className={`${theme.text.replace('600', '400')} hover:${theme.text} dark:hover:${theme.text.replace('600', '200')}`}><X className="w-4 h-4" /></button>
                                        </div>
                                        <div className={`text-sm ${theme.text.replace('600', '800')} dark:${theme.text.replace('600', '200')} leading-relaxed whitespace-pre-wrap pl-4 border-l-2 ${theme.border.replace('200', '300')} dark:border-gray-600`}>
                                            {summaryText}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedThread.messages.map((msg, index) => {
                                const isNewMessage = index === selectedThread.messages.length - 1 && msg.isMe && Date.now() - msg.timestamp.getTime() < 1000;
                                const isInternal = msg.type === 'internal_note';
                                const isTranslating = translatingMessageId === msg.id;
                                const showOriginal = showOriginalFor[msg.id];

                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} ${isNewMessage ? 'animate-pop-in' : 'animate-slide-up'}`}
                                        style={{ animationDelay: isNewMessage ? '0ms' : `${index * 50}ms` }}
                                    >
                                        <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 md:px-5 py-3 shadow-sm text-sm transition-all duration-300 hover:shadow-md relative group ${isInternal
                                            ? 'bg-yellow-100 text-yellow-900 border border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-100 dark:border-yellow-800'
                                            : msg.isMe
                                                ? `${theme.bg} text-white rounded-br-none`
                                                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-none'
                                            }`}>

                                            {!msg.isMe && !isInternal && !msg.audioUrl && (
                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className={`h-6 w-6 text-gray-400 hover:${theme.text} hover:${theme.lightBg} dark:hover:bg-gray-700 rounded-full`}
                                                        onClick={() => handleTranslate(msg.id, msg.content)}
                                                        title="Translate"
                                                        disabled={isTranslating}
                                                    >
                                                        {isTranslating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Globe className="w-3 h-3" />}
                                                    </Button>
                                                </div>
                                            )}

                                            {isInternal && (
                                                <div className="flex items-center gap-1 mb-1 text-xs font-bold uppercase tracking-wide opacity-70">
                                                    <StickyNote className="w-3 h-3" /> Internal Note
                                                </div>
                                            )}

                                            {msg.audioUrl ? (
                                                <AudioWaveform
                                                    isPlaying={playingAudioId === msg.id}
                                                    onPlayPause={() => setPlayingAudioId(playingAudioId === msg.id ? null : msg.id)}
                                                    theme={theme}
                                                />
                                            ) : (
                                                <div>
                                                    {msg.attachments && msg.attachments.length > 0 && (
                                                        <div className="grid grid-cols-2 gap-2 mb-2">
                                                            {msg.attachments.map((url, i) => (
                                                                <img key={i} src={url} alt="Attachment" className="rounded-lg object-cover w-full h-32 border border-black/10 dark:border-white/10" />
                                                            ))}
                                                        </div>
                                                    )}
                                                    {msg.translatedContent && !showOriginal ? (
                                                        <div className="animate-fade-in">
                                                            <p className={`leading-relaxed whitespace-pre-wrap break-words italic ${theme.text.replace('600', '900')} dark:${theme.text.replace('600', '200')}`}>
                                                                {msg.translatedContent}
                                                            </p>
                                                            <div className={`mt-2 pt-2 border-t ${theme.border.replace('200', '100')} dark:border-gray-700 flex justify-between items-center`}>
                                                                <span className={`text-[9px] ${theme.text.replace('600', '400')} uppercase flex items-center gap-1`}>
                                                                    <Globe className="w-2.5 h-2.5" /> Translated
                                                                </span>
                                                                <button onClick={() => setShowOriginalFor(prev => ({ ...prev, [msg.id]: true }))} className={`text-[10px] ${theme.text} hover:underline`}>
                                                                    Show Original
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <p className="leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                                                            {msg.translatedContent && (
                                                                <div className="mt-2 pt-1 border-t border-gray-100 dark:border-gray-700">
                                                                    <button onClick={() => setShowOriginalFor(prev => ({ ...prev, [msg.id]: false }))} className="text-[10px] text-gray-500 hover:underline">
                                                                        Show Translation
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                            <span className={`text-[10px] block mt-1 opacity-70 ${msg.isMe && !isInternal ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'}`}>
                                                {new Date(msg.timestamp).toLocaleTimeString()} {msg.sender?.name !== 'Me' && `• ${msg.sender?.name || 'Unknown'}`}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className={`p-4 md:p-6 transition-colors duration-300 backdrop-blur border-t shrink-0 z-10 ${isInternalNoteMode ? 'bg-yellow-50/80 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' : 'bg-white/80 dark:bg-gray-900/80 border-gray-200 dark:border-gray-800'}`}>
                            {/* Pending Attachments Preview */}
                            {(attachments.length > 0 || templateAttachments.length > 0) && (
                                <div className="flex gap-3 mb-3 overflow-x-auto pb-2">
                                    {templateAttachments.map((url, i) => (
                                        <div key={`tpl-img-${i}`} className={`relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border ${theme.border} dark:border-gray-800 group shadow-sm`}>
                                            <img src={url} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <button onClick={() => removeAttachment(i, 'template')} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl opacity-0 group-hover:opacity-100 transition-opacity">
                                                <X className="w-3 h-3" />
                                            </button>
                                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[8px] px-1 py-0.5 text-center truncate">Template</div>
                                        </div>
                                    ))}
                                    {attachments.map((file, i) => (
                                        <div key={`file-${i}`} className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 group bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                            <ImageIcon className="w-6 h-6 text-gray-400" />
                                            <button onClick={() => removeAttachment(i, 'file')} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl opacity-0 group-hover:opacity-100 transition-opacity">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 w-full">
                                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mr-2 shrink-0">
                                        <button
                                            onClick={() => setIsInternalNoteMode(false)}
                                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${!isInternalNoteMode ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white' : 'text-gray-500'}`}
                                        >
                                            Reply
                                        </button>
                                        <button
                                            onClick={() => setIsInternalNoteMode(true)}
                                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${isInternalNoteMode ? 'bg-yellow-400 text-yellow-900 shadow' : 'text-gray-500'}`}
                                        >
                                            <StickyNote className="w-3 h-3" /> Note
                                        </button>
                                    </div>

                                    {!isInternalNoteMode && (
                                        <>
                                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mr-2 flex-shrink-0 flex items-center gap-1">
                                                <Bolt className="w-3 h-3" /> Quick Reply
                                            </span>
                                            {isLoadingQuickReplies ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-6 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
                                                </div>
                                            ) : quickReplies.map((reply, idx) => (
                                                <Button key={idx} variant="outline" size="sm" onClick={() => setReplyText(reply)} className="h-7 text-xs rounded-full flex-shrink-0 animate-scale-in dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
                                                    {reply}
                                                </Button>
                                            ))}
                                        </>
                                    )}
                                </div>

                                <div className="flex gap-2 shrink-0 w-full sm:w-auto">
                                    {!isInternalNoteMode && (
                                        <Button onClick={handleGenerateDraft} disabled={isGenerating} size="sm" className={`bg-gradient-to-r ${theme.gradient} text-white border-0 w-full sm:w-auto shadow transition-all`}>
                                            {isGenerating ? (
                                                <>
                                                    <BrainCircuit className="w-3 h-3 animate-pulse mr-2" />
                                                    {aiStatusText || 'Thinking...'}
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-3 h-3 mr-2" /> Auto Draft
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="relative">
                                {/* Template Picker Popover */}
                                {isTemplatePickerOpen && (
                                    <div className="absolute bottom-full left-0 mb-2 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl z-50 overflow-hidden animate-scale-in">
                                        <div className="p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                            <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                                                <Layout className="w-3 h-3" /> Templates
                                            </span>
                                            <button onClick={() => setIsTemplatePickerOpen(false)}><X className="w-3 h-3 text-gray-400 hover:text-gray-600" /></button>
                                        </div>
                                        <div className="max-h-60 overflow-y-auto p-1">
                                            {templates.map(tpl => (
                                                <button
                                                    key={tpl.id}
                                                    onClick={() => handleSelectTemplate(tpl)}
                                                    className={`w-full text-left p-2 hover:${theme.lightBg} dark:hover:bg-gray-800/50 rounded-lg text-sm flex items-start gap-3 transition-colors group`}
                                                >
                                                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-gray-200 dark:border-gray-700">
                                                        {tpl.imageUrls && tpl.imageUrls.length > 0 ? (
                                                            <img src={tpl.imageUrls[0]} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <FileText className="w-5 h-5 text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className={`font-medium text-gray-900 dark:text-white truncate group-hover:${theme.text} dark:group-hover:${theme.text.replace('600', '400')} transition-colors`}>
                                                            {tpl.title}
                                                        </div>
                                                        <div className="text-xs text-gray-500 truncate">{tpl.category}</div>
                                                        {tpl.imageUrls && tpl.imageUrls.length > 0 && (
                                                            <div className={`text-[10px] ${theme.text.replace('600', '500')} mt-0.5 flex items-center gap-1`}>
                                                                <Paperclip className="w-2.5 h-2.5" /> {tpl.imageUrls.length} Attachment{tpl.imageUrls.length > 1 ? 's' : ''}
                                                            </div>
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                            {templates.length === 0 && (
                                                <div className="p-6 text-center text-xs text-gray-400 flex flex-col items-center">
                                                    <FileText className="w-8 h-8 mb-2 opacity-20" />
                                                    No templates created.
                                                    <br />Go to Settings to add one.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {draftError && (
                                    <div className="mb-2 p-2 bg-red-50 text-red-600 rounded-md flex items-center gap-2 text-sm animate-in fade-in slide-in-from-bottom-2">
                                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                        <span>{draftError}</span>
                                    </div>
                                )}
                                <div className={`relative transition-all ${isSending ? 'pointer-events-none' : ''}`}>
                                    <Textarea
                                        placeholder={isInternalNoteMode ? "Add a private note for the team..." : (isRecording ? "Listening..." : "Type a message... (Use / for templates)")}
                                        value={replyText}
                                        onChange={handleTyping}
                                        className={`pr-24 resize-none min-h-[100px] ${isRecording ? 'border-red-400 ring-2 ring-red-100 dark:ring-red-900/20' : ''} ${isInternalNoteMode ? 'bg-yellow-50/50 border-yellow-200 focus-visible:ring-yellow-400' : 'bg-white dark:bg-gray-950/50'}`}
                                    />
                                    {isRecording && (
                                        <div className="absolute top-2 right-2 flex items-center gap-1 text-xs text-red-500 font-medium animate-pulse">
                                            <span className="w-2 h-2 bg-red-500 rounded-full"></span> Recording
                                        </div>
                                    )}
                                    {isInternalNoteMode && (
                                        <div className="absolute top-2 right-2 flex items-center gap-1 text-xs text-yellow-600 font-medium">
                                            <Eye className="w-3 h-3" /> Team only
                                        </div>
                                    )}
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
                                <div className="absolute bottom-2 right-2 flex gap-1">
                                    {!isInternalNoteMode && (
                                        <>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setIsTemplatePickerOpen(!isTemplatePickerOpen)}
                                                className={`h-8 w-8 rounded-full relative group transition-colors ${isTemplatePickerOpen ? `${theme.lightBg} ${theme.text}` : `text-gray-500 hover:${theme.text} dark:text-gray-400`}`}
                                                title="Insert Template"
                                            >
                                                <Layout className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={handleVoiceClick}
                                                className={`h-8 w-8 rounded-full relative group transition-all ${isRecording ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'dark:text-gray-400'}`}
                                            >
                                                {currentPlan === 'Starter' && <Lock className="w-3 h-3 absolute top-0 right-0 text-orange-500" />}
                                                {isRecording ? <Square className="w-4 h-4 fill-current" /> : <Mic className="w-4 h-4" />}
                                            </Button>
                                        </>
                                    )}
                                    <Button variant="ghost" size="icon" onClick={handleAttachClick} className="h-8 w-8 rounded-full relative group dark:text-gray-400">
                                        {currentPlan === 'Starter' && <Lock className="w-3 h-3 absolute top-0 right-0 text-orange-500" />}
                                        <Paperclip className="w-4 h-4" />
                                    </Button>
                                    <Button onClick={handleSendMessage} disabled={(!replyText.trim() && attachments.length === 0 && templateAttachments.length === 0) || isSending} size="icon" className={`h-8 w-8 rounded-full shadow-lg transition-all active:scale-90 ${isInternalNoteMode ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : `${theme.bg} hover:${theme.hover.replace('hover:', '')} text-white`} ${isSending ? 'scale-90 opacity-80' : 'scale-100'}`}>
                                        {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center animate-fade-in">
                        <div className="w-16 h-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur rounded-2xl flex items-center justify-center mb-6 animate-bounce-gentle shadow-lg">
                            {appMode === 'property' ? <MessageSquare className="w-8 h-8 text-gray-300 dark:text-gray-600" /> : appMode === 'restaurant' ? <UtensilsCrossed className="w-8 h-8 text-gray-300 dark:text-gray-600" /> : <ShoppingBag className="w-8 h-8 text-gray-300 dark:text-gray-600" />}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Select a conversation</h3>
                        <p className="max-w-sm text-gray-500 dark:text-gray-400">Choose a thread from the list to view history and use AI tools.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inbox;

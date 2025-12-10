
import React, { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Bot, Send, Loader2, Sparkles, Calendar, DollarSign, Star, Wrench, Zap, FileText, Search, RefreshCw, RefreshCcw } from 'lucide-react';
import { AppMode, Thread, Booking, AIModel, Apartment, Restaurant } from '../types';
import { getTheme } from '../utils/theme';
import { askBusinessAnalyst } from '../services/geminiService';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';

interface BusinessCopilotProps {
    appMode: AppMode;
    threads: Thread[];
    bookings: Booking[];
    platformData: any[];
    models: AIModel[];
    apartments: Apartment[];
    restaurants: Restaurant[];
}

interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    metric?: string;
    value?: string;
    chart?: any;
    timestamp: Date;
}

export const BusinessCopilot: React.FC<BusinessCopilotProps> = ({ appMode, threads, bookings, platformData, models, apartments, restaurants }) => {
    const theme = getTheme(appMode);
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (text: string) => {
        if (!text.trim()) return;
        
        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: new Date()
        };
        
        setMessages(prev => [...prev, userMsg]);
        setQuery('');
        setIsLoading(true);

        try {
            const context = {
                totalBookings: bookings.length,
                totalThreads: threads.length,
                platformDistribution: platformData,
                recentBookings: bookings.slice(0, 5),
                recentThreads: threads.slice(0, 5)
            };
            
            const model = models.find(m => m.modelId.includes('pro')) || models[0];
            const result = await askBusinessAnalyst(text, context, model);
            
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: result.answer,
                metric: result.metric,
                value: result.value,
                chart: result.chart,
                timestamp: new Date()
            };
            
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                content: "I encountered an error analyzing that request. Please try again.",
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const suggestions = [
        { icon: Calendar, text: "What is the projected occupancy for next month?" },
        { icon: DollarSign, text: "Should I adjust prices for the upcoming holiday weekend based on demand?" },
        { icon: Star, text: "Summarize recent guest feedback regarding cleanliness and amenities." },
        { icon: Wrench, text: "What is the total maintenance spend per unit this quarter?" },
        { icon: Zap, text: "Which units have unusually high utility bills compared to occupancy?" },
        { icon: FileText, text: "List tenants with leases expiring in the next 60 days." },
        { icon: Search, text: "Compare my nightly rates to similar properties in the area." },
        { icon: RefreshCw, text: "How many guests are repeat visitors this year?" }
    ];

    return (
        <Card className="flex flex-col h-[calc(100vh-140px)] border-0 shadow-xl overflow-hidden bg-gray-50 dark:bg-gray-900 relative">
            {/* Header */}
            <div className="bg-indigo-600 text-white p-4 flex justify-between items-center shrink-0 z-20 shadow-md">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-base leading-tight">Business Copilot</h2>
                        <p className="text-[10px] text-indigo-100 opacity-90">Property Analyst</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8" onClick={() => setMessages([])} title="Reset Chat">
                    <RefreshCcw className="w-4 h-4" />
                </Button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth pb-4">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center max-w-4xl mx-auto animate-fade-in py-4">
                        <div className="w-16 h-16 bg-indigo-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                            <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">How can I help you today?</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-10 text-center max-w-lg text-sm leading-relaxed">
                            I've analyzed your latest bookings and revenue data. Here are some insights I can provide:
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                            {suggestions.map((s, i) => (
                                <button 
                                    key={i}
                                    onClick={() => handleSend(s.text)}
                                    className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md transition-all text-left group h-full"
                                >
                                    <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors shrink-0">
                                        <s.icon className="w-4 h-4 text-gray-500 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white leading-snug">
                                        {s.text}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 max-w-3xl mx-auto">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-slide-up`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'ai' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                                    {msg.role === 'ai' ? <Bot className="w-4 h-4" /> : <div className="text-[10px] font-bold">You</div>}
                                </div>
                                <div className={`flex-1 max-w-[85%]`}>
                                    <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${msg.role === 'user' ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100' : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700'}`}>
                                        <p className="whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                    
                                    {msg.metric && (
                                        <div className="mt-3 flex gap-4 animate-fade-in ml-1">
                                            <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm inline-flex flex-col min-w-[120px]">
                                                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">{msg.metric}</span>
                                                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{msg.value}</span>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {msg.chart && (
                                        <div className="mt-3 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm h-64 w-full animate-fade-in ml-1">
                                            <h4 className="text-xs font-bold mb-4 text-gray-700 dark:text-gray-300 text-center uppercase tracking-wide">{msg.chart.title}</h4>
                                            <ResponsiveContainer width="100%" height="100%">
                                                {msg.chart.type === 'bar' ? (
                                                    <BarChart data={msg.chart.data}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                        <XAxis dataKey={msg.chart.xKey || 'name'} fontSize={10} tickLine={false} axisLine={false} />
                                                        <YAxis fontSize={10} tickLine={false} axisLine={false} />
                                                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                                        <Bar dataKey={msg.chart.dataKey || 'value'} fill="#4f46e5" radius={[4, 4, 0, 0]} />
                                                    </BarChart>
                                                ) : (
                                                    <LineChart data={msg.chart.data}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                        <XAxis dataKey={msg.chart.xKey || 'name'} fontSize={10} tickLine={false} axisLine={false} />
                                                        <YAxis fontSize={10} tickLine={false} axisLine={false} />
                                                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                                        <Line type="monotone" dataKey={msg.chart.dataKey || 'value'} stroke="#4f46e5" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                                                    </LineChart>
                                                )}
                                            </ResponsiveContainer>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-4 animate-pulse">
                                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input Footer */}
            <div className="p-4 md:p-6 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent dark:from-gray-900 dark:via-gray-900 z-20 shrink-0">
                <div className="max-w-3xl mx-auto space-y-4">
                    <div className="relative flex items-center gap-2">
                        <div className="relative flex-1 shadow-lg rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-indigo-100 transition-all overflow-hidden">
                            <Input 
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend(query)}
                                placeholder="Ask a follow-up question..."
                                className="w-full h-14 pl-5 pr-4 border-0 bg-transparent text-sm focus-visible:ring-0 placeholder:text-gray-400"
                                disabled={isLoading}
                            />
                        </div>
                        <Button 
                            size="icon" 
                            className={`h-14 w-14 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg transition-all ${query.trim() ? 'opacity-100 translate-x-0' : 'opacity-80'}`}
                            onClick={() => handleSend(query)}
                            disabled={!query.trim() || isLoading}
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </Button>
                    </div>
                    <div className="text-center">
                        <span className="text-[10px] text-gray-400 font-medium">AI can make mistakes. Please verify important financial data.</span>
                    </div>
                </div>
            </div>
        </Card>
    );
};

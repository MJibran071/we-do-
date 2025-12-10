
import React, { useState } from 'react';
import { X, Send, MessageSquare, Zap, Mic, Sparkles, ThumbsUp } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { AppMode } from '../types';
import { getTheme } from '../utils/theme';

interface FeedbackChannelProps {
    isOpen: boolean;
    onClose: () => void;
    appMode?: AppMode;
}

const CHANGELOG = [
    { id: 1, date: 'Today', title: 'Magic Import', desc: 'Paste your URL to setup instantly.' },
    { id: 2, date: 'Yesterday', title: 'Voice Agent Upgrade', desc: 'Lower latency for Gemini Live calls.' },
    { id: 3, date: '2 days ago', title: 'Marketing Suite', desc: 'Added video generation tool.' },
];

export const FeedbackChannel: React.FC<FeedbackChannelProps> = ({ isOpen, onClose, appMode = 'property' as AppMode }) => {
    const theme = getTheme(appMode);
    const [activeTab, setActiveTab] = useState<'chat' | 'updates'>('chat');
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<{sender: 'user'|'team', text: string}[]>([
        { sender: 'team', text: "Hi! We're the team. What do you think of the new update?" }
    ]);

    const handleSend = () => {
        if (!message.trim()) return;
        setChatHistory(prev => [...prev, { sender: 'user', text: message }]);
        setMessage('');
        // Simulate reply
        setTimeout(() => {
            setChatHistory(prev => [...prev, { sender: 'team', text: "Thanks for the feedback! We'll add that to our roadmap." }]);
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white dark:bg-gray-900 shadow-2xl z-[70] border-l border-gray-200 dark:border-gray-800 animate-slide-in-right flex flex-col">
            <div className={`p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r ${theme.gradient} text-white`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30">
                        <img src="https://picsum.photos/id/1005/100" className="w-full h-full rounded-full object-cover" alt="Team" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Team Channel</h3>
                        <div className="flex items-center gap-1 text-[10px] text-white/80">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online
                        </div>
                    </div>
                </div>
                <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex p-1 bg-gray-100 dark:bg-gray-800 m-4 rounded-lg">
                <button 
                    onClick={() => setActiveTab('chat')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'chat' ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Direct Chat
                </button>
                <button 
                    onClick={() => setActiveTab('updates')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'updates' ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    What's New <span className="ml-1 bg-red-500 text-white text-[9px] px-1 rounded-full">3</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {activeTab === 'chat' ? (
                    <div className="space-y-4">
                        {chatHistory.map((msg, i) => (
                            <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 text-sm rounded-xl ${
                                    msg.sender === 'user' 
                                    ? `${theme.bg} text-white rounded-br-none` 
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6 relative pl-4 border-l border-gray-200 dark:border-gray-800 ml-2">
                        {CHANGELOG.map(log => (
                            <div key={log.id} className="relative pl-6">
                                <div className={`absolute -left-[21px] top-0 w-3 h-3 ${theme.bg} rounded-full border-4 border-white dark:border-gray-900`}></div>
                                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{log.date}</span>
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-1">{log.title}</h4>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{log.desc}</p>
                                <Button variant="ghost" size="sm" className={`h-6 px-0 ${theme.text} text-[10px] hover:bg-transparent hover:underline mt-2`}>
                                    Read more
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {activeTab === 'chat' && (
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <div className="relative flex items-center">
                        <Input 
                            placeholder="Send feedback or report a bug..." 
                            className="pr-10"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button onClick={handleSend} className={`absolute right-2 p-1.5 ${theme.bg} text-white rounded-md hover:opacity-90 transition-colors`}>
                            <Send className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="mt-2 flex justify-between items-center text-[10px] text-gray-400">
                        <div className="flex gap-2">
                            <button className={`hover:${theme.text}`}><Mic className="w-3 h-3" /></button>
                            <button className={`hover:${theme.text}`}><Sparkles className="w-3 h-3" /></button>
                        </div>
                        <span>Replies typically in 5m</span>
                    </div>
                </div>
            )}
        </div>
    );
};


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { AppMode, ContractDocument } from '../types';
import { getTheme } from '../utils/theme';
import { Scale, UploadCloud, Search, FileText, Lock, MessageSquare, Send, Loader2, Bot, File } from 'lucide-react';
import { parsePDFDocument } from '../services/geminiService';
import { toast } from 'sonner';

interface LegalVaultProps {
    appMode: AppMode;
}

const MOCK_DOCS: ContractDocument[] = [
    { id: 'doc1', title: 'Commercial Lease - Downtown', type: 'Lease', status: 'Active', expiryDate: new Date('2027-12-31'), parties: ['We Do Inc', 'Realty Corp'] },
    { id: 'doc2', title: 'Vendor Agreement - Sysco', type: 'Vendor', status: 'Active', expiryDate: new Date('2026-10-15'), parties: ['We Do Inc', 'Sysco Foods'] },
    { id: 'doc3', title: 'Liability Insurance Policy', type: 'Insurance', status: 'Pending Renewal', expiryDate: new Date('2026-06-01'), parties: ['We Do Inc', 'SafeGuard Insurance'] },
];

export const LegalVault: React.FC<LegalVaultProps> = ({ appMode }) => {
    const theme = getTheme(appMode);
    const [docs, setDocs] = useState<ContractDocument[]>(MOCK_DOCS);
    const [searchQuery, setSearchQuery] = useState('');
    const [chatQuery, setChatQuery] = useState('');
    const [chatHistory, setChatHistory] = useState<{role: 'user'|'ai', text: string}[]>([]);
    const [isThinking, setIsThinking] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleChat = () => {
        if (!chatQuery.trim()) return;
        
        setChatHistory(prev => [...prev, { role: 'user', text: chatQuery }]);
        setChatQuery('');
        setIsThinking(true);

        // Simulation of RAG
        setTimeout(() => {
            let response = "I couldn't find that in the documents.";
            if (chatQuery.toLowerCase().includes('cancel') || chatQuery.toLowerCase().includes('terminate')) {
                response = "According to the Commercial Lease (Section 4.2), termination requires 60 days written notice. Early termination incurs a penalty of 3 months' rent.";
            } else if (chatQuery.toLowerCase().includes('renew') || chatQuery.toLowerCase().includes('expire')) {
                response = "The Sysco Vendor Agreement expires on Oct 15, 2026. It auto-renews for 1 year unless cancelled 30 days prior.";
            }
            
            setChatHistory(prev => [...prev, { role: 'ai', text: response }]);
            setIsThinking(false);
        }, 1500);
    };

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setIsUploading(true);
            const file = e.target.files[0];
            // Mock upload and parse
            setTimeout(() => {
                const newDoc: ContractDocument = {
                    id: `doc-${Date.now()}`,
                    title: file.name.replace('.pdf', ''),
                    type: 'Vendor',
                    status: 'Active',
                    expiryDate: new Date(Date.now() + 31536000000), // +1 year
                    parties: ['We Do Inc', 'New Vendor']
                };
                setDocs(prev => [newDoc, ...prev]);
                setIsUploading(false);
                toast.success("Document Uploaded", { description: "AI has indexed the contents for chat." });
            }, 2000);
        }
    };

    return (
        <div className="flex h-full overflow-hidden bg-gray-50 dark:bg-gray-950">
            {/* Main Content: Doc Grid */}
            <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                            <Scale className={`w-8 h-8 ${theme.text}`} /> Legal Vault
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Secure AI-powered document repository.</p>
                    </div>
                    <div>
                        <input type="file" id="doc-upload" className="hidden" accept=".pdf" onChange={handleUpload} />
                        <Button 
                            onClick={() => document.getElementById('doc-upload')?.click()} 
                            disabled={isUploading}
                            className={`${theme.bg} ${theme.hover} text-white shadow-lg`}
                        >
                            {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UploadCloud className="w-4 h-4 mr-2" />}
                            Upload Contract
                        </Button>
                    </div>
                </div>

                <div className="mb-6 relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <Input 
                        placeholder="Search documents..." 
                        className="pl-9 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {docs.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase())).map(doc => (
                        <Card key={doc.id} className="group hover:shadow-md transition-all cursor-pointer">
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <Badge variant="outline" className={`${doc.status === 'Active' ? 'text-green-600 border-green-200 bg-green-50' : 'text-orange-600 border-orange-200 bg-orange-50'}`}>
                                        {doc.status}
                                    </Badge>
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-1 truncate" title={doc.title}>{doc.title}</h3>
                                <p className="text-xs text-gray-500 mb-4">{doc.type} • Exp: {doc.expiryDate.toLocaleDateString()}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-800">
                                    <Lock className="w-3 h-3" /> Encrypted & Indexed
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Right Sidebar: Chat */}
            <div className="w-96 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col shadow-xl z-20">
                <div className={`p-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r ${theme.gradient} text-white`}>
                    <h3 className="font-bold flex items-center gap-2">
                        <Bot className="w-5 h-5" /> Ask Legal AI
                    </h3>
                    <p className="text-xs text-indigo-100 opacity-90">RAG enabled on {docs.length} documents.</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/50">
                    {chatHistory.length === 0 && (
                        <div className="text-center text-gray-400 mt-10">
                            <File className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p className="text-sm">Ask me about clauses, dates, or terms in your contracts.</p>
                        </div>
                    )}
                    {chatHistory.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-3 rounded-lg text-sm ${msg.role === 'user' ? `${theme.bg} text-white` : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isThinking && (
                        <div className="flex justify-start">
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex gap-1">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <div className="relative">
                        <Input 
                            value={chatQuery}
                            onChange={(e) => setChatQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                            placeholder="e.g. When does the lease expire?"
                            className="pr-10"
                        />
                        <button onClick={handleChat} className={`absolute right-2 top-2 p-1 ${theme.text} hover:bg-gray-100 dark:hover:bg-gray-800 rounded`}>
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

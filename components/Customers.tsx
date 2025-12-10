import React, { useState } from 'react';
import { CustomerProfile, AppMode, AIModel, TaskAssignment } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Search, Filter, Sparkles, User, DollarSign, Calendar, TrendingUp, AlertTriangle, MoreVertical, X, Mail, Phone, Loader2, RefreshCw } from 'lucide-react';
import { getTheme } from '../utils/theme';
import { analyzeCustomerPersona } from '../services/geminiService';
import { toast } from 'sonner';

interface CustomersProps {
    customers: CustomerProfile[];
    setCustomers: React.Dispatch<React.SetStateAction<CustomerProfile[]>>;
    appMode: AppMode;
    models: AIModel[];
    taskAssignments: TaskAssignment;
}

export const Customers: React.FC<CustomersProps> = ({ customers, setCustomers, appMode, models, taskAssignments }) => {
    const theme = getTheme(appMode);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const filteredCustomers = customers.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

    const getRiskColor = (risk: string) => {
        switch(risk) {
            case 'High': return 'text-red-600 bg-red-100 border-red-200';
            case 'Medium': return 'text-orange-600 bg-orange-100 border-orange-200';
            case 'Low': return 'text-green-600 bg-green-100 border-green-200';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const handleAnalyzeProfile = async () => {
        if (!selectedCustomer) return;
        setIsAnalyzing(true);
        try {
            const model = models.find(m => m.id === taskAssignments.analysis);
            const result = await analyzeCustomerPersona(selectedCustomer, model);
            
            setCustomers(prev => prev.map(c => 
                c.id === selectedCustomer.id ? { 
                    ...c, 
                    aiPersona: result.persona, 
                    tags: [...(c.tags || []), ...result.tags], 
                    churnRisk: result.churnRisk 
                } : c
            ));
            toast.success("Profile Analyzed", { description: "AI Persona and Risk Score updated." });
        } catch (error) {
            toast.error("Analysis Failed");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto space-y-6 relative flex flex-col">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Customer Database</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Manage profiles, track LTV, and predict churn.</p>
                </div>
                <div className="flex gap-2">
                    <Button className={`${theme.bg} ${theme.hover} text-white`}>
                        <User className="w-4 h-4 mr-2" /> Add Customer
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <Input 
                        placeholder="Search by name or email..." 
                        className="pl-9 bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" /> Filters
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                {/* Customer List */}
                <Card className="lg:col-span-2 overflow-hidden border-0 shadow-md flex flex-col">
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-medium uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">LTV</th>
                                    <th className="px-6 py-4">Churn Risk</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {filteredCustomers.map(customer => (
                                    <tr 
                                        key={customer.id} 
                                        className={`hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer ${selectedCustomerId === customer.id ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                                        onClick={() => setSelectedCustomerId(customer.id)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={customer.avatar} className="w-10 h-10 rounded-full object-cover bg-gray-200" alt={customer.name} />
                                                <div>
                                                    <div className="font-bold text-gray-900 dark:text-white">{customer.name}</div>
                                                    <div className="text-xs text-gray-500">{customer.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className="font-normal">{customer.status}</Badge>
                                        </td>
                                        <td className="px-6 py-4 font-mono font-medium">
                                            ${customer.totalSpend.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getRiskColor(customer.churnRisk)}`}>
                                                {customer.churnRisk}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="icon" className="text-gray-400">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Detail View (Slide-over / Fixed Right) */}
                {selectedCustomer ? (
                    <Card className="flex flex-col h-full border-l-4 border-l-blue-500 overflow-hidden animate-slide-in-right">
                        <CardHeader className="bg-gray-50 dark:bg-gray-800/50 pb-6 border-b border-gray-100 dark:border-gray-800">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <img src={selectedCustomer.avatar} className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-gray-900 shadow-md" alt={selectedCustomer.name} />
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedCustomer.name}</h2>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                            <span>{selectedCustomer.visitCount} Visits</span>
                                            <span>•</span>
                                            <span>Since {new Date(selectedCustomer.createdAt || Date.now()).getFullYear()}</span>
                                        </div>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedCustomerId(null)}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline" className="w-full text-xs">
                                    <Mail className="w-3 h-3 mr-2" /> Email
                                </Button>
                                <Button variant="outline" className="w-full text-xs">
                                    <Phone className="w-3 h-3 mr-2" /> Call
                                </Button>
                            </div>
                        </CardHeader>
                        
                        <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
                            
                            {/* AI Persona Card */}
                            <div className={`p-4 rounded-xl border ${theme.lightBg} border-${theme.name}-200 dark:border-${theme.name}-900 dark:bg-opacity-10 relative overflow-hidden group`}>
                                <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                    <Sparkles className={`w-4 h-4 ${theme.text}`} />
                                </div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">AI Generated Persona</h3>
                                <div className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                    {selectedCustomer.aiPersona || "Analysis Needed"}
                                </div>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {selectedCustomer.tags?.map((tag, i) => (
                                        <span key={i} className="bg-white dark:bg-gray-900 px-2 py-1 rounded text-xs border border-gray-200 dark:border-gray-700 shadow-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className={`w-full text-xs hover:bg-white/50 dark:hover:bg-black/20`}
                                    onClick={handleAnalyzeProfile}
                                    disabled={isAnalyzing}
                                >
                                    {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <RefreshCw className="w-3 h-3 mr-2" />}
                                    {isAnalyzing ? "Analyzing History..." : "Refresh Insights"}
                                </Button>
                            </div>

                            {/* Metrics */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                                    <div className="text-xs text-gray-500 uppercase">Lifetime Value</div>
                                    <div className="text-xl font-bold text-gray-900 dark:text-white">${selectedCustomer.totalSpend.toLocaleString()}</div>
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                                    <div className="text-xs text-gray-500 uppercase">Churn Risk</div>
                                    <div className={`text-xl font-bold ${selectedCustomer.churnRisk === 'High' ? 'text-red-600' : selectedCustomer.churnRisk === 'Medium' ? 'text-orange-500' : 'text-green-600'}`}>
                                        {selectedCustomer.churnRisk}
                                    </div>
                                </div>
                            </div>

                            {/* History Timeline */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <History className="w-4 h-4" /> Activity History
                                </h3>
                                <div className="space-y-4 relative pl-4 border-l border-gray-200 dark:border-gray-700">
                                    {selectedCustomer.history.map((event, i) => (
                                        <div key={event.id} className="relative">
                                            <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-900 ${i === 0 ? theme.bg : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{event.description}</div>
                                            <div className="flex justify-between items-center text-xs text-gray-500 mt-0.5">
                                                <span>{new Date(event.date).toLocaleDateString()}</span>
                                                <span className="font-mono">${event.amount}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 p-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-900/50">
                        <User className="w-12 h-12 opacity-20 mb-3" />
                        <p className="text-sm font-medium">Select a customer to view deep profile</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper for icon
const History = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
);

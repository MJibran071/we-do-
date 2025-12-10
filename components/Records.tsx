
import React, { useState, useMemo, useRef } from 'react';
import { Booking, AppMode, BookingStatus, Apartment, Expense, ExpenseCategory, Platform, Restaurant } from '../types';
import { Search, Filter, Download, MoreHorizontal, AlertTriangle, CheckCircle2, Clock, XCircle, User, DollarSign, Package, Calendar, FileText, Printer, Share2, X, ChevronRight, Edit2, Save, Wrench, Sparkles, Lightbulb, ShoppingCart, Plus, TrendingDown, TrendingUp, XSquare, Mail, Send, Loader2, BarChart3, List, FileDown, PieChart as PieChartIcon, Camera, FileBarChart } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Logo } from './Logo';
import { mockExpenses } from '../data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { parseReceiptImage } from '../services/geminiService';
import { getTheme } from '../utils/theme';

interface RecordsProps {
  records: Booking[];
  appMode: AppMode;
  apartments: Apartment[];
  restaurants: Restaurant[];
  onUpdateRecord: (record: Booking) => void;
}

const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        [BookingStatus.Confirmed]: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        [BookingStatus.Pending]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        [BookingStatus.Cancelled]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        [BookingStatus.CheckedOut]: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
        'Paid': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        'Unpaid': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        'Partial': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
        'Refunded': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
};

// --- Modals with Themes ---

const FinancialReportModal = ({ records, expenses, onClose, appMode }: { records: Booking[], expenses: Expense[], onClose: () => void, appMode: AppMode }) => {
    const theme = getTheme(appMode);
    const totalRevenue = records.reduce((sum, r) => sum + r.totalPrice, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const netIncome = totalRevenue - totalExpenses;
    const estimatedTax = netIncome * 0.20; // Mock 20% tax rate

    // Group expenses by category
    const expenseBreakdown = expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4" onClick={onClose}>
            <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className={`p-6 flex justify-between items-center ${theme.bg} text-white shrink-0`}>
                    <div>
                        <div className="flex items-center gap-2">
                            <FileBarChart className="w-6 h-6" />
                            <h2 className="text-xl font-bold">Financial Summary Report</h2>
                        </div>
                        <p className="text-white/80 text-sm mt-1">Generated on {new Date().toLocaleDateString()}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <div className="p-8 overflow-y-auto bg-white dark:bg-gray-900 print:p-0" id="printable-report">
                    {/* Header for Print */}
                    <div className="hidden print:block mb-6">
                        <h1 className="text-2xl font-bold text-black">We Do - Business Report</h1>
                        <p className="text-gray-500">Period: All Time</p>
                        <hr className="my-4" />
                    </div>

                    <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="p-4 rounded-xl bg-green-50 border border-green-100 dark:bg-green-900/20 dark:border-green-900">
                            <div className="text-sm text-green-700 dark:text-green-300 font-medium mb-1">Total Revenue</div>
                            <div className="text-2xl font-bold text-green-800 dark:text-green-400">${totalRevenue.toLocaleString()}</div>
                        </div>
                        <div className="p-4 rounded-xl bg-red-50 border border-red-100 dark:bg-red-900/20 dark:border-red-900">
                            <div className="text-sm text-red-700 dark:text-red-300 font-medium mb-1">Total Expenses</div>
                            <div className="text-2xl font-bold text-red-800 dark:text-red-400">${totalExpenses.toLocaleString()}</div>
                        </div>
                        <div className={`p-4 rounded-xl ${theme.lightBg} border ${theme.border} dark:bg-opacity-20 dark:border-opacity-30`}>
                            <div className={`text-sm ${theme.text} dark:${theme.text.replace('600','300')} font-medium mb-1`}>Net Income</div>
                            <div className={`text-2xl font-bold ${theme.text} dark:${theme.text.replace('600','200')}`}>${netIncome.toLocaleString()}</div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b pb-2 border-gray-100 dark:border-gray-800">Expense Breakdown</h3>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-gray-500 text-left">
                                    <th className="pb-2">Category</th>
                                    <th className="pb-2 text-right">Amount</th>
                                    <th className="pb-2 text-right">%</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {Object.entries(expenseBreakdown).map(([cat, amount]) => (
                                    <tr key={cat}>
                                        <td className="py-2 text-gray-900 dark:text-gray-200">{cat}</td>
                                        <td className="py-2 text-right font-mono text-gray-700 dark:text-gray-300">${amount.toLocaleString()}</td>
                                        <td className="py-2 text-right text-gray-500">{((amount / totalExpenses) * 100).toFixed(1)}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Estimated Tax Liability (20%)</span>
                            <span className="font-bold text-gray-900 dark:text-white">${estimatedTax.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-gray-500">
                            *This is an estimate based on a standard 20% rate. Consult a tax professional for accurate filing.
                        </p>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 flex justify-end gap-3 shrink-0 border-t border-gray-200 dark:border-gray-700">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                    <Button onClick={() => window.print()} className={`${theme.bg} ${theme.hover} text-white`}>
                        <Printer className="w-4 h-4 mr-2" /> Print Report
                    </Button>
                </div>
            </div>
        </div>
    );
};

const ReceiptModal = ({ record, onClose, appMode }: { record: Booking; onClose: () => void; appMode: AppMode }) => {
  const theme = getTheme(appMode);
  const isProperty = appMode === 'property';
  const isRestaurant = appMode === 'restaurant';
  const isEcommerce = appMode === 'ecommerce';
  
  const total = record.totalPrice;
  const subtotal = record.financials?.basePrice || 0;
  const fees = record.financials?.fees || 0;
  const fines = record.financials?.fines || 0;
  const currency = record.financials?.currency || 'USD';

  // Terminology Mapping
  const labels = {
      dateLabel: isProperty ? 'Dates' : isRestaurant ? 'Reservation' : 'Delivery',
      dateValue: isRestaurant 
        ? `${new Date(record.checkIn).toLocaleDateString()} @ ${new Date(record.checkIn).getHours()}:00`
        : isEcommerce
            ? `Est. ${new Date(record.checkOut).toLocaleDateString()}`
            : `${new Date(record.checkIn).toLocaleDateString()} - ${new Date(record.checkOut).toLocaleDateString()}`,
      subtotalLabel: isProperty ? 'Accommodation Cost' : isRestaurant ? 'Food & Beverage' : 'Items Subtotal',
      feesLabel: isProperty ? 'Cleaning & Service Fees' : isRestaurant ? 'Service Charge' : 'Shipping & Handling',
      finesLabel: isProperty ? 'Damages / Late Fees' : 'Adjustments'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4" onClick={onClose}>
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className={`p-6 flex justify-between items-start ${theme.bg} text-white`}>
            <div>
                <Logo className="w-8 h-8 text-white" textClassName="text-white" />
                <div className="mt-4 text-xs text-white/70 uppercase tracking-wider">Receipt For</div>
                <div className="font-bold text-lg">{record.guestName}</div>
                <div className="text-sm text-white/70">ID: {record.id.toUpperCase()}</div>
            </div>
            <div className="text-right">
                <div className="text-xs text-white/70 uppercase tracking-wider">Total Amount</div>
                <div className="font-bold text-3xl">${total}</div>
                <div className="mt-2 inline-block px-2 py-0.5 rounded bg-white/20 text-white text-xs font-bold border border-white/30">
                    {record.paymentStatus.toUpperCase()}
                </div>
            </div>
        </div>

        <div className="p-8 relative pb-12 bg-white dark:bg-gray-900">
            <div className="flex justify-between mb-8 text-sm">
                <div>
                    <span className="block text-gray-500 dark:text-gray-400 text-xs uppercase">Date Issued</span>
                    <span className="font-medium text-gray-900 dark:text-white">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="text-right">
                    <span className="block text-gray-500 dark:text-gray-400 text-xs uppercase">{labels.dateLabel}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{labels.dateValue}</span>
                </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 my-4"></div>

            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">{labels.subtotalLabel}</span>
                    <span className="font-medium text-gray-900 dark:text-white">${subtotal}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">{labels.feesLabel}</span>
                    <span className="font-medium text-gray-900 dark:text-white">${fees}</span>
                </div>
                {fines > 0 && (
                    <div className="flex justify-between text-red-600 dark:text-red-400">
                        <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {labels.finesLabel}</span>
                        <span className="font-bold">+${fines}</span>
                    </div>
                )}
            </div>

            <div className="border-t-2 border-dashed border-gray-200 dark:border-gray-700 my-6"></div>

            <div className="flex justify-between items-center text-lg font-bold text-gray-900 dark:text-white">
                <span>Total</span>
                <span>{currency} ${total}</span>
            </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-4 flex gap-3">
             <Button className={`flex-1 gap-2 ${theme.bg} ${theme.hover} text-white`} onClick={() => window.print()}>
                 <Printer className="w-4 h-4" /> Print
             </Button>
             <Button variant="outline" className="flex-1 gap-2" onClick={onClose}>
                 <Share2 className="w-4 h-4" /> Share
             </Button>
             <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-2 right-2 text-white hover:text-gray-300 hover:bg-white/10">
                 <X className="w-5 h-5" />
             </Button>
        </div>
      </div>
    </div>
  );
};

const EditRecordModal = ({ record, onClose, onSave, appMode }: { record: Booking; onClose: () => void; onSave: (updated: Booking) => void; appMode: AppMode }) => {
    const [formData, setFormData] = useState(record);
    const theme = getTheme(appMode);
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4" onClick={onClose}>
            <Card className="w-full max-w-lg animate-scale-in" onClick={e => e.stopPropagation()}>
                <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Record</h3>
                        <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase">{appMode === 'property' ? 'Guest' : 'Customer'} Name</label>
                            <Input value={formData.guestName} onChange={e => setFormData({...formData, guestName: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase">Total Price</label>
                            <Input type="number" value={formData.totalPrice} onChange={e => setFormData({...formData, totalPrice: Number(e.target.value)})} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase">Status</label>
                            <select 
                                className="flex h-9 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-1 text-sm shadow-sm"
                                value={formData.status}
                                onChange={e => setFormData({...formData, status: e.target.value as BookingStatus})}
                            >
                                {Object.values(BookingStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase">Payment</label>
                            <select 
                                className="flex h-9 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-1 text-sm shadow-sm"
                                value={formData.paymentStatus}
                                onChange={e => setFormData({...formData, paymentStatus: e.target.value as any})}
                            >
                                {['Paid', 'Unpaid', 'Partial', 'Refunded'].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button onClick={() => onSave(formData)} className={`${theme.bg} ${theme.hover} text-white`}>Save Changes</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const EmailGuestModal = ({ record, onClose, appMode }: { record: Booking; onClose: () => void; appMode: AppMode }) => {
    const [sending, setSending] = useState(false);
    const [subject, setSubject] = useState(`Receipt for ${record.guestName}`);
    const [body, setBody] = useState(`Hi ${record.guestName},\n\nThank you for your business! Please find your receipt attached.\n\nBest,\nWe Do Team`);
    const theme = getTheme(appMode);

    const handleSend = () => {
        setSending(true);
        setTimeout(() => {
            setSending(false);
            onClose();
            alert(`Email sent to ${record.guestName}!`);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4" onClick={onClose}>
            <Card className="w-full max-w-lg animate-scale-in" onClick={e => e.stopPropagation()}>
                <CardContent className="p-6 space-y-4">
                     <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Email {appMode === 'property' ? 'Guest' : 'Customer'}</h3>
                        <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
                    </div>
                    
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Subject</label>
                        <Input value={subject} onChange={e => setSubject(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Message</label>
                        <textarea 
                            className="flex w-full rounded-md border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-2 text-sm shadow-sm min-h-[150px]"
                            value={body} 
                            onChange={e => setBody(e.target.value)} 
                        />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                        <PaperclipIcon className="w-3 h-3" />
                        <span>Receipt_{record.id}.pdf will be attached automatically.</span>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSend} disabled={sending} className={`${theme.bg} ${theme.hover} text-white`}>
                            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                            Send Email
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const ExpenseModal = ({ onClose, onSave, appMode }: { onClose: () => void; onSave: (expense: Expense) => void; appMode: AppMode }) => {
    const [formData, setFormData] = useState<Partial<Expense>>({
        date: new Date(),
        amount: 0,
        category: 'Maintenance',
        description: '',
        status: 'Pending'
    });
    const [isScanning, setIsScanning] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const theme = getTheme(appMode);

    const handleSubmit = () => {
        if (!formData.amount || !formData.description) return;
        onSave({
            id: `exp-${Date.now()}`,
            ...formData as Expense
        });
        onClose();
    };

    const handleScanReceipt = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setIsScanning(true);
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onloadend = async () => {
                const base64 = (reader.result as string).split(',')[1];
                try {
                    const result = await parseReceiptImage(base64);
                    setFormData(prev => ({
                        ...prev,
                        amount: result.amount || prev.amount,
                        description: `${result.vendor || 'Receipt Scan'} - ${prev.category}`,
                        date: result.date ? new Date(result.date) : new Date(),
                        category: result.category as ExpenseCategory || prev.category
                    }));
                } catch (error) {
                    console.error("Scan failed", error);
                    alert("Could not read receipt. Please enter details manually.");
                } finally {
                    setIsScanning(false);
                }
            };
        }
    };

    return (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4" onClick={onClose}>
            <Card className="w-full max-w-md animate-scale-in" onClick={e => e.stopPropagation()}>
                <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Log Expense</h3>
                        <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
                    </div>

                    {/* Scan Button */}
                    <div className="flex justify-center">
                        <input 
                            type="file" 
                            accept="image/*" 
                            ref={fileInputRef} 
                            className="hidden" 
                            onChange={handleScanReceipt} 
                        />
                        <Button 
                            variant="outline" 
                            className="w-full border-dashed border-2 py-6 flex flex-col gap-2 h-auto hover:bg-gray-50 dark:hover:bg-gray-800" 
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isScanning}
                        >
                            {isScanning ? <Loader2 className={`w-6 h-6 animate-spin ${theme.text}`} /> : <Camera className={`w-6 h-6 ${theme.text}`} />}
                            <span className="text-xs font-medium">{isScanning ? "Analyzing..." : "Scan Receipt Image"}</span>
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase">Amount ($)</label>
                            <Input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} />
                        </div>
                        <div>
                             <label className="text-xs font-semibold text-gray-500 uppercase">Category</label>
                             <select 
                                className="flex h-9 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-1 text-sm shadow-sm"
                                value={formData.category}
                                onChange={e => setFormData({...formData, category: e.target.value as ExpenseCategory})}
                             >
                                 {['Cleaning', 'Maintenance', 'Utilities', 'Inventory', 'Marketing', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                             </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Description</label>
                        <Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="e.g., Plumber for sink" />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSubmit} className={`${theme.bg} ${theme.hover} text-white`}>Log Expense</Button>
                    </div>
                </CardContent>
            </Card>
         </div>
    );
};

const PaperclipIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg>
);

// --- Main Component ---

const Records: React.FC<RecordsProps> = ({ records, appMode, apartments, restaurants, onUpdateRecord }) => {
  const theme = getTheme(appMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [activeModal, setActiveModal] = useState<{ type: 'receipt' | 'edit' | 'email' | 'expense' | 'financial_report' | null, data?: any }>({ type: null });
  
  // Date Filtering State
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // View State
  const [viewMode, setViewMode] = useState<'list' | 'analytics'>('list');

  // Local State for Expenses (merged with mock)
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);

  const handleSaveExpense = (newExpense: Expense) => {
      setExpenses([newExpense, ...expenses]);
  };

  // ... (Filtering Logic Same) ...
  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const matchesSearch = 
        record.guestName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        record.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || record.status === statusFilter || record.paymentStatus === statusFilter;

      let matchesDate = true;
      if (startDate) {
          matchesDate = matchesDate && new Date(record.checkIn) >= new Date(startDate);
      }
      if (endDate) {
          matchesDate = matchesDate && new Date(record.checkIn) <= new Date(endDate);
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [records, searchQuery, statusFilter, startDate, endDate]);

  const filteredExpenses = useMemo(() => {
      return expenses.filter(exp => {
          let matchesDate = true;
          if (startDate) matchesDate = matchesDate && new Date(exp.date) >= new Date(startDate);
          if (endDate) matchesDate = matchesDate && new Date(exp.date) <= new Date(endDate);
          return matchesDate;
      });
  }, [expenses, startDate, endDate]);

  const totalRevenue = filteredRecords.reduce((sum, r) => sum + r.totalPrice, 0);
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  const platformData = useMemo(() => {
      const counts: Record<string, number> = {};
      filteredRecords.forEach(r => {
          counts[r.platform] = (counts[r.platform] || 0) + r.totalPrice;
      });
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredRecords]);

  const expenseCategoryData = useMemo(() => {
      const counts: Record<string, number> = {};
      filteredExpenses.forEach(e => {
          counts[e.category] = (counts[e.category] || 0) + e.amount;
      });
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredExpenses]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const handleExportCSV = () => {
    // ... (CSV logic same) ...
    const headers = ["ID", "Guest Name", "Check In", "Check Out", "Status", "Platform", "Total Price", "Payment Status"];
    const rows = filteredRecords.map(r => [r.id, r.guestName, new Date(r.checkIn).toLocaleDateString(), new Date(r.checkOut).toLocaleDateString(), r.status, r.platform, r.totalPrice, r.paymentStatus]);
    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `records_export_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Dynamic Label Helpers ---
  const getGuestLabel = () => appMode === 'property' ? 'Guest' : appMode === 'restaurant' ? 'Diner' : 'Customer';
  const getDateLabel = () => appMode === 'property' ? 'Check In' : appMode === 'restaurant' ? 'Time' : 'Order Date';

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto space-y-6">
      
      {/* Toolbar */}
      <div className="flex flex-col gap-4">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Records & Financials</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Track bookings, expenses, and generate invoices.</p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => setActiveModal({ type: 'financial_report' })} className={`border-${theme.name}-200 hover:${theme.lightBg}`}>
                    <FileBarChart className="w-4 h-4 mr-2" /> Tax Report
                </Button>
                <Button variant="outline" onClick={handleExportCSV}>
                    <FileDown className="w-4 h-4 mr-2" /> Export CSV
                </Button>
                <Button onClick={() => setActiveModal({ type: 'expense' })} className={`${theme.bg} ${theme.hover} text-white`}>
                    <Plus className="w-4 h-4 mr-2" /> Log Expense
                </Button>
            </div>
         </div>

         <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
             {/* Left Controls */}
             <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
                 <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <Input 
                        placeholder={`Search ${getGuestLabel().toLowerCase()} or ID...`} 
                        className="pl-9 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                 </div>
                 <select 
                    className="h-10 rounded-md border border-gray-200 dark:border-gray-700 bg-transparent px-3 text-sm text-gray-900 dark:text-gray-100 dark:bg-gray-900"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                 >
                    <option value="All">All Status</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                 </select>
             </div>

             {/* Date Pickers */}
             <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto">
                 <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                    <Calendar className="w-4 h-4 text-gray-400 ml-2" />
                    <input 
                        type="date" 
                        className="bg-transparent border-none text-sm text-gray-600 dark:text-gray-300 focus:ring-0"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <span className="text-gray-400">-</span>
                    <input 
                        type="date" 
                        className="bg-transparent border-none text-sm text-gray-600 dark:text-gray-300 focus:ring-0"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                    {(startDate || endDate) && (
                        <button onClick={() => { setStartDate(''); setEndDate(''); }} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
                            <X className="w-3 h-3 text-gray-500" />
                        </button>
                    )}
                 </div>
             </div>

             {/* View Toggle */}
             <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg shrink-0">
                 <Button 
                    variant={viewMode === 'list' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => setViewMode('list')}
                    className={`h-8 px-3 ${viewMode === 'list' ? `${theme.bg} text-white hover:${theme.hover.replace('hover:','')}` : ''}`}
                 >
                     <List className="w-4 h-4 mr-2" /> List
                 </Button>
                 <Button 
                    variant={viewMode === 'analytics' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => setViewMode('analytics')}
                    className={`h-8 px-3 ${viewMode === 'analytics' ? `${theme.bg} text-white hover:${theme.hover.replace('hover:','')}` : ''}`}
                 >
                     <BarChart3 className="w-4 h-4 mr-2" /> Analytics
                 </Button>
             </div>
         </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                      <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">${totalRevenue.toLocaleString()}</h3>
                      </div>
                      <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                  </div>
              </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                      <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Expenses</p>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">${totalExpenses.toLocaleString()}</h3>
                      </div>
                      <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <TrendingDown className="w-5 h-5 text-red-600" />
                      </div>
                  </div>
              </CardContent>
          </Card>
          <Card className={`border-l-4 border-l-${theme.name}-500`}>
              <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                      <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Net Profit</p>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">${netProfit.toLocaleString()}</h3>
                      </div>
                      <div className={`p-2 ${theme.lightBg} dark:bg-opacity-20 rounded-lg`}>
                          <DollarSign className={`w-5 h-5 ${theme.text}`} />
                      </div>
                  </div>
              </CardContent>
          </Card>
      </div>

      {/* Content Area - List or Analytics */}
      {viewMode === 'list' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bookings / Income Table */}
            <Card className="lg:col-span-2 overflow-hidden">
                <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 py-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{appMode === 'property' ? 'Income (Bookings)' : appMode === 'restaurant' ? 'Revenue (Checks)' : 'Sales (Orders)'}</CardTitle>
                        <Badge variant="outline" className="bg-white dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">{filteredRecords.length} records</Badge>
                    </div>
                </CardHeader>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
                            <tr>
                                <th className="px-6 py-3">{getGuestLabel()} / ID</th>
                                <th className="px-6 py-3">{getDateLabel()}</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {filteredRecords.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No records found matching filters.</td>
                                </tr>
                            ) : filteredRecords.map(record => (
                                <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900 dark:text-white">{record.guestName}</div>
                                        <div className="text-xs text-gray-500 font-mono">#{record.id.slice(0,8)}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                        {appMode === 'restaurant' 
                                            ? `${new Date(record.checkIn).toLocaleDateString()} @ ${new Date(record.checkIn).getHours()}:00`
                                            : new Date(record.checkIn).toLocaleDateString()
                                        }
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 items-start">
                                            <StatusBadge status={record.status} />
                                            <StatusBadge status={record.paymentStatus} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">
                                        ${record.totalPrice}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" title="Receipt" onClick={() => setActiveModal({ type: 'receipt', data: record })}>
                                                <FileText className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" title="Edit" onClick={() => setActiveModal({ type: 'edit', data: record })}>
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" title="Email" onClick={() => setActiveModal({ type: 'email', data: record })}>
                                                <Mail className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Expenses Table */}
            <Card className="overflow-hidden h-fit">
                <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 py-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Expenses</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => setActiveModal({ type: 'expense' })} className={`hover:${theme.lightBg} hover:${theme.text}`}><Plus className="w-3 h-3 mr-1" /> Add</Button>
                    </div>
                </CardHeader>
                <div className="overflow-x-auto">
                     <table className="w-full text-sm text-left">
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {filteredExpenses.length === 0 ? (
                                 <tr><td className="px-6 py-8 text-center text-gray-500">No expenses found.</td></tr>
                            ) : filteredExpenses.map(exp => (
                                <tr key={exp.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-gray-900 dark:text-white">{exp.category}</div>
                                        <div className="text-xs text-gray-500 truncate max-w-[120px]">{exp.description}</div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="font-medium text-red-600 dark:text-red-400">-${exp.amount}</div>
                                        <div className="text-xs text-gray-400">{new Date(exp.date).toLocaleDateString()}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                     </table>
                </div>
            </Card>
          </div>
      ) : (
          // Analytics View
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
               <Card>
                   <CardHeader>
                       <CardTitle>Revenue by Platform</CardTitle>
                   </CardHeader>
                   <CardContent className="h-[300px]">
                       <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                               <Pie
                                   data={platformData}
                                   cx="50%"
                                   cy="50%"
                                   innerRadius={60}
                                   outerRadius={100}
                                   fill="#8884d8"
                                   dataKey="value"
                                   paddingAngle={5}
                                   label
                               >
                                   {platformData.map((entry, index) => (
                                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                   ))}
                               </Pie>
                               <Tooltip />
                               <Legend />
                           </PieChart>
                       </ResponsiveContainer>
                   </CardContent>
               </Card>

               <Card>
                   <CardHeader>
                       <CardTitle>Expense Breakdown</CardTitle>
                   </CardHeader>
                   <CardContent className="h-[300px]">
                       <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={expenseCategoryData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                               <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                               <XAxis type="number" />
                               <YAxis dataKey="name" type="category" width={100} />
                               <Tooltip cursor={{fill: 'transparent'}} />
                               <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={30} />
                           </BarChart>
                       </ResponsiveContainer>
                   </CardContent>
               </Card>

               <Card className="lg:col-span-2">
                   <CardHeader>
                       <CardTitle>Financial Trend</CardTitle>
                   </CardHeader>
                   <CardContent className="h-[300px]">
                       {/* Using booking check-ins as simple timeline trend */}
                       <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={[...filteredRecords].sort((a,b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime())}>
                               <defs>
                                   <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                       <stop offset="5%" stopColor={theme.hex} stopOpacity={0.8}/>
                                       <stop offset="95%" stopColor={theme.hex} stopOpacity={0}/>
                                   </linearGradient>
                               </defs>
                               <XAxis dataKey="checkIn" tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, {month:'short', day:'numeric'})} />
                               <YAxis />
                               <CartesianGrid strokeDasharray="3 3" vertical={false} />
                               <Tooltip labelFormatter={(val) => new Date(val).toLocaleDateString()} />
                               <Area type="monotone" dataKey="totalPrice" stroke={theme.hex} fillOpacity={1} fill="url(#colorPrice)" />
                           </AreaChart>
                       </ResponsiveContainer>
                   </CardContent>
               </Card>
          </div>
      )}

      {/* Modals */}
      {activeModal.type === 'financial_report' && (
          <FinancialReportModal 
              records={filteredRecords} 
              expenses={filteredExpenses} 
              onClose={() => setActiveModal({ type: null })}
              appMode={appMode}
          />
      )}
      {activeModal.type === 'receipt' && activeModal.data && (
          <ReceiptModal record={activeModal.data} onClose={() => setActiveModal({ type: null })} appMode={appMode} />
      )}
      {activeModal.type === 'edit' && activeModal.data && (
          <EditRecordModal 
              record={activeModal.data} 
              onClose={() => setActiveModal({ type: null })} 
              appMode={appMode}
              onSave={(updated) => { onUpdateRecord(updated); setActiveModal({ type: null }); }} 
          />
      )}
      {activeModal.type === 'email' && activeModal.data && (
          <EmailGuestModal record={activeModal.data} onClose={() => setActiveModal({ type: null })} appMode={appMode} />
      )}
      {activeModal.type === 'expense' && (
          <ExpenseModal onClose={() => setActiveModal({ type: null })} onSave={handleSaveExpense} appMode={appMode} />
      )}

    </div>
  );
};

export default Records;

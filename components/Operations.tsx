import React, { useState, useRef } from 'react';
import { Booking, MaintenanceIssue, Apartment, Integration, CleaningStatus, Restaurant, Vendor, InventoryItem, AppMode, SmartRailContext } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ClipboardList, Wrench, CheckCircle2, Calendar, User, Loader2, Plus, RefreshCw, Sparkles, Square, BrainCircuit, AlertTriangle, TrendingUp, Box, GripVertical, Check, Eye, ImageIcon, Users, Copy, Phone, Mail, Trash2, MessageSquare, ScanLine, ShoppingCart, Camera, Wifi, Lock, Unlock, Thermometer, Zap, Battery, Activity, Settings, History, Play, Siren, Sun, FileText, Send, ExternalLink, Monitor, Bug, MousePointerClick, Bluetooth, QrCode, Router, Tag, DollarSign, Signal, X, ToggleRight, PartyPopper, Heart, PenTool, ClipboardCheck, Info, Focus } from 'lucide-react';
import { assignMaintenanceTicket, generateVendorRecommendation, analyzeInventoryPhoto, diagnoseMaintenanceIssue } from '../services/geminiService';
import { mockInventory } from '../data';
import { getTheme } from '../utils/theme';
import { toast } from 'sonner';

interface OperationsProps {
    bookings: Booking[];
    setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
    maintenanceIssues: MaintenanceIssue[];
    setMaintenanceIssues: React.Dispatch<React.SetStateAction<MaintenanceIssue[]>>;
    apartments: Apartment[];
    restaurants: Restaurant[];
    integrations: Integration[];
    appMode: AppMode;
    onSelectContext?: (context: SmartRailContext) => void;
}

interface ProposedAction {
    id: string;
    type: 'Scheduling' | 'Maintenance' | 'Inventory' | 'Optimization';
    title: string;
    description: string;
    impact: string;
    confidence: number;
    approved: boolean;
    relatedBookingId?: string;
    imageUrl?: string; 
}

interface SmartDevice {
    id: string;
    name: string;
    type: 'Lock' | 'Thermostat' | 'Sensor' | 'Hub';
    entityId: string; 
    status: 'Online' | 'Offline';
    battery: number;
    signal: 'Strong' | 'Medium' | 'Weak';
    lastSync: Date;
    data: {
        locked?: boolean;
        code?: string;
        temp?: number;
        targetTemp?: number;
        mode?: 'Cool' | 'Heat' | 'Eco';
        level?: string; 
    };
    config?: {
        autoLockDelay?: number;
        syncBookingCodes?: boolean;
        ecoTemp?: number;
        preCool?: boolean;
        noiseThreshold?: number;
        autoNotify?: boolean;
    };
}

interface DeviceLog {
    id: string;
    deviceId: string;
    timestamp: Date;
    event: string;
    type: 'info' | 'warning' | 'success' | 'error';
}

const STAFF_ROLES: Record<string, string> = {
    'Plumber': 'Mario (Plumber)',
    'Electrician': 'Luigi (Electrician)',
    'Handyman': 'Bob (Handyman)',
    'Cleaner': 'Alice (Cleaner)',
    'IT Support': 'Tech Team',
    'Pool Service': 'Pool Guys Inc.',
    'Developer': 'Sarah (Dev)',
    'SysAdmin': 'Mike (Ops)'
};

const MOCK_VENDORS: Vendor[] = [
    { id: 'v1', name: 'City Surf School', serviceCategory: 'Activities', contactInfo: 'surf@city.com', commissionRate: 15, notes: 'Family friendly' },
    { id: 'v2', name: 'Luxury Airport Transfer', serviceCategory: 'Transport', contactInfo: '+1 555 0199', commissionRate: 10, notes: 'Requires 24h notice' },
    { id: 'v3', name: 'Chef Marco', serviceCategory: 'Food', contactInfo: 'chef@marco.com', commissionRate: 20, notes: 'Min $200 order' }
];

const MOCK_DEVICES: SmartDevice[] = [
    { 
        id: 'd1', 
        name: 'Front Door', 
        type: 'Lock', 
        entityId: 'apt1', 
        status: 'Online', 
        battery: 85, 
        signal: 'Strong',
        lastSync: new Date(),
        data: { locked: true, code: '4829' },
        config: { autoLockDelay: 30, syncBookingCodes: true } 
    },
    { 
        id: 'd2', 
        name: 'Living Room', 
        type: 'Thermostat', 
        entityId: 'apt1', 
        status: 'Online', 
        battery: 100, 
        signal: 'Strong',
        lastSync: new Date(),
        data: { temp: 72, targetTemp: 70, mode: 'Cool' },
        config: { ecoTemp: 78, preCool: true }
    },
    { 
        id: 'd3', 
        name: 'Main Entrance', 
        type: 'Lock', 
        entityId: 'rest1', 
        status: 'Online', 
        battery: 40, 
        signal: 'Medium',
        lastSync: new Date(Date.now() - 1000 * 60 * 15),
        data: { locked: false, code: 'OPEN' } 
    },
    { 
        id: 'd4', 
        name: 'Noise Monitor', 
        type: 'Sensor', 
        entityId: 'apt2', 
        status: 'Online', 
        battery: 92, 
        signal: 'Strong',
        lastSync: new Date(),
        data: { level: '45dB (Quiet)' },
        config: { noiseThreshold: 75, autoNotify: true }
    },
    { 
        id: 'd5', 
        name: 'Master Bedroom', 
        type: 'Thermostat', 
        entityId: 'apt3', 
        status: 'Offline', 
        battery: 0, 
        signal: 'Weak',
        lastSync: new Date(Date.now() - 1000 * 60 * 60 * 24),
        data: { temp: 68, targetTemp: 72, mode: 'Heat' } 
    },
];

const MOCK_LOGS: DeviceLog[] = [
    { id: 'l1', deviceId: 'd1', timestamp: new Date(Date.now() - 1000 * 60 * 5), event: 'Unlocked by Keypad (Code: 4829)', type: 'success' },
    { id: 'l2', deviceId: 'd1', timestamp: new Date(Date.now() - 1000 * 60 * 35), event: 'Locked Automatically', type: 'info' },
    { id: 'l3', deviceId: 'd2', timestamp: new Date(Date.now() - 1000 * 60 * 60), event: 'Mode changed to Cool', type: 'info' },
    { id: 'l4', deviceId: 'd4', timestamp: new Date(Date.now() - 1000 * 60 * 120), event: 'Noise Alert: 85dB detected', type: 'warning' },
    { id: 'l5', deviceId: 'd3', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), event: 'Battery Low (15%)', type: 'warning' },
];

const PurchaseOrderModal = ({ item, onClose, theme }: { item: InventoryItem; onClose: () => void, theme: any }) => {
    const [isSending, setIsSending] = useState(false);
    
    const handleSend = () => {
        setIsSending(true);
        setTimeout(() => {
            setIsSending(false);
            onClose();
            toast.success('Purchase Order Sent', { description: `Order sent to ${item.supplier}` });
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4" onClick={onClose}>
            <Card className="w-full max-w-lg animate-scale-in border-0 shadow-xl" onClick={e => e.stopPropagation()}>
                <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
                    <CardTitle className="flex items-center gap-2">
                        <FileText className={`w-5 h-5 ${theme.text}`} />
                        Purchase Order Generator
                    </CardTitle>
                    <CardDescription>Review auto-generated order for {item.supplier}</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 font-mono text-sm mb-6">
                        <div className="flex justify-between mb-4">
                            <span className="font-bold">PO #{Math.floor(Math.random() * 10000)}</span>
                            <span className="text-gray-500">{new Date().toLocaleDateString()}</span>
                        </div>
                        <div className="mb-4">
                            <div className="text-xs text-gray-500 uppercase mb-1">To Supplier</div>
                            <div className="font-bold">{item.supplier}</div>
                            <div>orders@{item.supplier?.toLowerCase().replace(' ', '')}.com</div>
                        </div>
                        <table className="w-full mb-4">
                            <thead>
                                <tr className="text-left text-xs text-gray-500 border-b border-gray-200 dark:border-gray-700">
                                    <th className="pb-2">Item</th>
                                    <th className="pb-2 text-right">Qty</th>
                                    <th className="pb-2 text-right">Unit Cost</th>
                                    <th className="pb-2 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="py-2">{item.name}</td>
                                    <td className="py-2 text-right">{item.minThreshold * 2}</td>
                                    <td className="py-2 text-right">$12.50</td>
                                    <td className="py-2 text-right font-bold">$25.00</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="text-right">
                            <span className="text-xs text-gray-500 uppercase mr-4">Total Amount</span>
                            <span className="text-xl font-bold">$25.00</span>
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={onClose} disabled={isSending}>Cancel</Button>
                        <Button onClick={handleSend} className={`${theme.bg} hover:${theme.hover.replace('hover:', '')} text-white`} disabled={isSending}>
                            {isSending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                            Approve & Email
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const Operations: React.FC<OperationsProps> = ({ bookings, setBookings, maintenanceIssues, setMaintenanceIssues, apartments, restaurants, integrations, appMode, onSelectContext }) => {
    const theme = getTheme(appMode);
    const [activeTab, setActiveTab] = useState<'housekeeping' | 'maintenance' | 'partners' | 'inventory' | 'devices'>('housekeeping');
    const [isSyncing, setIsSyncing] = useState(false);
    const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
    const [generatingRec, setGeneratingRec] = useState<string | null>(null);
    
    // Inventory State
    const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
    const [isScanningInventory, setIsScanningInventory] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [poItem, setPoItem] = useState<InventoryItem | null>(null);
    
    // Devices State
    const [devices, setDevices] = useState<SmartDevice[]>(MOCK_DEVICES);
    const [deviceLogs, setDeviceLogs] = useState<DeviceLog[]>(MOCK_LOGS);
    const [editingDeviceId, setEditingDeviceId] = useState<string | null>(null);
    
    // Kanban State
    const [draggedIssueId, setDraggedIssueId] = useState<string | null>(null);
    const [assigningIssueId, setAssigningIssueId] = useState<string | null>(null);

    const handleCameraCapture = () => {
        setIsScanningInventory(true);
        setTimeout(() => {
            const updatedInventory = inventory.map(item => {
                if (item.name === 'Toilet Paper') return { ...item, quantity: 24, lastRestocked: new Date() };
                if (item.name === 'Coffee Pods') return { ...item, quantity: 50, lastRestocked: new Date() };
                return item;
            });
            setInventory(updatedInventory);
            setIsScanningInventory(false);
            setShowCamera(false);
            toast.success("Shelf Scanned", { description: "Updated counts for 2 items." });
        }, 1500);
    };

    const handleScanClick = () => {
        setShowCamera(true);
    };

    const updateCleaningStatus = (bookingId: string, status: string) => {
        setBookings(prev => prev.map(b => 
            b.id === bookingId ? { ...b, cleaningStatus: status as CleaningStatus } : b
        ));
        toast.success('Status Updated', { description: `Cleaning status changed to ${status}` });
    };

    const handleAssignMaintenance = async (issueId: string) => {
        setAssigningIssueId(issueId);
        try {
            const issue = maintenanceIssues.find(i => i.id === issueId);
            if (!issue) return;
            
            const assignment = await assignMaintenanceTicket(issue.issue);
            
            setMaintenanceIssues(prev => prev.map(i => 
                i.id === issueId ? { ...i, assignedTo: assignment.role, status: 'In Progress' } : i
            ));
            
            toast.success('Ticket Assigned', { description: `Assigned to ${assignment.role}` });
        } catch (error) {
            toast.error('Assignment Failed', { description: 'Could not assign ticket' });
        } finally {
            setAssigningIssueId(null);
        }
    };

    const handleDragStart = (issueId: string) => {
        setDraggedIssueId(issueId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (status: 'Open' | 'In Progress' | 'Resolved') => {
        if (!draggedIssueId) return;
        
        setMaintenanceIssues(prev => prev.map(i => 
            i.id === draggedIssueId ? { ...i, status } : i
        ));
        
        setDraggedIssueId(null);
        toast.success('Status Updated', { description: `Moved to ${status}` });
    };

    const handleGenerateRecommendation = async (vendorId: string) => {
        setGeneratingRec(vendorId);
        try {
            const vendor = vendors.find(v => v.id === vendorId);
            if (!vendor) return;
            
            const recommendation = await generateVendorRecommendation(vendor.name, vendor.serviceCategory, '');
            toast.success('Recommendation Generated', { description: recommendation.substring(0, 100) + '...' });
        } catch (error) {
            toast.error('Generation Failed');
        } finally {
            setGeneratingRec(null);
        }
    };

    const toggleDeviceLock = (deviceId: string) => {
        setDevices(prev => prev.map(d => 
            d.id === deviceId && d.type === 'Lock' 
                ? { ...d, data: { ...d.data, locked: !d.data.locked } }
                : d
        ));
        
        const device = devices.find(d => d.id === deviceId);
        const newLog: DeviceLog = {
            id: `log-${Date.now()}`,
            deviceId,
            timestamp: new Date(),
            event: device?.data.locked ? 'Unlocked remotely' : 'Locked remotely',
            type: 'success'
        };
        setDeviceLogs(prev => [newLog, ...prev]);
        toast.success(device?.data.locked ? 'Unlocked' : 'Locked');
    };

    const adjustThermostat = (deviceId: string, delta: number) => {
        setDevices(prev => prev.map(d => 
            d.id === deviceId && d.type === 'Thermostat'
                ? { ...d, data: { ...d.data, targetTemp: (d.data.targetTemp || 70) + delta } }
                : d
        ));
        toast.success('Temperature Adjusted');
    };

    const tabs = [
        { id: 'housekeeping', label: appMode === 'property' ? 'Housekeeping' : 'Fulfillment', icon: ClipboardList },
        { id: 'maintenance', label: 'Maintenance', icon: Wrench },
        { id: 'inventory', label: 'Shelf-to-Sheet', icon: Box },
        { id: 'devices', label: 'IoT', icon: Wifi },
        { id: 'partners', label: 'Partners', icon: Users },
    ];

    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto space-y-6 relative">
            
            {/* Purchase Order Modal */}
            {poItem && (
                <PurchaseOrderModal 
                    item={poItem}
                    onClose={() => setPoItem(null)}
                    theme={theme}
                />
            )}

            {/* Visual Inventory Overlay */}
            {showCamera && (
                <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center animate-fade-in">
                    <div className="absolute top-4 right-4 z-50">
                        <Button variant="ghost" className="text-white hover:bg-white/20" onClick={() => setShowCamera(false)}>
                            <X className="w-6 h-6" />
                        </Button>
                    </div>
                    
                    <div className="relative w-full max-w-2xl aspect-[3/4] md:aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-70"></div>
                        
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-64 h-64 border-2 border-white/50 rounded-lg relative">
                                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-green-500 -mt-1 -ml-1"></div>
                                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-green-500 -mt-1 -mr-1"></div>
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-green-500 -mb-1 -ml-1"></div>
                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-green-500 -mb-1 -mr-1"></div>
                                
                                <div className="absolute top-0 left-0 w-full h-0.5 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-scan-down"></div>
                            </div>
                        </div>

                        {isScanningInventory && (
                            <div className="absolute top-1/3 left-1/4 bg-green-500/80 text-white text-xs px-2 py-1 rounded animate-pulse">
                                Toilet Paper: 24
                            </div>
                        )}

                        <div className="absolute bottom-8 left-0 right-0 flex justify-center z-50">
                            <button 
                                onClick={handleCameraCapture}
                                className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-white/20 hover:bg-white/40 transition-all active:scale-95"
                            >
                                <div className="w-12 h-12 bg-white rounded-full"></div>
                            </button>
                        </div>
                    </div>
                    <p className="text-white mt-4 text-sm font-medium">Align items within the frame</p>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Operations Center</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Manage housekeeping, maintenance, and visual inventory.</p>
                </div>
            </div>

            <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                            activeTab === tab.id 
                                ? `${theme.bg} text-white shadow-md` 
                                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* TAB: HOUSEKEEPING */}
            {activeTab === 'housekeeping' && (
                <div className="space-y-6 animate-fade-in">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ClipboardList className="w-5 h-5" />
                                {appMode === 'property' ? 'Cleaning Schedule' : 'Order Fulfillment'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {bookings.filter(b => b.cleaningStatus !== 'Clean').slice(0, 5).map(booking => (
                                    <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${
                                                booking.cleaningStatus === 'Dirty' ? 'bg-yellow-100 text-yellow-600' :
                                                booking.cleaningStatus === 'In Progress' ? 'bg-blue-100 text-blue-600' :
                                                'bg-green-100 text-green-600'
                                            }`}>
                                                <ClipboardList className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white">{booking.guestName}</h4>
                                                <p className="text-sm text-gray-500">
                                                    {appMode === 'property' ? apartments.find(a => a.id === booking.apartmentId)?.name : 'Order #' + booking.id}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={
                                                booking.cleaningStatus === 'Dirty' ? 'secondary' :
                                                booking.cleaningStatus === 'In Progress' ? 'default' :
                                                'outline'
                                            }>
                                                {booking.cleaningStatus || 'Scheduled'}
                                            </Badge>
                                            <select
                                                value={booking.cleaningStatus || 'Scheduled'}
                                                onChange={(e) => updateCleaningStatus(booking.id, e.target.value)}
                                                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900"
                                            >
                                                <option value="Scheduled">Scheduled</option>
                                                <option value="Dirty">Dirty</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Clean">Clean</option>
                                            </select>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* TAB: MAINTENANCE */}
            {activeTab === 'maintenance' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(['Open', 'In Progress', 'Resolved'] as const).map(status => (
                            <div 
                                key={status}
                                onDragOver={handleDragOver}
                                onDrop={() => handleDrop(status)}
                                className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 min-h-[400px]"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        {status === 'Open' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                                        {status === 'In Progress' && <Loader2 className="w-4 h-4 text-blue-500" />}
                                        {status === 'Resolved' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                        {status}
                                    </h3>
                                    <Badge variant="secondary">
                                        {maintenanceIssues.filter(i => i.status === status).length}
                                    </Badge>
                                </div>
                                
                                <div className="space-y-3">
                                    {maintenanceIssues.filter(i => i.status === status).map(issue => (
                                        <Card 
                                            key={issue.id}
                                            draggable
                                            onDragStart={() => handleDragStart(issue.id)}
                                            className="cursor-move hover:shadow-md transition-all"
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <GripVertical className="w-4 h-4 text-gray-400" />
                                                        <Badge variant={
                                                            issue.priority === 'High' ? 'destructive' :
                                                            issue.priority === 'Medium' ? 'default' :
                                                            'secondary'
                                                        }>
                                                            {issue.priority}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-900 dark:text-white font-medium mb-2">
                                                    {issue.issue}
                                                </p>
                                                <div className="flex items-center justify-between text-xs text-gray-500">
                                                    <span>{issue.location || 'No location'}</span>
                                                    {issue.assignedTo && (
                                                        <span className="flex items-center gap-1">
                                                            <User className="w-3 h-3" />
                                                            {issue.assignedTo}
                                                        </span>
                                                    )}
                                                </div>
                                                {status === 'Open' && !issue.assignedTo && (
                                                    <Button
                                                        size="sm"
                                                        className="w-full mt-3"
                                                        onClick={() => handleAssignMaintenance(issue.id)}
                                                        disabled={assigningIssueId === issue.id}
                                                    >
                                                        {assigningIssueId === issue.id ? (
                                                            <Loader2 className="w-3 h-3 animate-spin mr-2" />
                                                        ) : (
                                                            <Sparkles className="w-3 h-3 mr-2" />
                                                        )}
                                                        AI Assign
                                                    </Button>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB: INVENTORY */}
            {activeTab === 'inventory' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Focus className="w-6 h-6 text-green-400" /> Visual Inventory
                            </h3>
                            <p className="text-gray-300 text-sm mt-2 max-w-lg">
                                Point your camera at a shelf or fridge. AI counts items instantly and updates your sheet.
                            </p>
                        </div>
                        <div className="relative z-10">
                            <Button 
                                onClick={handleScanClick} 
                                className="bg-white text-gray-900 hover:bg-gray-100 font-bold shadow-lg"
                            >
                                <Camera className="w-4 h-4 mr-2" /> Start Scan
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {inventory.map(item => (
                            <Card key={item.id} className="hover:shadow-md transition-all">
                                <CardContent className="p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400`}>
                                                <Box className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white">{item.name}</h4>
                                                <div className="text-xs text-gray-500">{item.category}</div>
                                            </div>
                                        </div>
                                        {item.quantity <= item.minThreshold && (
                                            <Badge variant="destructive" className="animate-pulse">Low Stock</Badge>
                                        )}
                                    </div>
                                    
                                    <div className="flex items-end justify-between mb-4">
                                        <div>
                                            <div className="text-3xl font-bold text-gray-900 dark:text-white">{item.quantity}</div>
                                            <div className="text-xs text-gray-500">{item.unit} available</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-gray-400 mb-1">Min Level</div>
                                            <div className="font-medium text-gray-700 dark:text-gray-300">{item.minThreshold}</div>
                                        </div>
                                    </div>

                                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 mb-4 overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-500 ${item.quantity <= item.minThreshold ? 'bg-red-500' : 'bg-green-500'}`}
                                            style={{ width: `${Math.min(100, (item.quantity / (item.minThreshold * 3)) * 100)}%` }}
                                        ></div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => setInventory(prev => prev.map(i => i.id === item.id ? {...i, quantity: Math.max(0, i.quantity - 1)} : i))}>
                                            - Adjust
                                        </Button>
                                        {item.quantity <= item.minThreshold && (
                                            <Button size="sm" className={`flex-1 text-xs ${theme.bg} text-white`} onClick={() => setPoItem(item)}>
                                                Reorder
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB: DEVICES (IoT) */}
            {activeTab === 'devices' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {devices.map(device => (
                            <Card key={device.id} className={`${device.status === 'Offline' ? 'opacity-60' : ''}`}>
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${
                                                device.type === 'Lock' ? 'bg-blue-100 text-blue-600' :
                                                device.type === 'Thermostat' ? 'bg-orange-100 text-orange-600' :
                                                device.type === 'Sensor' ? 'bg-purple-100 text-purple-600' :
                                                'bg-gray-100 text-gray-600'
                                            }`}>
                                                {device.type === 'Lock' && <Lock className="w-5 h-5" />}
                                                {device.type === 'Thermostat' && <Thermometer className="w-5 h-5" />}
                                                {device.type === 'Sensor' && <Activity className="w-5 h-5" />}
                                                {device.type === 'Hub' && <Router className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white">{device.name}</h4>
                                                <div className="text-xs text-gray-500">{device.type}</div>
                                            </div>
                                        </div>
                                        <Badge variant={device.status === 'Online' ? 'default' : 'secondary'}>
                                            {device.status}
                                        </Badge>
                                    </div>

                                    {/* Device-specific controls */}
                                    {device.type === 'Lock' && (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <span className="text-sm font-medium">Status</span>
                                                <Badge variant={device.data.locked ? 'destructive' : 'default'}>
                                                    {device.data.locked ? 'Locked' : 'Unlocked'}
                                                </Badge>
                                            </div>
                                            <Button
                                                size="sm"
                                                className="w-full"
                                                onClick={() => toggleDeviceLock(device.id)}
                                                disabled={device.status === 'Offline'}
                                            >
                                                {device.data.locked ? <Unlock className="w-4 h-4 mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                                                {device.data.locked ? 'Unlock' : 'Lock'}
                                            </Button>
                                        </div>
                                    )}

                                    {device.type === 'Thermostat' && (
                                        <div className="space-y-3">
                                            <div className="text-center py-4">
                                                <div className="text-4xl font-bold text-gray-900 dark:text-white">
                                                    {device.data.temp}°F
                                                </div>
                                                <div className="text-sm text-gray-500">Current Temperature</div>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <span className="text-sm">Target</span>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => adjustThermostat(device.id, -1)}
                                                        disabled={device.status === 'Offline'}
                                                    >
                                                        -
                                                    </Button>
                                                    <span className="font-bold w-12 text-center">{device.data.targetTemp}°F</span>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => adjustThermostat(device.id, 1)}
                                                        disabled={device.status === 'Offline'}
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {device.type === 'Sensor' && (
                                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div className="text-sm text-gray-500 mb-1">Current Reading</div>
                                            <div className="text-lg font-bold text-gray-900 dark:text-white">{device.data.level}</div>
                                        </div>
                                    )}

                                    {/* Device stats */}
                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-2 text-center">
                                        <div>
                                            <Battery className={`w-4 h-4 mx-auto mb-1 ${
                                                device.battery > 50 ? 'text-green-500' :
                                                device.battery > 20 ? 'text-yellow-500' :
                                                'text-red-500'
                                            }`} />
                                            <div className="text-xs text-gray-500">{device.battery}%</div>
                                        </div>
                                        <div>
                                            <Signal className={`w-4 h-4 mx-auto mb-1 ${
                                                device.signal === 'Strong' ? 'text-green-500' :
                                                device.signal === 'Medium' ? 'text-yellow-500' :
                                                'text-red-500'
                                            }`} />
                                            <div className="text-xs text-gray-500">{device.signal}</div>
                                        </div>
                                        <div>
                                            <RefreshCw className="w-4 h-4 mx-auto mb-1 text-gray-400" />
                                            <div className="text-xs text-gray-500">
                                                {Math.floor((Date.now() - device.lastSync.getTime()) / 60000)}m
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB: PARTNERS */}
            {activeTab === 'partners' && (
                <div className="space-y-6 animate-fade-in">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Vendor Partners
                            </CardTitle>
                            <CardDescription>Manage your service providers and partners</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {vendors.map(vendor => (
                                    <div key={vendor.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white dark:bg-gray-900 rounded-lg">
                                                <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white">{vendor.name}</h4>
                                                <p className="text-sm text-gray-500">{vendor.serviceCategory}</p>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />
                                                        {vendor.contactInfo}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <DollarSign className="w-3 h-3" />
                                                        {vendor.commissionRate}% commission
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleGenerateRecommendation(vendor.id)}
                                                disabled={generatingRec === vendor.id}
                                            >
                                                {generatingRec === vendor.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                ) : (
                                                    <Sparkles className="w-4 h-4 mr-2" />
                                                )}
                                                AI Recommend
                                            </Button>
                                            <Button size="sm" variant="ghost">
                                                <Phone className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Operations;

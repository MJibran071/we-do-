import React from 'react';
import { X, User, Calendar, CreditCard, Activity, Star, AlertTriangle, Phone, Mail, Wrench, MapPin, ExternalLink, MessageSquare, Briefcase, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Thread, Booking, MaintenanceIssue, AppMode, SmartRailContext, CustomerProfile } from '../types';
import { getTheme } from '../utils/theme';

interface SmartRailProps {
    isOpen: boolean;
    onClose: () => void;
    context: SmartRailContext;
    appMode: AppMode;
    customers?: CustomerProfile[]; // Optional pass-through if available globally
}

export const SmartRail: React.FC<SmartRailProps> = ({ isOpen, onClose, context, appMode, customers = [] }) => {
    const theme = getTheme(appMode);

    if (!isOpen || !context.data) return null;

    // Helper to find customer profile if available
    const findCustomer = (name?: string, email?: string) => {
        if (!name && !email) return undefined;
        return customers.find(c => 
            (c.email && c.email === email) || 
            c.name.toLowerCase() === name?.toLowerCase()
        );
    };

    const renderThreadContent = (thread: Thread) => {
        const participant = thread.participants[0];
        const customer = findCustomer(participant.name, participant.email);
        
        return (
            <div className="space-y-6">
                {/* Profile Header */}
                <div className="text-center">
                    <div className="relative inline-block">
                        <img 
                            src={customer?.avatar || participant.avatar} 
                            alt={participant.name} 
                            className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md" 
                        />
                        <div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center bg-white dark:bg-gray-900`}>
                            {thread.platform === 'Airbnb' ? <img src="https://cdn.simpleicons.org/airbnb/FF5A5F" className="w-3 h-3" /> : 
                             thread.platform === 'WhatsApp' ? <img src="https://cdn.simpleicons.org/whatsapp/25D366" className="w-3 h-3" /> :
                             <MessageSquare className="w-3 h-3 text-gray-500" />}
                        </div>
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-gray-900 dark:text-white">{participant.name}</h3>
                    <p className="text-sm text-gray-500">{customer?.email || participant.email || 'No email'}</p>
                    
                    <div className="flex justify-center gap-2 mt-3">
                        <Badge variant="secondary" className={`${theme.lightBg} ${theme.text} border-0`}>
                            {customer?.status || 'New'}
                        </Badge>
                        <Badge variant="outline" className="border-gray-200 dark:border-gray-700">
                            {thread.priority} Priority
                        </Badge>
                    </div>
                </div>

                {/* Sentiment Analysis */}
                <Card className="bg-gray-50 dark:bg-gray-900/50 border-0 shadow-inner">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase text-gray-500">Current Sentiment</span>
                            <div className={`flex items-center gap-1 text-xs font-bold ${
                                thread.sentiment === 'Positive' ? 'text-green-600' : 
                                thread.sentiment === 'Negative' ? 'text-red-600' : 'text-yellow-600'
                            }`}>
                                {thread.sentiment === 'Positive' ? <Star className="w-3 h-3 fill-current" /> : 
                                 thread.sentiment === 'Negative' ? <AlertTriangle className="w-3 h-3" /> : 
                                 <Activity className="w-3 h-3" />}
                                {thread.sentiment}
                            </div>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 italic">
                            "{thread.summary || 'No summary available.'}"
                        </p>
                    </CardContent>
                </Card>

                {/* Customer Stats */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-center">
                        <div className="text-xs text-gray-500 uppercase mb-1">Total Spend</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">${customer?.totalSpend || 0}</div>
                    </div>
                    <div className="p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-center">
                        <div className="text-xs text-gray-500 uppercase mb-1">Visits</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">{customer?.visitCount || 1}</div>
                    </div>
                </div>

                {/* Preferences / Tags */}
                <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" /> Preferences
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {(customer?.preferences || participant.tags || ['None']).map((tag, i) => (
                            <Badge key={i} variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-normal">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Quick Actions</h4>
                    <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start text-xs h-9">
                            <Calendar className="w-3.5 h-3.5 mr-2 text-gray-400" /> Create Booking
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-xs h-9">
                            <CreditCard className="w-3.5 h-3.5 mr-2 text-gray-400" /> Issue Refund
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-xs h-9">
                            <Mail className="w-3.5 h-3.5 mr-2 text-gray-400" /> Email Transcript
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    const renderBookingContent = (booking: Booking) => {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <div className={`w-16 h-16 mx-auto rounded-full ${theme.lightBg} dark:bg-opacity-20 flex items-center justify-center text-2xl font-bold ${theme.text}`}>
                        {booking.guestName.charAt(0)}
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-gray-900 dark:text-white">{booking.guestName}</h3>
                    <p className="text-sm text-gray-500">ID: #{booking.id.slice(-6).toUpperCase()}</p>
                    <Badge className={`mt-2 ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} border-0`}>
                        {booking.status}
                    </Badge>
                </div>

                {/* Key Details */}
                <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
                    <CardContent className="p-0">
                        <div className="flex divide-x divide-gray-100 dark:divide-gray-800">
                            <div className="flex-1 p-4 text-center">
                                <div className="text-xs text-gray-500 uppercase mb-1">Check-in</div>
                                <div className="font-bold text-sm">{new Date(booking.checkIn).toLocaleDateString()}</div>
                                <div className="text-xs text-gray-400">{new Date(booking.checkIn).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</div>
                            </div>
                            <div className="flex-1 p-4 text-center">
                                <div className="text-xs text-gray-500 uppercase mb-1">Check-out</div>
                                <div className="font-bold text-sm">{new Date(booking.checkOut).toLocaleDateString()}</div>
                                <div className="text-xs text-gray-400">{new Date(booking.checkOut).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Financials */}
                <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-400" /> Payment Status
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Total</span>
                            <span className="font-bold">${booking.totalPrice}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Status</span>
                            <span className={`font-bold ${booking.paymentStatus === 'Paid' ? 'text-green-600' : 'text-red-500'}`}>
                                {booking.paymentStatus}
                            </span>
                        </div>
                        {booking.financials?.fees > 0 && (
                            <div className="flex justify-between text-xs text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-800">
                                <span>Includes fees</span>
                                <span>${booking.financials.fees}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Operations */}
                <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-400" /> Operations
                    </h4>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-800 rounded-lg">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${booking.cleaningStatus === 'Clean' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className="text-sm font-medium">Cleaning</span>
                            </div>
                            <span className="text-xs text-gray-500">{booking.cleaningStatus || 'Unknown'}</span>
                        </div>
                    </div>
                </div>

                {/* Upsell */}
                <div className={`p-4 rounded-xl border ${theme.border} bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800`}>
                    <h4 className={`text-sm font-bold ${theme.text} mb-2 flex items-center gap-2`}>
                        <Activity className="w-4 h-4" /> Opportunity
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
                        Guest stays over the weekend. Offer late checkout?
                    </p>
                    <Button size="sm" className={`w-full h-8 text-xs ${theme.bg} text-white`}>
                        Send Offer ($45)
                    </Button>
                </div>
            </div>
        );
    };

    const renderTicketContent = (ticket: MaintenanceIssue) => {
        return (
            <div className="space-y-6">
                <div className="flex items-start justify-between">
                    <div>
                        <Badge className={`mb-2 ${ticket.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'} border-0`}>
                            {ticket.priority} Priority
                        </Badge>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{ticket.issue}</h3>
                    </div>
                    <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800`}>
                        <Wrench className="w-5 h-5 text-gray-500" />
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <MapPin className="w-4 h-4 text-gray-400" /> 
                        {ticket.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Calendar className="w-4 h-4 text-gray-400" /> 
                        Reported: {new Date(ticket.reportedAt).toLocaleDateString()}
                    </div>
                </div>

                <Card className="border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                    <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Activity className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">IoT Diagnostics</p>
                        <p className="text-xs text-gray-500 mt-1">
                            No sensors detected in {ticket.location}.
                        </p>
                    </CardContent>
                </Card>

                <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Assigned Vendor</h4>
                    {ticket.assignedTo ? (
                        <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-800 rounded-lg">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                {ticket.assignedTo.charAt(0)}
                            </div>
                            <div>
                                <div className="font-bold text-sm">{ticket.assignedTo}</div>
                                <div className="text-xs text-gray-500">External Contractor</div>
                            </div>
                            <Button size="icon" variant="ghost" className="ml-auto">
                                <Phone className="w-4 h-4 text-gray-400" />
                            </Button>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500 italic">No vendor assigned yet.</div>
                    )}
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                    <Button className={`w-full ${theme.bg} text-white`}>Mark Resolved</Button>
                </div>
            </div>
        );
    };

    return (
        <div 
            className={`fixed inset-y-0 right-0 w-full sm:w-80 md:w-96 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-l border-gray-200 dark:border-gray-800 shadow-2xl transform transition-transform duration-300 ease-out z-[60] flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
            <div className="p-3 sm:p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                    <Sparkles className={`w-3 h-3 ${theme.text}`} /> Smart Context
                </span>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
                {context.type === 'thread' && context.data && renderThreadContent(context.data as Thread)}
                {context.type === 'booking' && context.data && renderBookingContent(context.data as Booking)}
                {context.type === 'ticket' && context.data && renderTicketContent(context.data as MaintenanceIssue)}
            </div>
        </div>
    );
};
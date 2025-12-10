import React from 'react';
import { Integration, AppMode } from '../../types';
import { IntegrationWrapper } from './IntegrationWrapper';
import { Globe, Calendar, Users, TrendingUp, ExternalLink, CheckCircle, Star } from 'lucide-react';

interface BookingDotComConfigProps {
    integration: Integration;
    isOpen: boolean;
    onClose: () => void;
    onSave: (values: Record<string, string>) => void;
    onDisconnect?: () => void;
    appMode: AppMode;
}

export const BookingDotComConfig: React.FC<BookingDotComConfigProps> = (props) => {
    return (
        <IntegrationWrapper {...props}>
            <div className="space-y-4">
                {/* Integration Benefits */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        Booking.com Integration Benefits
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            <span><strong>Two-way Calendar Sync:</strong> Prevent double bookings automatically</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            <span><strong>Guest Messaging:</strong> Communicate with guests in one inbox</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            <span><strong>Reservation Details:</strong> Automatic booking information sync</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            <span><strong>Review Management:</strong> Respond to reviews from dashboard</span>
                        </li>
                    </ul>
                </div>

                {/* Stats Preview */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border border-gray-200 dark:border-zinc-800 text-center">
                        <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                        <div className="text-xs font-medium text-gray-900 dark:text-white">Bookings</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Auto-sync</div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border border-gray-200 dark:border-zinc-800 text-center">
                        <Users className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                        <div className="text-xs font-medium text-gray-900 dark:text-white">Guests</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Profiles</div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border border-gray-200 dark:border-zinc-800 text-center">
                        <Star className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                        <div className="text-xs font-medium text-gray-900 dark:text-white">Reviews</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Manage</div>
                    </div>
                </div>

                {/* Setup Instructions */}
                <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        How to connect Booking.com
                    </h4>
                    <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
                        <li>Log in to <a href="https://admin.booking.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1">Booking.com Extranet <ExternalLink className="w-3 h-3" /></a></li>
                        <li>Navigate to Property → Connectivity → Channel Manager</li>
                        <li>Find your Property ID in the URL or settings</li>
                        <li>Request XML API credentials from Booking.com support</li>
                        <li>Enter your credentials below</li>
                    </ol>
                </div>

                {/* Important Note */}
                <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg border border-amber-200 dark:border-amber-900/30">
                    <h5 className="font-semibold text-amber-900 dark:text-amber-100 text-sm mb-2">
                        ⚠️ Important
                    </h5>
                    <p className="text-xs text-amber-800 dark:text-amber-200">
                        XML API access requires approval from Booking.com. Contact their partner support team to request access. This may take 1-2 business days.
                    </p>
                </div>
            </div>
        </IntegrationWrapper>
    );
};

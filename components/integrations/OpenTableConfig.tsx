import React from 'react';
import { Integration, AppMode } from '../../types';
import { IntegrationWrapper } from './IntegrationWrapper';
import { Utensils, Clock, Users, DollarSign, ExternalLink, CheckCircle } from 'lucide-react';

interface OpenTableConfigProps {
    integration: Integration;
    isOpen: boolean;
    onClose: () => void;
    onSave: (values: Record<string, string>) => void;
    onDisconnect?: () => void;
    appMode: AppMode;
}

export const OpenTableConfig: React.FC<OpenTableConfigProps> = (props) => {
    return (
        <IntegrationWrapper {...props}>
            <div className="space-y-4">
                {/* Integration Benefits */}
                <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 p-5 rounded-xl border border-red-100 dark:border-red-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Utensils className="w-5 h-5 text-red-600 dark:text-red-400" />
                        OpenTable Restaurant Features
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-red-600 dark:text-red-400 flex-shrink-0" />
                            <span><strong>Reservation Sync:</strong> Real-time table booking updates</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-red-600 dark:text-red-400 flex-shrink-0" />
                            <span><strong>Guest Profiles:</strong> Dining preferences and history</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-red-600 dark:text-red-400 flex-shrink-0" />
                            <span><strong>Table Management:</strong> Optimize seating and turnover</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-red-600 dark:text-red-400 flex-shrink-0" />
                            <span><strong>Reviews:</strong> Monitor and respond to diner feedback</span>
                        </li>
                    </ul>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-gray-200 dark:border-zinc-800">
                        <Clock className="w-8 h-8 text-red-600 dark:text-red-400 mb-2" />
                        <div className="text-lg font-bold text-gray-900 dark:text-white">Real-time</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Instant updates</div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-gray-200 dark:border-zinc-800">
                        <Users className="w-8 h-8 text-red-600 dark:text-red-400 mb-2" />
                        <div className="text-lg font-bold text-gray-900 dark:text-white">VIP Tags</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Guest tracking</div>
                    </div>
                </div>

                {/* Setup Instructions */}
                <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Connect your OpenTable account
                    </h4>
                    <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
                        <li>Log in to <a href="https://restaurant.opentable.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1">OpenTable for Restaurants <ExternalLink className="w-3 h-3" /></a></li>
                        <li>Go to Settings → Integrations → API Access</li>
                        <li>Click "Generate Partner Token"</li>
                        <li>Copy your Restaurant ID from the dashboard</li>
                        <li>Paste both values below</li>
                    </ol>
                </div>

                {/* Partner Info */}
                <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg border border-purple-200 dark:border-purple-900/30">
                    <h5 className="font-semibold text-purple-900 dark:text-purple-100 text-sm mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Partner Benefits
                    </h5>
                    <p className="text-xs text-purple-800 dark:text-purple-200">
                        As an OpenTable partner, you'll get access to their network of millions of diners, advanced analytics, and marketing tools.
                    </p>
                </div>
            </div>
        </IntegrationWrapper>
    );
};

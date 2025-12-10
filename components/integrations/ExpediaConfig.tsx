import React from 'react';
import { Integration, AppMode } from '../../types';
import { IntegrationWrapper } from './IntegrationWrapper';
import { Globe, Calendar, MessageCircle, TrendingUp, Star, DollarSign } from 'lucide-react';

interface ExpediaConfigProps {
    integration: Integration;
    isOpen: boolean;
    onClose: () => void;
    onSave: (values: Record<string, string>) => void;
    onDisconnect?: () => void;
    appMode: AppMode;
}

export const ExpediaConfig: React.FC<ExpediaConfigProps> = (props) => {
    return (
        <IntegrationWrapper {...props}>
            <div className="space-y-4">
                {/* Integration Benefits */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        Expedia Integration Benefits
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Real-time availability sync</strong> - Prevent double bookings across all channels</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <MessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Reservation management</strong> - Centralized booking and guest communication</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Rate management</strong> - Update pricing across Expedia network instantly</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Star className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Review aggregation</strong> - Monitor and respond to guest reviews</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Revenue analytics</strong> - Track performance across Expedia brands</span>
                        </li>
                    </ul>
                </div>

                {/* Platform Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">200+</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Countries</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">3M+</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Properties</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">#1</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">OTA Globally</div>
                    </div>
                </div>

                {/* Setup Instructions */}
                <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Setup Instructions
                    </h4>
                    <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
                        <li>Log in to <a href="https://www.expediapartnercentral.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Expedia Partner Central</a></li>
                        <li>Navigate to <strong>Account → Connectivity</strong></li>
                        <li>Request API access (may require approval)</li>
                        <li>Once approved, copy your <strong>Hotel ID</strong> and <strong>API Key</strong></li>
                        <li>Configure your property details and room types</li>
                        <li>Paste credentials below to enable sync</li>
                    </ol>
                </div>

                {/* Expedia Brands */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                        🌐 Expedia Group Brands
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                            <span>Expedia.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                            <span>Hotels.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                            <span>Vrbo</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                            <span>Orbitz</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                            <span>Travelocity</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                            <span>Hotwire</span>
                        </div>
                    </div>
                </div>

                {/* Important Notes */}
                <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30">
                    <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 text-sm flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Important Notes
                    </h4>
                    <ul className="space-y-1 text-xs text-amber-800 dark:text-amber-300">
                        <li>• API access requires Expedia Partner Central account</li>
                        <li>• Commission rates vary by property type (typically 15-25%)</li>
                        <li>• Initial sync may take 24-48 hours for approval</li>
                        <li>• Availability updates sync in real-time after setup</li>
                    </ul>
                </div>

                {/* Documentation Link */}
                <div className="text-center">
                    <a
                        href="https://developers.expediagroup.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        View Expedia API Documentation →
                    </a>
                </div>
            </div>
        </IntegrationWrapper>
    );
};

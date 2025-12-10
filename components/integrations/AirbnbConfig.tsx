import React from 'react';
import { Integration, AppMode } from '../../types';
import { IntegrationWrapper } from './IntegrationWrapper';
import { Home, Calendar, MessageSquare, DollarSign, Shield, ExternalLink } from 'lucide-react';

interface AirbnbConfigProps {
    integration: Integration;
    isOpen: boolean;
    onClose: () => void;
    onSave: (values: Record<string, string>) => void;
    onDisconnect?: () => void;
    appMode: AppMode;
}

export const AirbnbConfig: React.FC<AirbnbConfigProps> = (props) => {
    return (
        <IntegrationWrapper {...props}>
            <div className="space-y-4">
                {/* Integration Benefits */}
                <div className="bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-900/10 dark:to-red-900/10 p-5 rounded-xl border border-pink-100 dark:border-pink-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Home className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                        What you'll get with Airbnb integration
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                            <MessageSquare className="w-4 h-4 mt-0.5 text-pink-600 dark:text-pink-400 flex-shrink-0" />
                            <span><strong>Unified Inbox:</strong> All Airbnb messages in one place</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Calendar className="w-4 h-4 mt-0.5 text-pink-600 dark:text-pink-400 flex-shrink-0" />
                            <span><strong>Calendar Sync:</strong> Automatic booking updates and availability</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <DollarSign className="w-4 h-4 mt-0.5 text-pink-600 dark:text-pink-400 flex-shrink-0" />
                            <span><strong>Revenue Tracking:</strong> Real-time earnings and payout data</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Shield className="w-4 h-4 mt-0.5 text-pink-600 dark:text-pink-400 flex-shrink-0" />
                            <span><strong>Guest Profiles:</strong> Automatic guest information sync</span>
                        </li>
                    </ul>
                </div>

                {/* Setup Instructions */}
                <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        How to get your API credentials
                    </h4>
                    <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
                        <li>Visit the <a href="https://www.airbnb.com/partner" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1">Airbnb Partner Portal <ExternalLink className="w-3 h-3" /></a></li>
                        <li>Navigate to "API Access" in your account settings</li>
                        <li>Click "Create New Application"</li>
                        <li>Copy your Client ID and Client Secret</li>
                        <li>Paste them in the fields below</li>
                    </ol>
                </div>

                {/* Security Note */}
                <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-zinc-900 p-3 rounded-lg border border-gray-200 dark:border-zinc-800">
                    <strong className="text-gray-700 dark:text-gray-300">🔒 Security:</strong> Your credentials are encrypted and stored securely. We never share your data with third parties.
                </div>
            </div>
        </IntegrationWrapper>
    );
};

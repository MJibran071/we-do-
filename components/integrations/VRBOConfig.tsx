import React from 'react';
import { Integration, AppMode } from '../../types';
import { IntegrationWrapper } from './IntegrationWrapper';
import { Home, Calendar, MessageCircle, TrendingUp, Shield, DollarSign } from 'lucide-react';

interface VRBOConfigProps {
    integration: Integration;
    isOpen: boolean;
    onClose: () => void;
    onSave: (values: Record<string, string>) => void;
    onDisconnect?: () => void;
    appMode: AppMode;
}

export const VRBOConfig: React.FC<VRBOConfigProps> = (props) => {
    return (
        <IntegrationWrapper {...props}>
            <div className="space-y-4">
                {/* Integration Benefits */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Home className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        VRBO Integration Benefits
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Two-way calendar sync</strong> - Prevent double bookings across all platforms</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <MessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Unified guest messaging</strong> - Manage all VRBO conversations in one inbox</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Revenue tracking</strong> - Monitor bookings and earnings in real-time</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Guest verification</strong> - Access VRBO's verified guest profiles</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Rate sync</strong> - Automatically update pricing across platforms</span>
                        </li>
                    </ul>
                </div>

                {/* Feature Preview */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">100M+</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Annual Travelers</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">2M+</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Properties Listed</div>
                    </div>
                </div>

                {/* Setup Instructions */}
                <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Setup Instructions
                    </h4>
                    <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
                        <li>Log in to your <a href="https://www.vrbo.com/partnercentral" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">VRBO Partner Central</a></li>
                        <li>Navigate to <strong>Settings → API Access</strong></li>
                        <li>Click <strong>"Generate API Credentials"</strong></li>
                        <li>Copy your <strong>Partner ID</strong> and <strong>API Key</strong></li>
                        <li>Select your properties to sync</li>
                        <li>Paste the credentials below and click <strong>Connect</strong></li>
                    </ol>
                </div>

                {/* Important Notes */}
                <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30">
                    <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 text-sm flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Important Notes
                    </h4>
                    <ul className="space-y-1 text-xs text-amber-800 dark:text-amber-300">
                        <li>• API access requires an active VRBO subscription</li>
                        <li>• Initial sync may take 15-30 minutes for large property portfolios</li>
                        <li>• Calendar updates sync every 5 minutes</li>
                        <li>• VRBO charges commission on bookings (typically 5-15%)</li>
                    </ul>
                </div>

                {/* Documentation Link */}
                <div className="text-center">
                    <a
                        href="https://developers.vrbo.com/documentation"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        View VRBO API Documentation →
                    </a>
                </div>
            </div>
        </IntegrationWrapper>
    );
};

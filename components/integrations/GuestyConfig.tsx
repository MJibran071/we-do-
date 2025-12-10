import React from 'react';
import { Integration, AppMode } from '../../types';
import { IntegrationWrapper } from './IntegrationWrapper';
import { Home, Calendar, Users, Zap, BarChart3, Settings } from 'lucide-react';

interface GuestyConfigProps {
    integration: Integration;
    isOpen: boolean;
    onClose: () => void;
    onSave: (values: Record<string, string>) => void;
    onDisconnect?: () => void;
    appMode: AppMode;
}

export const GuestyConfig: React.FC<GuestyConfigProps> = (props) => {
    return (
        <IntegrationWrapper {...props}>
            <div className="space-y-4">
                {/* Integration Benefits */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 p-5 rounded-xl border border-purple-100 dark:border-purple-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Home className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        Guesty PMS Integration Benefits
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                            <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Multi-calendar management</strong> - Manage all properties from one unified calendar</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Automation rules</strong> - Automated messaging, pricing, and task management</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Users className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Team collaboration</strong> - Assign tasks and manage team permissions</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Financial reporting</strong> - Comprehensive revenue and expense tracking</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Settings className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Channel management</strong> - Connect to 100+ OTAs and booking platforms</span>
                        </li>
                    </ul>
                </div>

                {/* Platform Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">100K+</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Properties</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">100+</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">OTA Channels</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">24/7</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Automation</div>
                    </div>
                </div>

                {/* Setup Instructions */}
                <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Setup Instructions
                    </h4>
                    <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
                        <li>Log in to your <a href="https://app.guesty.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Guesty account</a></li>
                        <li>Navigate to <strong>Settings → API Access</strong></li>
                        <li>Click <strong>"Generate API Token"</strong></li>
                        <li>Copy your <strong>API Token</strong> and <strong>Account ID</strong></li>
                        <li>Configure webhook URL for real-time updates</li>
                        <li>Paste credentials below to enable sync</li>
                    </ol>
                </div>

                {/* Key Features */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                        ⚡ Automation Capabilities
                    </h4>
                    <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                        <li>• <strong>Smart Inbox:</strong> Unified messaging across all channels</li>
                        <li>• <strong>Auto-Tasks:</strong> Cleaning and maintenance scheduling</li>
                        <li>• <strong>Price Sync:</strong> Automatic rate updates across OTAs</li>
                        <li>• <strong>Guest Portal:</strong> Self-service check-in and communication</li>
                        <li>• <strong>Owner Portal:</strong> Real-time reporting for property owners</li>
                    </ul>
                </div>

                {/* Important Notes */}
                <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30">
                    <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 text-sm flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Important Notes
                    </h4>
                    <ul className="space-y-1 text-xs text-amber-800 dark:text-amber-300">
                        <li>• Guesty subscription required (starts at $9/listing/month)</li>
                        <li>• API access included in all plans</li>
                        <li>• Webhook configuration recommended for real-time sync</li>
                        <li>• Supports multi-unit properties and property management companies</li>
                    </ul>
                </div>

                {/* Documentation Link */}
                <div className="text-center">
                    <a
                        href="https://developers.guesty.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                    >
                        View Guesty API Documentation →
                    </a>
                </div>
            </div>
        </IntegrationWrapper>
    );
};

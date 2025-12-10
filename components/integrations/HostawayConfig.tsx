import React from 'react';
import { Integration, AppMode } from '../../types';
import { IntegrationWrapper } from './IntegrationWrapper';
import { Home, Zap, Calendar, Users, BarChart3, Globe } from 'lucide-react';

interface HostawayConfigProps {
    integration: Integration;
    isOpen: boolean;
    onClose: () => void;
    onSave: (values: Record<string, string>) => void;
    onDisconnect?: () => void;
    appMode: AppMode;
}

export const HostawayConfig: React.FC<HostawayConfigProps> = (props) => {
    return (
        <IntegrationWrapper {...props}>
            <div className="space-y-4">
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/10 dark:to-blue-900/10 p-5 rounded-xl border border-cyan-100 dark:border-cyan-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Home className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                        Hostaway PMS Integration Benefits
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                            <Globe className="w-4 h-4 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Channel manager</strong> - Connect to 100+ booking platforms</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Zap className="w-4 h-4 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Automation engine</strong> - Automated messaging and task workflows</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Calendar className="w-4 h-4 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Direct booking website</strong> - Commission-free booking engine</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <BarChart3 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Financial reporting</strong> - Revenue management and analytics</span>
                        </li>
                    </ul>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">100+</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Channels</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">50K+</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Properties</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">24/7</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Support</div>
                    </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Setup Instructions</h4>
                    <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
                        <li>Log in to <a href="https://dashboard.hostaway.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Hostaway Dashboard</a></li>
                        <li>Navigate to <strong>Settings → API</strong></li>
                        <li>Generate <strong>API Key</strong> and <strong>Account ID</strong></li>
                        <li>Paste credentials below</li>
                    </ol>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30">
                    <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 text-sm">Important Notes</h4>
                    <ul className="space-y-1 text-xs text-amber-800 dark:text-amber-300">
                        <li>• Subscription starts at $33/month for unlimited listings</li>
                        <li>• Includes direct booking website builder</li>
                        <li>• Real-time sync with all major OTAs</li>
                    </ul>
                </div>
            </div>
        </IntegrationWrapper>
    );
};

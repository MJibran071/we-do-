import React from 'react';
import { Integration, AppMode } from '../../types';
import { IntegrationWrapper } from './IntegrationWrapper';
import { TrendingUp, DollarSign, BarChart3, Zap, Calendar, Target } from 'lucide-react';

interface PriceLabsConfigProps {
    integration: Integration;
    isOpen: boolean;
    onClose: () => void;
    onSave: (values: Record<string, string>) => void;
    onDisconnect?: () => void;
    appMode: AppMode;
}

export const PriceLabsConfig: React.FC<PriceLabsConfigProps> = (props) => {
    return (
        <IntegrationWrapper {...props}>
            <div className="space-y-4">
                {/* Integration Benefits */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 p-5 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        PriceLabs Dynamic Pricing Benefits
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                            <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span><strong>AI-powered pricing</strong> - Maximize revenue with machine learning algorithms</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Market analysis</strong> - Real-time competitor pricing and demand data</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Automated updates</strong> - Prices adjust automatically based on market conditions</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Seasonal optimization</strong> - Custom rules for holidays, events, and peak seasons</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Occupancy targets</strong> - Balance between occupancy rate and revenue goals</span>
                        </li>
                    </ul>
                </div>

                {/* Revenue Impact Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">+40%</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Avg Revenue Increase</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">24/7</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Auto Optimization</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">50K+</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Properties Using</div>
                    </div>
                </div>

                {/* Setup Instructions */}
                <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Setup Instructions
                    </h4>
                    <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
                        <li>Sign up or log in to <a href="https://app.pricelabs.co" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">PriceLabs</a></li>
                        <li>Navigate to <strong>Settings → Integrations</strong></li>
                        <li>Click <strong>"Generate API Key"</strong></li>
                        <li>Copy your <strong>API Key</strong> and <strong>Account ID</strong></li>
                        <li>Configure your pricing strategy and rules in PriceLabs</li>
                        <li>Paste the credentials below to enable automatic price sync</li>
                    </ol>
                </div>

                {/* Pricing Strategy Tips */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                        💡 Pricing Strategy Tips
                    </h4>
                    <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                        <li>• Set minimum and maximum price limits to protect your revenue</li>
                        <li>• Enable "Last Minute Pricing" to fill gaps in your calendar</li>
                        <li>• Use "Orphan Day Pricing" to reduce single-night gaps</li>
                        <li>• Configure custom rules for local events and holidays</li>
                        <li>• Monitor the "Pricing Dashboard" weekly to refine your strategy</li>
                    </ul>
                </div>

                {/* Important Notes */}
                <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30">
                    <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 text-sm flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Important Notes
                    </h4>
                    <ul className="space-y-1 text-xs text-amber-800 dark:text-amber-300">
                        <li>• Prices update automatically every 24 hours (or more frequently with premium plans)</li>
                        <li>• Initial calibration period of 7-14 days recommended for optimal results</li>
                        <li>• PriceLabs works with all major channel managers and PMSs</li>
                        <li>• You maintain full control with override capabilities</li>
                    </ul>
                </div>

                {/* Documentation Link */}
                <div className="text-center">
                    <a
                        href="https://pricelabs.co/resources/help-center"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                        View PriceLabs Documentation →
                    </a>
                </div>
            </div>
        </IntegrationWrapper>
    );
};

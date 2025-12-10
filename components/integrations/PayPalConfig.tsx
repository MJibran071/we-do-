import React from 'react';
import { Integration, AppMode } from '../../types';
import { IntegrationWrapper } from './IntegrationWrapper';
import { CreditCard, DollarSign, FileText, TrendingUp, Shield, Zap } from 'lucide-react';

interface PayPalConfigProps {
    integration: Integration;
    isOpen: boolean;
    onClose: () => void;
    onSave: (values: Record<string, string>) => void;
    onDisconnect?: () => void;
    appMode: AppMode;
}

export const PayPalConfig: React.FC<PayPalConfigProps> = (props) => {
    return (
        <IntegrationWrapper {...props}>
            <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-900/10 dark:to-sky-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        PayPal Payment Integration Benefits
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                            <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Global payments</strong> - Accept payments in 100+ currencies</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Invoicing</strong> - Send professional invoices to guests</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Subscription billing</strong> - Recurring payments for long-term stays</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Buyer protection</strong> - Trusted payment platform worldwide</span>
                        </li>
                    </ul>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">400M+</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Active Users</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">200+</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Countries</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">100+</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Currencies</div>
                    </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Setup Instructions</h4>
                    <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
                        <li>Log in to <a href="https://developer.paypal.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">PayPal Developer</a></li>
                        <li>Create an app in <strong>My Apps & Credentials</strong></li>
                        <li>Copy <strong>Client ID</strong> and <strong>Secret</strong></li>
                        <li>Choose mode: <strong>Sandbox</strong> (testing) or <strong>Live</strong> (production)</li>
                        <li>Paste credentials below</li>
                    </ol>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30">
                    <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 text-sm">Pricing</h4>
                    <ul className="space-y-1 text-xs text-amber-800 dark:text-amber-300">
                        <li>• Standard rate: 2.9% + $0.30 per transaction (US)</li>
                        <li>• International: +1.5% for currency conversion</li>
                        <li>• No monthly fees or setup costs</li>
                    </ul>
                </div>
            </div>
        </IntegrationWrapper>
    );
};

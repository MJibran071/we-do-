import React from 'react';
import { Integration, AppMode } from '../../types';
import { IntegrationWrapper } from './IntegrationWrapper';
import { CreditCard, Shield, DollarSign, Zap, ExternalLink, CheckCircle, Lock } from 'lucide-react';

interface StripeConfigProps {
    integration: Integration;
    isOpen: boolean;
    onClose: () => void;
    onSave: (values: Record<string, string>) => void;
    onDisconnect?: () => void;
    appMode: AppMode;
}

export const StripeConfig: React.FC<StripeConfigProps> = (props) => {
    const [testMode, setTestMode] = React.useState(true);

    return (
        <IntegrationWrapper {...props}>
            <div className="space-y-4">
                {/* Mode Toggle */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-xl border border-purple-100 dark:border-purple-900/30">
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <span className="font-semibold text-gray-900 dark:text-white">Environment</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 rounded-lg p-1 border border-gray-200 dark:border-zinc-800">
                        <button
                            onClick={() => setTestMode(true)}
                            className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${testMode
                                    ? 'bg-purple-600 text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            Test Mode
                        </button>
                        <button
                            onClick={() => setTestMode(false)}
                            className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${!testMode
                                    ? 'bg-purple-600 text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            Live Mode
                        </button>
                    </div>
                </div>

                {/* Integration Benefits */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 p-5 rounded-xl border border-purple-100 dark:border-purple-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        Stripe Payment Features
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                            <span><strong>Payment Processing:</strong> Accept cards, wallets, and bank transfers</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                            <span><strong>Invoicing:</strong> Send professional invoices automatically</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                            <span><strong>Subscriptions:</strong> Manage recurring billing</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                            <span><strong>Payouts:</strong> Track earnings and transfers</span>
                        </li>
                    </ul>
                </div>

                {/* Payment Methods */}
                <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800">
                    <h5 className="font-semibold text-gray-900 dark:text-white text-sm mb-3 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        Supported Payment Methods
                    </h5>
                    <div className="grid grid-cols-3 gap-2">
                        {['Visa', 'Mastercard', 'Amex', 'Apple Pay', 'Google Pay', 'ACH'].map((method) => (
                            <div key={method} className="text-center p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700">
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{method}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Setup Instructions */}
                <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        How to get your API keys
                    </h4>
                    <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
                        <li>Log in to your <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1">Stripe Dashboard <ExternalLink className="w-3 h-3" /></a></li>
                        <li>Click "Developers" in the top right corner</li>
                        <li>Go to "API keys" tab</li>
                        <li>Toggle between Test and Live mode using the switch</li>
                        <li>Copy your Publishable key and Secret key</li>
                        <li>Paste them in the fields below</li>
                    </ol>
                </div>

                {/* Security Warning */}
                {!testMode && (
                    <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg border border-red-200 dark:border-red-900/30">
                        <div className="flex items-start gap-3">
                            <Lock className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h5 className="font-semibold text-red-900 dark:text-red-100 text-sm mb-1">
                                    Live Mode Warning
                                </h5>
                                <p className="text-xs text-red-800 dark:text-red-200">
                                    You're using live API keys. Real transactions will be processed. Make sure you've tested everything in test mode first.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Test Mode Info */}
                {testMode && (
                    <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg border border-green-200 dark:border-green-900/30">
                        <div className="flex items-start gap-3">
                            <Zap className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h5 className="font-semibold text-green-900 dark:text-green-100 text-sm mb-1">
                                    Test Mode Active
                                </h5>
                                <p className="text-xs text-green-800 dark:text-green-200">
                                    Use test card <code className="bg-green-200 dark:bg-green-900 px-1 py-0.5 rounded">4242 4242 4242 4242</code> for testing. No real charges will be made.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </IntegrationWrapper>
    );
};

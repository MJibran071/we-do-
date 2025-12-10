import React from 'react';
import { Integration, AppMode } from '../../types';
import { IntegrationWrapper } from './IntegrationWrapper';
import { MessageCircle, Phone, Smartphone, Globe, Zap, Shield } from 'lucide-react';

interface TwilioConfigProps {
    integration: Integration;
    isOpen: boolean;
    onClose: () => void;
    onSave: (values: Record<string, string>) => void;
    onDisconnect?: () => void;
    appMode: AppMode;
}

export const TwilioConfig: React.FC<TwilioConfigProps> = (props) => {
    return (
        <IntegrationWrapper {...props}>
            <div className="space-y-4">
                {/* Integration Benefits */}
                <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10 p-5 rounded-xl border border-red-100 dark:border-red-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        Twilio Communication Benefits
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                            <Smartphone className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                            <span><strong>SMS automation</strong> - Send booking confirmations, check-in instructions, and reminders</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Phone className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Voice calls</strong> - Automated voice messages and call forwarding</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Globe className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Global reach</strong> - Send messages to 180+ countries</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Zap className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Two-way messaging</strong> - Receive and respond to guest messages</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Shield className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Phone masking</strong> - Protect your personal number with virtual numbers</span>
                        </li>
                    </ul>
                </div>

                {/* Platform Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">10M+</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Developers</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">180+</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Countries</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">99.95%</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Uptime SLA</div>
                    </div>
                </div>

                {/* Setup Instructions */}
                <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Setup Instructions
                    </h4>
                    <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
                        <li>Sign up or log in to <a href="https://www.twilio.com/console" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Twilio Console</a></li>
                        <li>Navigate to <strong>Account → API Keys & Tokens</strong></li>
                        <li>Copy your <strong>Account SID</strong> and <strong>Auth Token</strong></li>
                        <li>Go to <strong>Phone Numbers → Manage → Buy a Number</strong> to get a Twilio phone number</li>
                        <li>Copy your <strong>Twilio Phone Number</strong></li>
                        <li>Paste all credentials below to enable SMS and voice features</li>
                    </ol>
                </div>

                {/* Use Cases */}
                <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                        📱 Common Use Cases
                    </h4>
                    <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                        <li>• <strong>Pre-arrival:</strong> Send check-in instructions 24 hours before arrival</li>
                        <li>• <strong>Check-in:</strong> Automated door code delivery via SMS</li>
                        <li>• <strong>During stay:</strong> Send local recommendations and support contact</li>
                        <li>• <strong>Check-out:</strong> Reminder messages with checkout procedures</li>
                        <li>• <strong>Post-stay:</strong> Thank you messages and review requests</li>
                        <li>• <strong>Emergency:</strong> Urgent notifications to guests or staff</li>
                    </ul>
                </div>

                {/* Important Notes */}
                <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30">
                    <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 text-sm flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Important Notes
                    </h4>
                    <ul className="space-y-1 text-xs text-amber-800 dark:text-amber-300">
                        <li>• SMS pricing varies by country (typically $0.0075 - $0.05 per message)</li>
                        <li>• Phone numbers cost ~$1-2/month depending on country</li>
                        <li>• Comply with local regulations (e.g., TCPA in US, GDPR in EU)</li>
                        <li>• Test messages in sandbox mode before going live</li>
                        <li>• Keep your Auth Token secure - never expose it in client-side code</li>
                    </ul>
                </div>

                {/* Security Notice */}
                <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-200 dark:border-red-900/30">
                    <h4 className="font-semibold text-red-900 dark:text-red-200 mb-2 text-sm flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Security Best Practices
                    </h4>
                    <ul className="space-y-1 text-xs text-red-800 dark:text-red-300">
                        <li>• Store credentials securely using environment variables</li>
                        <li>• Use webhook signature validation for incoming messages</li>
                        <li>• Enable two-factor authentication on your Twilio account</li>
                        <li>• Regularly rotate your Auth Token</li>
                    </ul>
                </div>

                {/* Documentation Link */}
                <div className="text-center">
                    <a
                        href="https://www.twilio.com/docs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-red-600 dark:text-red-400 hover:underline"
                    >
                        View Twilio API Documentation →
                    </a>
                </div>
            </div>
        </IntegrationWrapper>
    );
};

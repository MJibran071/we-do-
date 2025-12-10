import React from 'react';
import { Integration, AppMode } from '../../types';
import { IntegrationWrapper } from './IntegrationWrapper';
import { Mail, Users, TrendingUp, Zap, BarChart3, Target } from 'lucide-react';

interface MailchimpConfigProps {
    integration: Integration;
    isOpen: boolean;
    onClose: () => void;
    onSave: (values: Record<string, string>) => void;
    onDisconnect?: () => void;
    appMode: AppMode;
}

export const MailchimpConfig: React.FC<MailchimpConfigProps> = (props) => {
    return (
        <IntegrationWrapper {...props}>
            <div className="space-y-4">
                {/* Integration Benefits */}
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 p-5 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        Mailchimp Email Marketing Benefits
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                            <Users className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Guest segmentation</strong> - Target guests based on booking history and preferences</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Automated campaigns</strong> - Welcome emails, post-stay follow-ups, and re-engagement</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <TrendingUp className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Repeat bookings</strong> - Drive return guests with targeted offers and updates</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <BarChart3 className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Analytics & insights</strong> - Track open rates, clicks, and conversion metrics</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Target className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                            <span><strong>A/B testing</strong> - Optimize subject lines and content for better engagement</span>
                        </li>
                    </ul>
                </div>

                {/* Platform Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">13M+</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Active Users</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">99.99%</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Delivery Rate</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">300+</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Integrations</div>
                    </div>
                </div>

                {/* Setup Instructions */}
                <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Setup Instructions
                    </h4>
                    <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
                        <li>Log in to your <a href="https://mailchimp.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Mailchimp account</a></li>
                        <li>Navigate to <strong>Account → Extras → API Keys</strong></li>
                        <li>Click <strong>"Create A Key"</strong> and give it a descriptive name</li>
                        <li>Copy your <strong>API Key</strong></li>
                        <li>Note your <strong>Audience ID</strong> from <strong>Audience → Settings → Audience name and defaults</strong></li>
                        <li>Paste credentials below to sync your guest list automatically</li>
                    </ol>
                </div>

                {/* Campaign Ideas */}
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                        💡 Campaign Ideas for Vacation Rentals
                    </h4>
                    <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                        <li>• <strong>Welcome Series:</strong> Introduce your property and share local tips</li>
                        <li>• <strong>Pre-Arrival:</strong> Send packing lists and area guides 1 week before check-in</li>
                        <li>• <strong>Post-Stay Thank You:</strong> Request reviews and offer return guest discounts</li>
                        <li>• <strong>Seasonal Promotions:</strong> Share special offers for off-peak seasons</li>
                        <li>• <strong>Newsletter:</strong> Monthly updates about property improvements and local events</li>
                        <li>• <strong>Re-engagement:</strong> Win back past guests who haven't booked in 12+ months</li>
                    </ul>
                </div>

                {/* Automation Workflows */}
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                        ⚡ Recommended Automations
                    </h4>
                    <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                        <li>• <strong>New Guest Welcome:</strong> Triggered when guest completes first booking</li>
                        <li>• <strong>Birthday Emails:</strong> Send special offers on guest birthdays</li>
                        <li>• <strong>Anniversary Reminder:</strong> Celebrate 1-year since their first stay</li>
                        <li>• <strong>Cart Abandonment:</strong> Follow up on incomplete booking inquiries</li>
                        <li>• <strong>Review Request:</strong> Automated 3 days after checkout</li>
                    </ul>
                </div>

                {/* Segmentation Tips */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                        🎯 Guest Segmentation Strategies
                    </h4>
                    <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                        <li>• <strong>VIP Guests:</strong> Guests with 3+ bookings get exclusive perks</li>
                        <li>• <strong>Business Travelers:</strong> Target with weekday availability and WiFi info</li>
                        <li>• <strong>Families:</strong> Highlight kid-friendly amenities and activities</li>
                        <li>• <strong>Couples:</strong> Promote romantic packages and local date ideas</li>
                        <li>• <strong>Long-Stay Guests:</strong> Offer monthly discounts and local resources</li>
                    </ul>
                </div>

                {/* Important Notes */}
                <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30">
                    <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 text-sm flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Important Notes
                    </h4>
                    <ul className="space-y-1 text-xs text-amber-800 dark:text-amber-300">
                        <li>• Free plan available for up to 500 contacts and 1,000 emails/month</li>
                        <li>• Ensure compliance with GDPR, CAN-SPAM, and other email regulations</li>
                        <li>• Always include an unsubscribe link in marketing emails</li>
                        <li>• Best practice: Send emails during business hours in recipient's timezone</li>
                        <li>• Avoid spam triggers: excessive caps, too many exclamation marks, spammy words</li>
                    </ul>
                </div>

                {/* Documentation Link */}
                <div className="text-center">
                    <a
                        href="https://mailchimp.com/developer/marketing/docs/fundamentals/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-yellow-600 dark:text-yellow-400 hover:underline"
                    >
                        View Mailchimp API Documentation →
                    </a>
                </div>
            </div>
        </IntegrationWrapper>
    );
};

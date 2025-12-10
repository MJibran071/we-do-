import React from 'react';
import { Integration, AppMode } from '../../types';
import { IntegrationWrapper } from './IntegrationWrapper';
import { MessageCircle, Users, Zap, Shield, ExternalLink, CheckCircle } from 'lucide-react';

interface WhatsAppConfigProps {
    integration: Integration;
    isOpen: boolean;
    onClose: () => void;
    onSave: (values: Record<string, string>) => void;
    onDisconnect?: () => void;
    appMode: AppMode;
}

export const WhatsAppConfig: React.FC<WhatsAppConfigProps> = (props) => {
    return (
        <IntegrationWrapper {...props}>
            <div className="space-y-4">
                {/* Integration Benefits */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 p-5 rounded-xl border border-green-100 dark:border-green-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        WhatsApp Business API Features
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                            <span><strong>Two-way Messaging:</strong> Send and receive WhatsApp messages</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                            <span><strong>Rich Media:</strong> Share images, videos, and documents</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                            <span><strong>Templates:</strong> Pre-approved message templates for notifications</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                            <span><strong>AI Auto-Reply:</strong> Intelligent automated responses</span>
                        </li>
                    </ul>
                </div>

                {/* Setup Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border-2 border-gray-200 dark:border-zinc-800 hover:border-green-500 dark:hover:border-green-500 transition-colors cursor-pointer">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
                            <h5 className="font-semibold text-gray-900 dark:text-white">WhatsApp Business API</h5>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            For businesses with high volume messaging needs
                        </p>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border-2 border-gray-200 dark:border-zinc-800 hover:border-green-500 dark:hover:border-green-500 transition-colors cursor-pointer">
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                            <h5 className="font-semibold text-gray-900 dark:text-white">WhatsApp Cloud API</h5>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            Free tier available, hosted by Meta
                        </p>
                    </div>
                </div>

                {/* Setup Instructions */}
                <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Setup Instructions
                    </h4>
                    <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
                        <li>Go to <a href="https://business.facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1">Meta Business Suite <ExternalLink className="w-3 h-3" /></a></li>
                        <li>Navigate to WhatsApp Manager and select your business account</li>
                        <li>Click on "API Setup" in the left sidebar</li>
                        <li>Copy your Phone Number ID and Access Token</li>
                        <li>Paste them below to connect</li>
                    </ol>
                </div>

                {/* Requirements */}
                <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg border border-amber-200 dark:border-amber-900/30">
                    <h5 className="font-semibold text-amber-900 dark:text-amber-100 text-sm mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Requirements
                    </h5>
                    <ul className="text-xs text-amber-800 dark:text-amber-200 space-y-1">
                        <li>• Verified Meta Business Account</li>
                        <li>• WhatsApp Business Profile</li>
                        <li>• Phone number not registered on WhatsApp</li>
                    </ul>
                </div>
            </div>
        </IntegrationWrapper>
    );
};

import React from 'react';
import { Integration, AppMode } from '../../types';
import { IntegrationWrapper } from './IntegrationWrapper';
import { Lock, Key, Clock, Shield, Smartphone, AlertCircle } from 'lucide-react';

interface RemoteLockConfigProps {
    integration: Integration;
    isOpen: boolean;
    onClose: () => void;
    onSave: (values: Record<string, string>) => void;
    onDisconnect?: () => void;
    appMode: AppMode;
}

export const RemoteLockConfig: React.FC<RemoteLockConfigProps> = (props) => {
    return (
        <IntegrationWrapper {...props}>
            <div className="space-y-4">
                {/* Integration Benefits */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 p-5 rounded-xl border border-purple-100 dark:border-purple-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        RemoteLock Smart Access Benefits
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                            <Key className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Automated access codes</strong> - Generate unique codes for each guest automatically</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Time-based access</strong> - Codes activate at check-in and expire at check-out</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Access logs</strong> - Track who enters and exits your properties</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Smartphone className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Remote control</strong> - Lock/unlock doors from anywhere via mobile app</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Real-time alerts</strong> - Get notified of door activity and low battery warnings</span>
                        </li>
                    </ul>
                </div>

                {/* Feature Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">100%</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Keyless Access</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">24/7</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Remote Control</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">500K+</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Locks Managed</div>
                    </div>
                </div>

                {/* Setup Instructions */}
                <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Setup Instructions
                    </h4>
                    <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
                        <li>Log in to your <a href="https://remotelock.com/login" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">RemoteLock account</a></li>
                        <li>Navigate to <strong>Settings → Integrations → API Access</strong></li>
                        <li>Click <strong>"Create API Key"</strong></li>
                        <li>Copy your <strong>API Key</strong> and <strong>Organization ID</strong></li>
                        <li>Install RemoteLock-compatible smart locks at your properties</li>
                        <li>Add locks to your RemoteLock account and assign to properties</li>
                        <li>Paste credentials below to enable automatic access code generation</li>
                    </ol>
                </div>

                {/* Compatible Devices */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                        🔐 Compatible Smart Locks
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full"></div>
                            <span>Yale Assure Lock</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full"></div>
                            <span>Schlage Encode</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full"></div>
                            <span>August Smart Lock</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full"></div>
                            <span>Kwikset Halo</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full"></div>
                            <span>Igloohome</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full"></div>
                            <span>Salto KS</span>
                        </div>
                    </div>
                </div>

                {/* Automation Features */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                        ⚡ Automated Workflows
                    </h4>
                    <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                        <li>• Access codes generated automatically when booking is confirmed</li>
                        <li>• Codes sent to guests via SMS/email before check-in</li>
                        <li>• Codes activate 1 hour before check-in time</li>
                        <li>• Codes expire 1 hour after check-out time</li>
                        <li>• Cleaning crew codes generated for turnover periods</li>
                        <li>• Master codes for property managers with permanent access</li>
                    </ul>
                </div>

                {/* Important Notes */}
                <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30">
                    <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Important Notes
                    </h4>
                    <ul className="space-y-1 text-xs text-amber-800 dark:text-amber-300">
                        <li>• Requires WiFi or Z-Wave hub for remote access features</li>
                        <li>• Smart locks require batteries (typically last 6-12 months)</li>
                        <li>• RemoteLock subscription starts at $5/lock/month</li>
                        <li>• Professional installation recommended for optimal performance</li>
                        <li>• Keep backup physical keys in a secure location</li>
                    </ul>
                </div>

                {/* Security Notice */}
                <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-200 dark:border-purple-900/30">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-2 text-sm flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Security Features
                    </h4>
                    <ul className="space-y-1 text-xs text-purple-800 dark:text-purple-300">
                        <li>• 256-bit AES encryption for all communications</li>
                        <li>• Tamper alerts if lock is physically compromised</li>
                        <li>• Auto-lock feature after door closes</li>
                        <li>• Access audit trail for compliance and security</li>
                    </ul>
                </div>

                {/* Documentation Link */}
                <div className="text-center">
                    <a
                        href="https://remotelock.com/support"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                    >
                        View RemoteLock Documentation →
                    </a>
                </div>
            </div>
        </IntegrationWrapper>
    );
};

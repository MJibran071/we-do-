import React from 'react';
import { Integration, AppMode } from '../../types';
import { IntegrationWrapper } from './IntegrationWrapper';
import { Video, Bell, MessageCircle, Clock } from 'lucide-react';

interface RingConfigProps {
  integration: Integration;
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: Record<string, string>) => void;
  onDisconnect?: () => void;
  appMode: AppMode;
}

export const RingConfig: React.FC<RingConfigProps> = (props) => {
  return (
    <IntegrationWrapper {...props}>
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/10 dark:to-cyan-800/10 p-5 rounded-xl border border-cyan-100 dark:border-cyan-900/30">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Video className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Ring Security Integration
          </h4>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <Video className="w-4 h-4 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
              <span><strong>Video doorbell</strong> - See and speak to guests</span>
            </li>
            <li className="flex items-start gap-2">
              <Bell className="w-4 h-4 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
              <span><strong>Motion alerts</strong> - Real-time notifications</span>
            </li>
            <li className="flex items-start gap-2">
              <MessageCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
              <span><strong>Two-way audio</strong> - Communicate remotely</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
              <span><strong>Video history</strong> - 60-day cloud recording</span>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">20M+</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Devices</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">99.9%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Uptime</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">1080p</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">HD Video</div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Setup Instructions</h4>
          <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
            <li>Install Ring device</li>
            <li>Download <strong>Ring app</strong></li>
            <li>Go to <strong>Account → Authorized Clients</strong></li>
            <li>Generate <strong>OAuth Token</strong></li>
            <li>Paste credential below</li>
          </ol>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30">
          <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 text-sm">Important Notes</h4>
          <ul className="space-y-1 text-xs text-amber-800 dark:text-amber-300">
            <li>• Subscription: $4/month per device</li>
            <li>• Works with Alexa</li>
            <li>• Professional monitoring available</li>
          </ul>
        </div>
      </div>
    </IntegrationWrapper>
  );
};

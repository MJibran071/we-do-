import React from 'react';
import { Integration, AppMode } from '../../types';
import { IntegrationWrapper } from './IntegrationWrapper';
import { Lock, Key, Clock, Bell } from 'lucide-react';

interface AugustLockConfigProps {
  integration: Integration;
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: Record<string, string>) => void;
  onDisconnect?: () => void;
  appMode: AppMode;
}

export const AugustLockConfig: React.FC<AugustLockConfigProps> = (props) => {
  return (
    <IntegrationWrapper {...props}>
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/10 dark:to-slate-800/10 p-5 rounded-xl border border-slate-100 dark:border-slate-900/30">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Lock className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            August Smart Lock Integration
          </h4>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-slate-600 dark:text-slate-400 mt-0.5 flex-shrink-0" />
              <span><strong>Smart lock control</strong> - Remote lock/unlock</span>
            </li>
            <li className="flex items-start gap-2">
              <Key className="w-4 h-4 text-slate-600 dark:text-slate-400 mt-0.5 flex-shrink-0" />
              <span><strong>Auto-unlock</strong> - Hands-free entry</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-slate-600 dark:text-slate-400 mt-0.5 flex-shrink-0" />
              <span><strong>Access schedules</strong> - Time-based permissions</span>
            </li>
            <li className="flex items-start gap-2">
              <Bell className="w-4 h-4 text-slate-600 dark:text-slate-400 mt-0.5 flex-shrink-0" />
              <span><strong>Activity feed</strong> - Real-time entry notifications</span>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">1M+</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Locks Sold</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">4.5/5</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Rating</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">24/7</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Access</div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Setup Instructions</h4>
          <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
            <li>Download <strong>August app</strong></li>
            <li>Add your locks</li>
            <li>Go to <strong>Settings → Integrations</strong></li>
            <li>Generate <strong>API Key</strong></li>
            <li>Paste credential below</li>
          </ol>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30">
          <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 text-sm">Important Notes</h4>
          <ul className="space-y-1 text-xs text-amber-800 dark:text-amber-300">
            <li>• Works with existing deadbolts</li>
            <li>• Battery powered (6-12 months)</li>
            <li>• Integrates with Alexa, Google Home</li>
          </ul>
        </div>
      </div>
    </IntegrationWrapper>
  );
};

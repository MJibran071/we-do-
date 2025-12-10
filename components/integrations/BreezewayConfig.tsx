import React from 'react';
import { Integration, AppMode } from '../../types';
import { IntegrationWrapper } from './IntegrationWrapper';
import { ClipboardCheck, Camera, Users, Star } from 'lucide-react';

interface BreezewayConfigProps {
  integration: Integration;
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: Record<string, string>) => void;
  onDisconnect?: () => void;
  appMode: AppMode;
}

export const BreezewayConfig: React.FC<BreezewayConfigProps> = (props) => {
  return (
    <IntegrationWrapper {...props}>
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/10 dark:to-teal-800/10 p-5 rounded-xl border border-teal-100 dark:border-teal-900/30">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            Breezeway Operations Management
          </h4>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <ClipboardCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
              <span><strong>Task management</strong> - Cleaning and maintenance checklists</span>
            </li>
            <li className="flex items-start gap-2">
              <Camera className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
              <span><strong>Photo documentation</strong> - Before/after inspection photos</span>
            </li>
            <li className="flex items-start gap-2">
              <Users className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
              <span><strong>Team coordination</strong> - Assign tasks to cleaners and vendors</span>
            </li>
            <li className="flex items-start gap-2">
              <Star className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
              <span><strong>Quality control</strong> - Ensure consistent property standards</span>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">10K+</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Properties</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">99%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Task Completion</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">50%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Time Saved</div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Setup Instructions</h4>
          <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
            <li>Sign up at <a href="https://www.breezeway.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Breezeway</a></li>
            <li>Navigate to <strong>Settings → Integrations</strong></li>
            <li>Generate <strong>API Key</strong></li>
            <li>Paste credential below</li>
          </ol>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30">
          <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 text-sm">Important Notes</h4>
          <ul className="space-y-1 text-xs text-amber-800 dark:text-amber-300">
            <li>• Starts at $10/property/month</li>
            <li>• Mobile app for field teams</li>
            <li>• Integrates with major PMSs</li>
          </ul>
        </div>
      </div>
    </IntegrationWrapper>
  );
};

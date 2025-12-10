import React from 'react';
import { Integration, AppMode } from '../../types';
import { IntegrationWrapper } from './IntegrationWrapper';
import { Calendar, Users, Star, DollarSign } from 'lucide-react';

interface TurnoverBnBConfigProps {
  integration: Integration;
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: Record<string, string>) => void;
  onDisconnect?: () => void;
  appMode: AppMode;
}

export const TurnoverBnBConfig: React.FC<TurnoverBnBConfigProps> = (props) => {
  return (
    <IntegrationWrapper {...props}>
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/10 dark:to-indigo-800/10 p-5 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            TurnoverBnB Cleaning Management
          </h4>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
              <span><strong>Automated scheduling</strong> - Auto-assign cleaners based on checkout</span>
            </li>
            <li className="flex items-start gap-2">
              <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
              <span><strong>Cleaner coordination</strong> - SMS notifications and updates</span>
            </li>
            <li className="flex items-start gap-2">
              <Star className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
              <span><strong>Quality assurance</strong> - Photo verification and checklists</span>
            </li>
            <li className="flex items-start gap-2">
              <DollarSign className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
              <span><strong>Payment tracking</strong> - Automatic cleaner payments</span>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">20K+</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Properties</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">100K+</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Cleanings/Month</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">4.9/5</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Rating</div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Setup Instructions</h4>
          <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
            <li>Sign up at <a href="https://www.turnoverbnb.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">TurnoverBnB</a></li>
            <li>Go to <strong>Settings → API</strong></li>
            <li>Copy <strong>API Key</strong></li>
            <li>Paste credential below</li>
          </ol>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30">
          <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 text-sm">Important Notes</h4>
          <ul className="space-y-1 text-xs text-amber-800 dark:text-amber-300">
            <li>• Free plan available</li>
            <li>• Pro: $20/month unlimited properties</li>
            <li>• Integrates with Airbnb, VRBO, etc.</li>
          </ul>
        </div>
      </div>
    </IntegrationWrapper>
  );
};

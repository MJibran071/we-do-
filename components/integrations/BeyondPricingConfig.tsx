import React from 'react';
import { Integration, AppMode } from '../../types';
import { IntegrationWrapper } from './IntegrationWrapper';
import { TrendingUp, BarChart3, Calendar, Zap } from 'lucide-react';

interface BeyondPricingConfigProps {
  integration: Integration;
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: Record<string, string>) => void;
  onDisconnect?: () => void;
  appMode: AppMode;
}

export const BeyondPricingConfig: React.FC<BeyondPricingConfigProps> = (props) => {
  return (
    <IntegrationWrapper {...props}>
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/10 dark:to-emerald-800/10 p-5 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Beyond Pricing Revenue Management
          </h4>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
              <span><strong>Dynamic pricing</strong> - AI-powered rate optimization</span>
            </li>
            <li className="flex items-start gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
              <span><strong>Market data</strong> - Competitor analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
              <span><strong>Seasonal adjustments</strong> - Holiday and event pricing</span>
            </li>
            <li className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
              <span><strong>Auto-sync</strong> - Real-time rate updates</span>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">25K+</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Properties</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">+30%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Avg Revenue Increase</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">24/7</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Optimization</div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Setup Instructions</h4>
          <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
            <li>Sign up at <a href="https://beyondpricing.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Beyond Pricing</a></li>
            <li>Connect your PMS or channel manager</li>
            <li>Copy <strong>API Key</strong> from settings</li>
            <li>Paste credential below</li>
          </ol>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30">
          <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 text-sm">Important Notes</h4>
          <ul className="space-y-1 text-xs text-amber-800 dark:text-amber-300">
            <li>• 1% of revenue or $20/month minimum</li>
            <li>• 30-day free trial</li>
            <li>• Works with all major PMSs</li>
          </ul>
        </div>
      </div>
    </IntegrationWrapper>
  );
};

import React from 'react';
import { Integration, AppMode } from '../../types';
import { IntegrationWrapper } from './IntegrationWrapper';
import { CreditCard, ShoppingBag, BarChart3, Smartphone } from 'lucide-react';

interface SquareConfigProps {
  integration: Integration;
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: Record<string, string>) => void;
  onDisconnect?: () => void;
  appMode: AppMode;
}

export const SquareConfig: React.FC<SquareConfigProps> = (props) => {
  return (
    <IntegrationWrapper {...props}>
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/10 dark:to-slate-900/10 p-5 rounded-xl border border-gray-100 dark:border-gray-900/30">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            Square Payment & POS Benefits
          </h4>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <CreditCard className="w-4 h-4 text-gray-700 dark:text-gray-300 mt-0.5 flex-shrink-0" />
              <span><strong>Payment processing</strong> - Accept cards, tap-to-pay, and digital wallets</span>
            </li>
            <li className="flex items-start gap-2">
              <ShoppingBag className="w-4 h-4 text-gray-700 dark:text-gray-300 mt-0.5 flex-shrink-0" />
              <span><strong>Inventory management</strong> - Track amenities and retail items</span>
            </li>
            <li className="flex items-start gap-2">
              <BarChart3 className="w-4 h-4 text-gray-700 dark:text-gray-300 mt-0.5 flex-shrink-0" />
              <span><strong>Analytics</strong> - Sales reports and customer insights</span>
            </li>
            <li className="flex items-start gap-2">
              <Smartphone className="w-4 h-4 text-gray-700 dark:text-gray-300 mt-0.5 flex-shrink-0" />
              <span><strong>Mobile POS</strong> - Accept payments anywhere with Square app</span>
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Setup Instructions</h4>
          <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
            <li>Sign up at <a href="https://squareup.com/signup" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Square</a></li>
            <li>Go to <strong>Developer Dashboard</strong></li>
            <li>Create application and copy <strong>Application ID</strong>, <strong>Access Token</strong>, and <strong>Location ID</strong></li>
            <li>Paste credentials below</li>
          </ol>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30">
          <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 text-sm">Pricing</h4>
          <ul className="space-y-1 text-xs text-amber-800 dark:text-amber-300">
            <li>• 2.6% + 10¢ per tap, dip, or swipe</li>
            <li>• 2.9% + 30¢ per online transaction</li>
            <li>• No monthly fees</li>
          </ul>
        </div>
      </div>
    </IntegrationWrapper>
  );
};

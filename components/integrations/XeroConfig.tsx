import React from 'react';
import { Integration, AppMode } from '../../types';
import { IntegrationWrapper } from './IntegrationWrapper';
import { DollarSign, FileText, Globe, BarChart3 } from 'lucide-react';

interface XeroConfigProps {
  integration: Integration;
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: Record<string, string>) => void;
  onDisconnect?: () => void;
  appMode: AppMode;
}

export const XeroConfig: React.FC<XeroConfigProps> = (props) => {
  return (
    <IntegrationWrapper {...props}>
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/10 dark:to-cyan-800/10 p-5 rounded-xl border border-cyan-100 dark:border-cyan-900/30">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            Xero Accounting Integration
          </h4>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <DollarSign className="w-4 h-4 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
              <span><strong>Bank reconciliation</strong> - Automatic transaction matching</span>
            </li>
            <li className="flex items-start gap-2">
              <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
              <span><strong>Invoicing</strong> - Professional invoices and quotes</span>
            </li>
            <li className="flex items-start gap-2">
              <Globe className="w-4 h-4 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
              <span><strong>Multi-currency</strong> - Handle international bookings</span>
            </li>
            <li className="flex items-start gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
              <span><strong>Real-time reporting</strong> - Financial dashboards</span>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">3.5M+</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Subscribers</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">180+</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Countries</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">1000+</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Apps</div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Setup Instructions</h4>
          <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
            <li>Log in to <a href="https://www.xero.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Xero</a></li>
            <li>Go to <strong>Settings → General Settings → API Access</strong></li>
            <li>Create OAuth 2.0 app</li>
            <li>Copy <strong>Consumer Key</strong>, <strong>Consumer Secret</strong>, and <strong>Tenant ID</strong></li>
            <li>Paste credentials below</li>
          </ol>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30">
          <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 text-sm">Important Notes</h4>
          <ul className="space-y-1 text-xs text-amber-800 dark:text-amber-300">
            <li>• Subscription starts at $13/month</li>
            <li>• Unlimited users included</li>
            <li>• Mobile app for on-the-go access</li>
          </ul>
        </div>
      </div>
    </IntegrationWrapper>
  );
};

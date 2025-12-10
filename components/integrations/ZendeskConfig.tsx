import React from 'react';
import { Integration, AppMode } from '../../types';
import { IntegrationWrapper } from './IntegrationWrapper';
import { Ticket, BookOpen, MessageCircle, BarChart3 } from 'lucide-react';

interface ZendeskConfigProps {
  integration: Integration;
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: Record<string, string>) => void;
  onDisconnect?: () => void;
  appMode: AppMode;
}

export const ZendeskConfig: React.FC<ZendeskConfigProps> = (props) => {
  return (
    <IntegrationWrapper {...props}>
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/10 dark:to-green-800/10 p-5 rounded-xl border border-green-100 dark:border-green-900/30">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Headphones className="w-5 h-5 text-green-600 dark:text-green-400" />
            Zendesk Customer Support
          </h4>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <Ticket className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <span><strong>Ticketing system</strong> - Organize guest requests</span>
            </li>
            <li className="flex items-start gap-2">
              <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <span><strong>Knowledge base</strong> - Self-service articles</span>
            </li>
            <li className="flex items-start gap-2">
              <MessageCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <span><strong>Multi-channel support</strong> - Email, chat, phone, social</span>
            </li>
            <li className="flex items-start gap-2">
              <BarChart3 className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <span><strong>Analytics</strong> - Support performance metrics</span>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">100K+</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Customers</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">160+</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Countries</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">4.5B+</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Tickets/Year</div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Setup Instructions</h4>
          <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
            <li>Log in to <a href="https://www.zendesk.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Zendesk</a></li>
            <li>Go to <strong>Admin → API</strong></li>
            <li>Enable API access and create token</li>
            <li>Copy <strong>Subdomain</strong>, <strong>Email</strong>, and <strong>API Token</strong></li>
            <li>Paste credentials below</li>
          </ol>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30">
          <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 text-sm">Important Notes</h4>
          <ul className="space-y-1 text-xs text-amber-800 dark:text-amber-300">
            <li>• Starts at $19/agent/month</li>
            <li>• Unlimited tickets on all plans</li>
            <li>• 1000+ integrations available</li>
          </ul>
        </div>
      </div>
    </IntegrationWrapper>
  );
};

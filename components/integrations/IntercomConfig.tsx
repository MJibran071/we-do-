import React from 'react';
import { Integration, AppMode } from '../../types';
import { IntegrationWrapper } from './IntegrationWrapper';
import { MessageSquare, Bot, BookOpen, Users } from 'lucide-react';

interface IntercomConfigProps {
  integration: Integration;
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: Record<string, string>) => void;
  onDisconnect?: () => void;
  appMode: AppMode;
}

export const IntercomConfig: React.FC<IntercomConfigProps> = (props) => {
  return (
    <IntegrationWrapper {...props}>
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-800/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Intercom Customer Messaging
          </h4>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <span><strong>Live chat</strong> - Real-time guest support</span>
            </li>
            <li className="flex items-start gap-2">
              <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <span><strong>Chatbots</strong> - Automated FAQ responses</span>
            </li>
            <li className="flex items-start gap-2">
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <span><strong>Help center</strong> - Self-service knowledge base</span>
            </li>
            <li className="flex items-start gap-2">
              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <span><strong>Customer engagement</strong> - Proactive messaging</span>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">25K+</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Businesses</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">500M+</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Users Reached</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">90%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Satisfaction</div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Setup Instructions</h4>
          <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
            <li>Log in to <a href="https://app.intercom.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Intercom</a></li>
            <li>Navigate to <strong>Settings → Installation</strong></li>
            <li>Copy <strong>App ID</strong> and <strong>API Key</strong></li>
            <li>Paste credentials below</li>
          </ol>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30">
          <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 text-sm">Important Notes</h4>
          <ul className="space-y-1 text-xs text-amber-800 dark:text-amber-300">
            <li>• Starts at $74/month</li>
            <li>• Includes live chat and chatbots</li>
            <li>• Mobile apps for iOS and Android</li>
          </ul>
        </div>
      </div>
    </IntegrationWrapper>
  );
};

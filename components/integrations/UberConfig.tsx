import React from 'react';
import { Integration, AppMode } from '../../types';
import { IntegrationWrapper } from './IntegrationWrapper';
import { Car, Settings, Zap, BarChart3 } from 'lucide-react';

interface UberConfigProps {
  integration: Integration;
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: Record<string, string>) => void;
  onDisconnect?: () => void;
  appMode: AppMode;
}

export const UberConfig: React.FC<UberConfigProps> = (props) => {
  return (
    <IntegrationWrapper {...props}>
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-black-50 to-black-100 dark:from-black-900/10 dark:to-black-800/10 p-5 rounded-xl border border-black-100 dark:border-black-900/30">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Car className="w-5 h-5 text-black-600 dark:text-black-400" />
            Uber Transportation Integration
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Connect Uber to enhance your property management capabilities with powerful features and automation.
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Setup Instructions</h4>
          <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
            <li>Sign up or log in to your Uber account</li>
            <li>Navigate to Settings or API section</li>
            <li>Generate API credentials</li>
            <li>Paste credentials below to connect</li>
          </ol>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30">
          <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 text-sm">Important Notes</h4>
          <ul className="space-y-1 text-xs text-amber-800 dark:text-amber-300">
            <li>• API access may require specific subscription plan</li>
            <li>• Check official documentation for detailed setup</li>
            <li>• Test connection after setup</li>
          </ul>
        </div>
      </div>
    </IntegrationWrapper>
  );
};

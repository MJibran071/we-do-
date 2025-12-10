import React from 'react';
import { Integration, AppMode } from '../../types';
import { IntegrationWrapper } from './IntegrationWrapper';
import { Workflow, Settings, Zap, BarChart3 } from 'lucide-react';

interface MakeConfigProps {
  integration: Integration;
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: Record<string, string>) => void;
  onDisconnect?: () => void;
  appMode: AppMode;
}

export const MakeConfig: React.FC<MakeConfigProps> = (props) => {
  return (
    <IntegrationWrapper {...props}>
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/10 dark:to-purple-800/10 p-5 rounded-xl border border-purple-100 dark:border-purple-900/30">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Workflow className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Make (Integromat) Automation
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Connect Make to enhance your property management capabilities with powerful features and automation.
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Setup Instructions</h4>
          <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
            <li>Sign up or log in to your Make account</li>
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

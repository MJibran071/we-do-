import React from 'react';
import { Integration, AppMode } from '../../types';
import { IntegrationWrapper } from './IntegrationWrapper';
import { CheckCircle, Shield, Users, BarChart3 } from 'lucide-react';

interface ProperlyConfigProps {
  integration: Integration;
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: Record<string, string>) => void;
  onDisconnect?: () => void;
  appMode: AppMode;
}

export const ProperlyConfig: React.FC<ProperlyConfigProps> = (props) => {
  return (
    <IntegrationWrapper {...props}>
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/10 dark:to-violet-800/10 p-5 rounded-xl border border-violet-100 dark:border-violet-900/30">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            Properly Property Operations
          </h4>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-violet-600 dark:text-violet-400 mt-0.5 flex-shrink-0" />
              <span><strong>Task automation</strong> - Smart task assignment</span>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-violet-600 dark:text-violet-400 mt-0.5 flex-shrink-0" />
              <span><strong>Quality assurance</strong> - Inspection workflows</span>
            </li>
            <li className="flex items-start gap-2">
              <Users className="w-4 h-4 text-violet-600 dark:text-violet-400 mt-0.5 flex-shrink-0" />
              <span><strong>Team management</strong> - Staff scheduling and tracking</span>
            </li>
            <li className="flex items-start gap-2">
              <BarChart3 className="w-4 h-4 text-violet-600 dark:text-violet-400 mt-0.5 flex-shrink-0" />
              <span><strong>Performance analytics</strong> - Team efficiency metrics</span>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">15K+</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Properties</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">95%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">On-time Rate</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">30%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Cost Reduction</div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Setup Instructions</h4>
          <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
            <li>Sign up at <a href="https://www.properly.ai" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Properly</a></li>
            <li>Navigate to <strong>Settings → Integrations</strong></li>
            <li>Generate <strong>API Token</strong></li>
            <li>Paste credential below</li>
          </ol>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30">
          <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 text-sm">Important Notes</h4>
          <ul className="space-y-1 text-xs text-amber-800 dark:text-amber-300">
            <li>• Custom pricing based on portfolio size</li>
            <li>• AI-powered task optimization</li>
            <li>• Mobile app for field teams</li>
          </ul>
        </div>
      </div>
    </IntegrationWrapper>
  );
};

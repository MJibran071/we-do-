import React from 'react';
import { Integration, AppMode } from '../../types';
import { IntegrationWrapper } from './IntegrationWrapper';
import { FileText, DollarSign, BarChart3, Users } from 'lucide-react';

interface QuickBooksConfigProps {
    integration: Integration;
    isOpen: boolean;
    onClose: () => void;
    onSave: (values: Record<string, string>) => void;
    onDisconnect?: () => void;
    appMode: AppMode;
}

export const QuickBooksConfig: React.FC<QuickBooksConfigProps> = (props) => {
    return (
        <IntegrationWrapper {...props}>
            <div className="space-y-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 p-5 rounded-xl border border-green-100 dark:border-green-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                        QuickBooks Accounting Integration
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                            <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Expense tracking</strong> - Automatic categorization of property expenses</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <FileText className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Invoice management</strong> - Generate and track guest invoices</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <BarChart3 className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Financial reports</strong> - P&L, balance sheets, and tax preparation</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <Users className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <span><strong>Multi-property accounting</strong> - Track finances across all properties</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Setup Instructions</h4>
                    <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
                        <li>Log in to <a href="https://quickbooks.intuit.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">QuickBooks</a></li>
                        <li>Go to <strong>Settings → Apps → Manage Apps</strong></li>
                        <li>Create OAuth 2.0 credentials</li>
                        <li>Copy <strong>Client ID</strong>, <strong>Client Secret</strong>, <strong>Realm ID</strong>, and <strong>Access Token</strong></li>
                        <li>Paste credentials below</li>
                    </ol>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30">
                    <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 text-sm">Important Notes</h4>
                    <ul className="space-y-1 text-xs text-amber-800 dark:text-amber-300">
                        <li>• QuickBooks Online subscription required (starts at $30/month)</li>
                        <li>• Automatic bank feed reconciliation</li>
                        <li>• Tax-ready reports for Schedule E (rental income)</li>
                    </ul>
                </div>
            </div>
        </IntegrationWrapper>
    );
};

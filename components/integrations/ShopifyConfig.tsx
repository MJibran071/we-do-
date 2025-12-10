import React from 'react';
import { Integration, AppMode } from '../../types';
import { IntegrationWrapper } from './IntegrationWrapper';
import { ShoppingBag, TrendingUp, Package, BarChart3, ExternalLink, CheckCircle } from 'lucide-react';

interface ShopifyConfigProps {
    integration: Integration;
    isOpen: boolean;
    onClose: () => void;
    onSave: (values: Record<string, string>) => void;
    onDisconnect?: () => void;
    appMode: AppMode;
}

export const ShopifyConfig: React.FC<ShopifyConfigProps> = (props) => {
    return (
        <IntegrationWrapper {...props}>
            <div className="space-y-4">
                {/* Integration Benefits */}
                <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/10 dark:to-teal-900/10 p-5 rounded-xl border border-green-100 dark:border-green-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-green-600 dark:text-green-400" />
                        Shopify Integration Benefits
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                            <span><strong>Order Sync:</strong> Real-time order and customer data</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                            <span><strong>Inventory Management:</strong> Track stock levels automatically</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                            <span><strong>Customer Support:</strong> Handle inquiries from your inbox</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                            <span><strong>Analytics:</strong> Sales reports and customer insights</span>
                        </li>
                    </ul>
                </div>

                {/* Data Sync Preview */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-gray-200 dark:border-zinc-800">
                        <Package className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">Products</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Auto-sync catalog</div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-gray-200 dark:border-zinc-800">
                        <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">Orders</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Real-time updates</div>
                    </div>
                </div>

                {/* Setup Instructions */}
                <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        How to connect your Shopify store
                    </h4>
                    <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
                        <li>Log in to your <a href="https://admin.shopify.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1">Shopify Admin <ExternalLink className="w-3 h-3" /></a></li>
                        <li>Go to Settings → Apps and sales channels → Develop apps</li>
                        <li>Click "Create an app" and name it (e.g., "We Do It For You")</li>
                        <li>Configure Admin API scopes: <code className="bg-gray-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-xs">read_orders, write_orders, read_products, read_customers</code></li>
                        <li>Install the app and copy the Admin API access token</li>
                        <li>Enter your store domain and API credentials below</li>
                    </ol>
                </div>

                {/* Permissions Info */}
                <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg border border-purple-200 dark:border-purple-900/30">
                    <h5 className="font-semibold text-purple-900 dark:text-purple-100 text-sm mb-2 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Required Permissions
                    </h5>
                    <div className="grid grid-cols-2 gap-2 text-xs text-purple-800 dark:text-purple-200">
                        <div>✓ Read Orders</div>
                        <div>✓ Read Products</div>
                        <div>✓ Read Customers</div>
                        <div>✓ Read Inventory</div>
                    </div>
                </div>
            </div>
        </IntegrationWrapper>
    );
};

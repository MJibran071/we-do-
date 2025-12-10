
import React, { useState } from 'react';
import { Integration, AppMode } from '../types';
import { Search, Settings, X, CheckCircle2, Zap, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { getTheme } from '../utils/theme';
import { getIntegrationConfig, IntegrationWrapper } from './integrations/index';

interface IntegrationsProps {
    integrations: Integration[];
    setIntegrations: React.Dispatch<React.SetStateAction<Integration[]>>;
    appMode: AppMode;
}

const Integrations: React.FC<IntegrationsProps> = ({ integrations, setIntegrations, appMode }) => {
    const theme = getTheme(appMode);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    // Configure Modal State
    const [configModalOpen, setConfigModalOpen] = useState(false);
    const [currentConfigIntegration, setCurrentConfigIntegration] = useState<Integration | null>(null);
    const [configFormValues, setConfigFormValues] = useState<Record<string, string>>({});


    const handleConfigure = (integration: Integration) => {
        setCurrentConfigIntegration(integration);
        // Initialize form values
        const initialValues: Record<string, string> = {};
        integration.configFields?.forEach(field => {
            initialValues[field.name] = '';
        });
        setConfigFormValues(initialValues);
        setConfigModalOpen(true);
    };

    const handleSaveConfig = (values: Record<string, string>) => {
        if (!currentConfigIntegration) return;

        // Simulate saving and connecting
        setIntegrations(prev => prev.map(int => {
            if (int.id === currentConfigIntegration.id) {
                return {
                    ...int,
                    status: 'Connected',
                    lastSync: new Date()
                };
            }
            return int;
        }));

        setConfigModalOpen(false);
        setCurrentConfigIntegration(null);
    };

    const handleDisconnect = (id: string) => {
        setIntegrations(prev => prev.map(int => {
            if (int.id === id) return { ...int, status: 'Disconnected' };
            return int;
        }));
        setConfigModalOpen(false);
    };

    const handleInputChange = (name: string, value: string) => {
        setConfigFormValues(prev => ({ ...prev, [name]: value }));
    };


    const categories = ['All', 'Channel Manager', 'Messaging', 'Smart Home', 'Pricing', 'Operations', 'Payment', 'Calendar', 'E-commerce', 'Social Media', 'Accounting'];

    const isIntegrationRelevant = (int: Integration) => {
        // Universal
        if (['Stripe', 'WhatsApp', 'Zapier', 'Slack'].includes(int.name)) return true;

        // Property Specific
        if (appMode === 'property') {
            return ['Airbnb', 'Booking.com', 'Vrbo', 'Turno', 'PriceLabs', 'Guesty', 'Lodgify'].includes(int.name);
        }

        // Restaurant Specific
        if (appMode === 'restaurant') {
            return ['OpenTable', 'Toast POS', 'Resy', 'UberEats', 'DoorDash'].includes(int.name);
        }

        // Ecommerce Specific
        if (appMode === 'ecommerce') {
            return ['Shopify', 'WooCommerce', 'DHL', 'FedEx', 'Klaviyo'].includes(int.name);
        }

        return true; // Show others by default if not explicitly excluded
    };

    const filteredIntegrations = integrations.filter(int => {
        const matchesSearch = int.name.toLowerCase().includes(searchQuery.toLowerCase()) || int.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || int.category === selectedCategory;
        const matchesMode = isIntegrationRelevant(int);
        return matchesSearch && matchesCategory && matchesMode;
    });

    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto bg-gray-50 dark:bg-black text-gray-900 dark:text-white font-sans">

            {/* HEADER */}
            <div className="flex flex-col gap-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Apps Marketplace</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            Connect tools for your <span className={`font-semibold capitalize ${theme.text} dark:${theme.text.replace('600', '400')}`}>{appMode}</span> business.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                            <Input
                                placeholder="Search apps..."
                                className="pl-10 bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 h-10 text-sm rounded-lg focus:ring-indigo-500 dark:focus:ring-indigo-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* CATEGORY TABS */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap border ${selectedCategory === cat
                                ? `${theme.bg} text-white ${theme.borderStrong} shadow-sm`
                                : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* GRID */}
            {filteredIntegrations.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No apps found</h3>
                    <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or category.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredIntegrations.map((integration) => (
                        <div
                            key={integration.id}
                            className={`bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 flex flex-col justify-between h-[240px] group hover:${theme.border} dark:hover:border-zinc-700 hover:shadow-lg transition-all duration-300`}
                        >
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-black border border-gray-100 dark:border-zinc-800 flex items-center justify-center overflow-hidden shadow-sm">
                                        {integration.logo ? (
                                            <img src={integration.logo} alt={integration.name} className="w-8 h-8 object-contain" />
                                        ) : (
                                            <Zap className="w-6 h-6 text-gray-400" />
                                        )}
                                    </div>
                                    {integration.status === 'Connected' && (
                                        <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full border border-green-100 dark:border-green-900/30">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                            <span className="text-[10px] font-medium text-green-700 dark:text-green-400">Active</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{integration.name}</h3>
                                    </div>
                                    <Badge variant="secondary" className={`${theme.lightBg} dark:bg-opacity-10 ${theme.text} dark:${theme.text.replace('600', '400')} border-0 px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold`}>
                                        {integration.category}
                                    </Badge>
                                </div>

                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                    {integration.description}
                                </p>
                            </div>

                            <Button
                                onClick={() => handleConfigure(integration)}
                                className={`w-full mt-4 ${integration.status === 'Connected'
                                    ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
                                    : `${theme.bg} ${theme.hover} text-white shadow-md`
                                    } border-0 h-10 rounded-lg font-medium transition-all`}
                            >
                                {integration.status === 'Connected' ? 'Configure' : 'Connect'}
                            </Button>
                        </div>
                    ))}
                </div>
            )}


            {/* CONFIGURATION MODAL */}
            {configModalOpen && currentConfigIntegration && (() => {
                // Get custom config component if available
                const CustomConfig = getIntegrationConfig(currentConfigIntegration.name);

                if (CustomConfig) {
                    // Use custom template wrapper
                    return (
                        <CustomConfig
                            integration={currentConfigIntegration}
                            isOpen={configModalOpen}
                            onClose={() => setConfigModalOpen(false)}
                            onSave={handleSaveConfig}
                            onDisconnect={() => handleDisconnect(currentConfigIntegration.id)}
                            appMode={appMode}
                        />
                    );
                }

                // Fall back to default IntegrationWrapper
                return (
                    <IntegrationWrapper
                        integration={currentConfigIntegration}
                        isOpen={configModalOpen}
                        onClose={() => setConfigModalOpen(false)}
                        onSave={handleSaveConfig}
                        onDisconnect={() => handleDisconnect(currentConfigIntegration.id)}
                        appMode={appMode}
                    />
                );
            })()}

        </div>
    );
};

export default Integrations;

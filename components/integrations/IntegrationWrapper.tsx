import React from 'react';
import { Integration, AppMode } from '../../types';
import { X, Globe, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { getTheme } from '../../utils/theme';

interface IntegrationWrapperProps {
    integration: Integration;
    isOpen: boolean;
    onClose: () => void;
    onSave: (values: Record<string, string>) => void;
    onDisconnect?: () => void;
    appMode: AppMode;
    children?: React.ReactNode;
}

export const IntegrationWrapper: React.FC<IntegrationWrapperProps> = ({
    integration,
    isOpen,
    onClose,
    onSave,
    onDisconnect,
    appMode,
    children
}) => {
    const theme = getTheme(appMode);
    const [formValues, setFormValues] = React.useState<Record<string, string>>({});
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    React.useEffect(() => {
        if (isOpen) {
            const initialValues: Record<string, string> = {};
            integration.configFields?.forEach(field => {
                initialValues[field.name] = '';
            });
            setFormValues(initialValues);
            setErrors({});
        }
    }, [isOpen, integration]);

    const handleInputChange = (name: string, value: string) => {
        setFormValues(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        integration.configFields?.forEach(field => {
            if (field.required !== false && !formValues[field.name]?.trim()) {
                newErrors[field.name] = `${field.label} is required`;
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validateForm()) {
            onSave(formValues);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl animate-scale-in overflow-hidden max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-black border border-gray-200 dark:border-zinc-800 flex items-center justify-center p-2.5 shadow-sm">
                            {integration.logo ? (
                                <img src={integration.logo} className="w-full h-full object-contain" alt={integration.name} />
                            ) : (
                                <Globe className={`w-6 h-6 ${theme.text}`} />
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Configure {integration.name}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {integration.description}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors bg-gray-100 dark:bg-zinc-800 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Status Banner */}
                    {integration.status === 'Connected' && (
                        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-xl flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                                    Connected Successfully
                                </p>
                                <p className="text-xs text-green-700 dark:text-green-300 mt-0.5">
                                    Last synced: {integration.lastSync?.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    )}

                    {integration.status === 'Error' && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-xl flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-red-900 dark:text-red-100">
                                    Connection Error
                                </p>
                                <p className="text-xs text-red-700 dark:text-red-300 mt-0.5">
                                    Please check your credentials and try again
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Custom Content (if provided) */}
                    {children ? (
                        <div className="mb-6">{children}</div>
                    ) : null}

                    {/* Configuration Fields */}
                    {integration.configFields && integration.configFields.length > 0 ? (
                        <div className="space-y-5">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
                                Configuration Settings
                            </h3>
                            {integration.configFields.map((field) => (
                                <div key={field.name}>
                                    <label className="text-sm font-medium text-gray-700 dark:text-zinc-400 mb-1.5 block">
                                        {field.label}
                                        {field.required !== false && <span className="text-red-500 ml-1">*</span>}
                                    </label>
                                    <Input
                                        type={field.type}
                                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                                        className={`bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white focus:ring-2 ${errors[field.name]
                                                ? 'border-red-500 focus:ring-red-500'
                                                : `focus:ring-${theme.text.split('-')[1]}-500 focus:border-${theme.text.split('-')[1]}-500`
                                            } h-11 placeholder:text-gray-400 dark:placeholder:text-zinc-600`}
                                        value={formValues[field.name] || ''}
                                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                                    />
                                    {errors[field.name] && (
                                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors[field.name]}
                                        </p>
                                    )}
                                    {field.description && !errors[field.name] && (
                                        <p className="text-xs text-gray-500 dark:text-zinc-500 mt-1">{field.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-500 dark:text-zinc-500 text-sm text-center py-8 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-dashed border-gray-200 dark:border-zinc-800">
                            <Globe className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-zinc-700" />
                            <p className="font-medium">No additional configuration required</p>
                            <p className="text-xs mt-1">This integration is ready to use</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={handleSave}
                            className={`w-full ${theme.bg} ${theme.hover} text-white h-11 font-medium text-base rounded-lg shadow-md transition-all hover:shadow-lg`}
                        >
                            {integration.status === 'Connected' ? 'Update Configuration' : 'Connect Integration'}
                        </Button>

                        {integration.status === 'Connected' && onDisconnect && (
                            <button
                                onClick={onDisconnect}
                                className="w-full text-sm text-red-500 hover:text-red-600 dark:hover:text-red-400 font-medium py-2 transition-colors"
                            >
                                Disconnect Integration
                            </button>
                        )}

                        <a
                            href={`https://docs.example.com/integrations/${integration.name.toLowerCase().replace(/\s+/g, '-')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center justify-center gap-1 transition-colors"
                        >
                            <ExternalLink className="w-3 h-3" />
                            View integration documentation
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

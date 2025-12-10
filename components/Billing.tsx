
import React, { useState } from 'react';
import { PlanTier, Subscription, AppMode } from '../types';
import { Check, Shield, Zap, Star, CreditCard, Loader2, AlertCircle, Plus, Wallet, DollarSign, ExternalLink, Download, FileText, TrendingUp, Calendar, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { getTheme } from '../utils/theme';
import { api } from '../utils/api';
import { toast } from 'sonner';
import { logger } from '../utils/logger';
import { StripePaymentManager } from './StripePaymentManager';

interface BillingProps {
    subscription: Subscription;
    onUpdatePlan: (plan: PlanTier, interval: 'monthly' | 'yearly') => void;
    appMode: AppMode;
}

interface Invoice {
    id: string;
    date: Date;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
    description: string;
    downloadUrl?: string;
}

interface UsageMetric {
    label: string;
    current: number;
    limit: number;
    unit: string;
}

const Billing: React.FC<BillingProps> = ({ subscription, onUpdatePlan, appMode }) => {
    const theme = getTheme(appMode);
    const [isYearly, setIsYearly] = useState(subscription.interval === 'yearly');
    const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
    const [isLoadingPortal, setIsLoadingPortal] = useState(false);

    // Wallet / Add Funds State
    const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
    const [fundAmount, setFundAmount] = useState('50');
    const [processingProvider, setProcessingProvider] = useState<string | null>(null);

    // Invoice & Usage State
    const [showInvoices, setShowInvoices] = useState(false);
    const [showUsage, setShowUsage] = useState(false);

    const plans = [
        {
            id: 'Starter',
            name: 'Starter',
            price: 0,
            description: 'Perfect for new hosts testing the waters.',
            features: [
                'Unified Inbox (All Channels)',
                'Basic Auto-Replies (Gemini Flash Lite)',
                'Standard Calendar',
                '1 Property Limit',
                '50 Messages / mo'
            ],
            limitations: [
                'No Revenue Intelligence',
                'No Voice or Vision AI',
                'No Historical Analytics'
            ],
            icon: Shield,
            color: 'gray'
        },
        {
            id: 'Growth',
            name: 'Growth',
            price: isYearly ? 200 : 250,
            originalPrice: isYearly ? 250 : 300,
            discountLabel: '$50 OFF',
            description: 'Automate everything and maximize revenue.',
            popular: true,
            features: [
                'Everything in Starter',
                'Revenue Intelligence Agents',
                'Voice Command & Transcription',
                'Vision AI (Maintenance Photos)',
                'Smart Upsell Engine',
                'Up to 10 Properties',
                '500 Messages / mo'
            ],
            icon: Zap,
            color: theme.name
        },
        {
            id: 'Agency',
            name: 'Agency',
            price: isYearly ? 480 : 600,
            originalPrice: isYearly ? 580 : 700,
            discountLabel: 'Early User Deal',
            description: 'For property managers with teams.',
            features: [
                'Everything in Growth',
                'Unlimited Properties',
                'Team Seats & Roles',
                'API Access & Webhooks',
                'Whitelabeling',
                'Dedicated Account Manager',
                'Priority Support'
            ],
            icon: Star,
            color: 'purple'
        }
    ];

    const paymentMethods = [
        { id: 'visa', name: 'Visa', icon: 'https://cdn.simpleicons.org/visa/1434CB', isDefault: true, last4: '4242', expiry: '12/25' },
        { id: 'mastercard', name: 'Mastercard', icon: 'https://cdn.simpleicons.org/mastercard/EB001B', isDefault: false, last4: '5555', expiry: '08/26' },
    ];

    // Mock invoices data
    const invoices: Invoice[] = [
        { id: 'INV-2024-001', date: new Date('2024-11-01'), amount: 250, status: 'paid', description: 'Growth Plan - November 2024' },
        { id: 'INV-2024-002', date: new Date('2024-10-01'), amount: 250, status: 'paid', description: 'Growth Plan - October 2024' },
        { id: 'INV-2024-003', date: new Date('2024-09-01'), amount: 250, status: 'paid', description: 'Growth Plan - September 2024' },
    ];

    // Mock usage metrics
    const usageMetrics: UsageMetric[] = [
        { label: 'Messages Sent', current: 342, limit: 500, unit: 'messages' },
        { label: 'Properties', current: 3, limit: 10, unit: 'properties' },
        { label: 'AI Voice Minutes', current: 45, limit: 100, unit: 'minutes' },
        { label: 'Vision AI Scans', current: 28, limit: 50, unit: 'scans' },
    ];

    // --- STRIPE SUBSCRIPTION HANDLERS ---

    const handlePlanSelect = async (planId: string) => {
        setLoadingPlanId(planId);
        try {
            const data = await api.post<{ url: string }>('/api/billing/checkout', {
                planId,
                interval: isYearly ? 'yearly' : 'monthly'
            });

            if (data.url) {
                window.location.href = data.url;
            } else {
                // Fallback for demo environment where backend might be mocking without Stripe URL
                toast.success("Plan Updated (Demo)", { description: "Simulating upgrade..." });
                setTimeout(() => {
                    onUpdatePlan(planId as PlanTier, isYearly ? 'yearly' : 'monthly');
                    setLoadingPlanId(null);
                }, 1000);
            }
        } catch (error) {
            logger.error("Billing Error", error);
            setLoadingPlanId(null);
        }
    };

    const handleManagePayment = async () => {
        setIsLoadingPortal(true);
        try {
            const data = await api.post<{ url: string }>('/api/billing/portal', {});
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            logger.error("Portal Error", error);
            setIsLoadingPortal(false);
        }
    };

    // --- WALLET / ADD FUNDS HANDLERS ---

    const handlePayPalPayment = async () => {
        setProcessingProvider('paypal');
        try {
            const order = await api.post<{ id: string, links: any[] }>('/api/billing/paypal/order', {
                amount: fundAmount,
                currency: 'USD'
            });

            // In a real app, redirect to order.links[1].href (approve link)
            // Here we simulate the capture immediately for the demo experience
            toast.info("PayPal Order Created", { description: `Order ID: ${order.id}. Redirecting to PayPal...` });

            // Simulate user completing payment
            setTimeout(async () => {
                await api.post('/api/billing/paypal/capture', { orderId: order.id });
                toast.success("Payment Successful", { description: `$${fundAmount} added to wallet via PayPal.` });
                setIsAddFundsOpen(false);
                setProcessingProvider(null);
            }, 2000);

        } catch (error) {
            setProcessingProvider(null);
        }
    };

    const handleGooglePayPayment = async () => {
        setProcessingProvider('google_pay');
        try {
            // 1. Get Config
            await api.get('/api/billing/google-pay/config');

            // 2. Simulate User Interaction & Token Generation
            // In real app, Google Pay button widget handles this
            const mockToken = "tok_google_pay_mock_" + Date.now();

            // 3. Process with Backend
            await api.post('/api/billing/google-pay/process', {
                token: mockToken,
                amount: Number(fundAmount),
                currency: 'USD'
            });

            toast.success("Payment Successful", { description: `$${fundAmount} added via Google Pay.` });
            setIsAddFundsOpen(false);
        } catch (error) {
            // Error already handled by api util toast
        } finally {
            setProcessingProvider(null);
        }
    };

    const handleStripeIntent = async () => {
        setProcessingProvider('card');
        try {
            // This endpoint creates a PaymentIntent for custom elements (Apple Pay/Card)
            const intent = await api.post<{ clientSecret: string }>('/api/billing/payment-intent', {
                amount: Number(fundAmount),
                currency: 'USD'
            });

            logger.debug("Payment Intent Created", { hasClientSecret: !!intent.clientSecret });
            toast.success("Secure Connection Established", { description: "Ready to process card/Apple Pay." });

            // Simulate completion
            setTimeout(() => {
                setIsAddFundsOpen(false);
                setProcessingProvider(null);
                toast.success(`$${fundAmount} added to wallet.`);
            }, 1500);

        } catch (error) {
            setProcessingProvider(null);
        }
    };

    const handleDownloadInvoice = async (invoiceId: string) => {
        toast.info('Downloading invoice...', { description: `Preparing ${invoiceId}` });
        // In production, this would call the backend to generate/fetch PDF
        setTimeout(() => {
            toast.success('Invoice downloaded', { description: 'Check your downloads folder' });
        }, 1000);
    };

    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto space-y-8 relative">

            {/* INVOICES MODAL */}
            {showInvoices && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4" onClick={() => setShowInvoices(false)}>
                    <Card className="w-full max-w-2xl animate-scale-in max-h-[80vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                        <CardHeader className="flex flex-row items-center justify-between border-b dark:border-gray-800">
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Billing History
                            </CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setShowInvoices(false)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="p-6 overflow-y-auto">
                            <div className="space-y-3">
                                {invoices.map((invoice) => (
                                    <div key={invoice.id} className="flex items-center justify-between p-4 border dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="font-medium text-gray-900 dark:text-white">{invoice.id}</span>
                                                <Badge variant={invoice.status === 'paid' ? 'default' : invoice.status === 'pending' ? 'secondary' : 'destructive'} className="text-xs">
                                                    {invoice.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{invoice.description}</p>
                                            <p className="text-xs text-gray-400 mt-1">{invoice.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-lg font-bold text-gray-900 dark:text-white">${invoice.amount}</span>
                                            <Button variant="outline" size="sm" onClick={() => handleDownloadInvoice(invoice.id)}>
                                                <Download className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* USAGE MODAL */}
            {showUsage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4" onClick={() => setShowUsage(false)}>
                    <Card className="w-full max-w-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
                        <CardHeader className="flex flex-row items-center justify-between border-b dark:border-gray-800">
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5" />
                                Current Usage
                            </CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setShowUsage(false)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                {usageMetrics.map((metric, idx) => {
                                    const percentage = (metric.current / metric.limit) * 100;
                                    const isNearLimit = percentage > 80;

                                    return (
                                        <div key={idx}>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{metric.label}</span>
                                                <span className={`text-sm font-bold ${isNearLimit ? 'text-orange-600' : 'text-gray-900 dark:text-white'}`}>
                                                    {metric.current} / {metric.limit} {metric.unit}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${isNearLimit ? 'bg-orange-500' : theme.bg}`}
                                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                                />
                                            </div>
                                            {isNearLimit && (
                                                <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" />
                                                    Approaching limit - consider upgrading
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                <p className="text-sm text-blue-900 dark:text-blue-200">
                                    <strong>Billing Cycle:</strong> Resets on the 1st of each month. Overages are charged from your prepaid credits.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ADD FUNDS MODAL */}
            {isAddFundsOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4" onClick={() => setIsAddFundsOpen(false)}>
                    <Card className="w-full max-w-md animate-scale-in" onClick={e => e.stopPropagation()}>
                        <CardHeader>
                            <CardTitle>Add Credits</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Amount</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                                    <Input
                                        type="number"
                                        value={fundAmount}
                                        onChange={e => setFundAmount(e.target.value)}
                                        className="pl-7 text-lg font-bold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Button
                                    onClick={handlePayPalPayment}
                                    disabled={!!processingProvider}
                                    className="w-full bg-[#0070BA] hover:bg-[#003087] text-white h-12"
                                >
                                    {processingProvider === 'paypal' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Pay with PayPal'}
                                </Button>

                                <Button
                                    onClick={handleGooglePayPayment}
                                    disabled={!!processingProvider}
                                    className="w-full bg-black hover:bg-gray-800 text-white h-12 border border-gray-700"
                                >
                                    {processingProvider === 'google_pay' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Pay with Google Pay'}
                                </Button>

                                <Button
                                    onClick={handleStripeIntent}
                                    disabled={!!processingProvider}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12"
                                >
                                    {processingProvider === 'card' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Card / Apple Pay'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Billing & Plans</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your subscription, payment methods, and usage credits.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowUsage(true)} className="gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Usage
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowInvoices(true)} className="gap-2">
                        <FileText className="w-4 h-4" />
                        Invoices
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">

                    {/* WALLET CARD */}
                    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-200 dark:border-indigo-800">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-300">Prepaid Usage Credits</CardTitle>
                            <Wallet className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end justify-between">
                                <div>
                                    <div className="text-3xl font-bold text-gray-900 dark:text-white">$12.50</div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Used for overage messages & premium AI tasks.</p>
                                    <div className="flex items-center gap-2 mt-3">
                                        <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                            <TrendingUp className="w-3 h-3" />
                                            <span>+$5.00 this month</span>
                                        </div>
                                    </div>
                                </div>
                                <Button size="sm" onClick={() => setIsAddFundsOpen(true)} className={`${theme.bg} ${theme.hover} text-white shadow-md`}>
                                    <Plus className="w-4 h-4 mr-2" /> Add Funds
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Current Plan Summary */}
                    <Card className={`bg-gradient-to-r ${theme.gradient} text-white border-0 shadow-xl overflow-hidden relative`}>
                        <div className={`absolute top-0 right-0 w-64 h-64 bg-white rounded-full filter blur-3xl opacity-10 -translate-y-1/2 translate-x-1/3`}></div>
                        <CardContent className="p-6 md:p-8 relative z-10">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                        <Badge className="bg-white/20 text-white border-0 hover:bg-white/30 backdrop-blur-sm">
                                            {subscription.status === 'active' ? 'Active Subscription' : 'Trial'}
                                        </Badge>
                                        <div className="flex items-center gap-1.5 text-white/80 text-sm">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>Next billing: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <h2 className="text-3xl font-bold mb-1">{subscription.tier} Plan</h2>
                                    <p className="text-indigo-100 text-sm max-w-md">
                                        {subscription.tier === 'Starter'
                                            ? 'You are on the free tier. Upgrade to unlock revenue features.'
                                            : 'You have access to all advanced AI features.'}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <div className="text-3xl font-bold">${subscription.tier === 'Starter' ? '0' : isYearly ? '200' : '250'}</div>
                                    <div className="text-sm text-white/70">per month</div>
                                </div>
                            </div>

                            {/* Quick Usage Stats */}
                            {subscription.tier !== 'Starter' && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/20">
                                    {usageMetrics.map((metric, idx) => {
                                        const percentage = (metric.current / metric.limit) * 100;
                                        return (
                                            <div key={idx} className="text-center">
                                                <div className="text-2xl font-bold mb-1">{metric.current}</div>
                                                <div className="text-xs text-white/70">of {metric.limit} {metric.unit}</div>
                                                <div className="w-full bg-white/20 rounded-full h-1 mt-2">
                                                    <div className="bg-white rounded-full h-1" style={{ width: `${percentage}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Payment Method Grid */}
                    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-gray-500" /> Payment Methods
                                </CardTitle>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Shield className="w-3 h-3 text-green-500" />
                                    <span>Secure</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* <StripePaymentManager theme={theme} /> */}
                            <div className="p-4 text-center text-gray-500">Payment Manager Temporarily Disabled (Requires Valid Stripe Key)</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Plans Selection */}
                <div className="space-y-6">
                    <div className="flex justify-center items-center gap-3 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit mx-auto lg:w-full">
                        <button
                            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${!isYearly ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}
                            onClick={() => setIsYearly(false)}
                        >
                            Monthly
                        </button>
                        <button
                            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${isYearly ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}
                            onClick={() => setIsYearly(true)}
                        >
                            Yearly <span className="text-[10px] text-green-600 ml-1 font-bold">-20%</span>
                        </button>
                    </div>

                    <div className="space-y-4">
                        {plans.map((plan) => {
                            const isCurrent = subscription.tier === plan.id;
                            const isLoading = loadingPlanId === plan.id;
                            const Icon = plan.icon;

                            return (
                                <Card
                                    key={plan.id}
                                    className={`relative transition-all duration-300 cursor-default ${isCurrent ? `ring-2 ${theme.activeRing} border-transparent ${theme.activeBgDark}` :
                                        plan.popular ? 'border-gray-300 dark:border-gray-600 shadow-md' : 'border-gray-200 dark:border-gray-800'
                                        }`}
                                >
                                    {plan.popular && !isCurrent && (
                                        <div className={`absolute -top-3 right-4 ${theme.bg} text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm`}>
                                            RECOMMENDED
                                        </div>
                                    )}

                                    <CardContent className="p-5">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${plan.color === theme.name ? `${theme.lightBg} ${theme.text}` :
                                                'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                                }`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-bold text-gray-900 dark:text-white">${plan.price}</div>
                                                <div className="text-xs text-gray-500">/mo</div>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <h3 className="font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                                            <p className="text-xs text-gray-500 leading-snug mt-1">{plan.description}</p>
                                        </div>

                                        <div className="space-y-2 mb-5">
                                            {plan.features.slice(0, 4).map((feature, i) => (
                                                <div key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                                                    <Check className="w-3 h-3 text-green-500 shrink-0 mt-0.5" />
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                            {plan.features.length > 4 && (
                                                <div className="text-xs text-gray-400 pl-5">+ {plan.features.length - 4} more features</div>
                                            )}
                                        </div>

                                        <Button
                                            onClick={() => handlePlanSelect(plan.id)}
                                            variant={isCurrent ? "outline" : "default"}
                                            disabled={isCurrent || (loadingPlanId !== null)}
                                            className={`w-full h-9 text-xs ${isCurrent ? 'border-gray-200 text-gray-500' :
                                                plan.popular ? `${theme.bg} ${theme.hover} text-white shadow-sm` : ''
                                                }`}
                                        >
                                            {isCurrent ? "Current Plan" : isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Upgrade"}
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-gray-400" /> Cancellation Policy
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            You can cancel your subscription at any time. Your access will continue until the end of your current billing period. No questions asked.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Billing;

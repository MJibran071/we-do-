import React, { useState, useEffect } from 'react';
import { loadStripe, PaymentMethod } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Loader2, Plus, Trash2, CreditCard, Check } from 'lucide-react';
import { api } from '../utils/api';
import { toast } from 'sonner';

// Replace with your actual publishable key
const stripePromise = loadStripe('pk_test_51O...PLACEHOLDER_KEY...xY');

interface StripePaymentManagerProps {
    theme: any;
}

const PaymentMethodList = ({ theme }: { theme: any }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [addingNew, setAddingNew] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchPaymentMethods();
    }, []);

    const fetchPaymentMethods = async () => {
        setLoading(true);
        try {
            // In a real app, fetching payment methods usually happens via your backend
            // which calls stripe.paymentMethods.list({ customer: 'cus_...' })
            // Here we mock the response or call a backend endpoint
            const methods = await api.get<PaymentMethod[]>('/api/billing/payment-methods');
            setPaymentMethods(methods);
        } catch (error) {
            // Fallback mock data for demo if backend fails
            console.warn("Using mock payment methods");
            setPaymentMethods([
                {
                    id: 'pm_1',
                    type: 'card',
                    card: {
                        brand: 'visa',
                        last4: '4242',
                        exp_month: 12,
                        exp_year: 2025
                    },
                    billing_details: {
                        name: 'Demo User'
                    }
                } as any
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddPaymentMethod = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);

        const cardElement = elements.getElement(CardElement);

        if (!cardElement) return;

        try {
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });

            if (error) {
                toast.error(error.message);
            } else {
                // Send paymentMethod.id to your backend to attach to customer
                await api.post('/api/billing/payment-methods', { paymentMethodId: paymentMethod.id });
                toast.success("Payment method added successfully");
                setAddingNew(false);
                fetchPaymentMethods();
            }
        } catch (err) {
            toast.error("Failed to add payment method");
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to remove this payment method?')) return;
        try {
            await api.delete(`/api/billing/payment-methods/${id}`);
            toast.success("Payment method removed");
            fetchPaymentMethods();
        } catch (error) {
            toast.error("Failed to remove payment method");
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                {loading ? (
                    <div className="flex justify-center p-4">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                ) : (
                    paymentMethods.map((pm) => (
                        <div
                            key={pm.id}
                            className={`flex items-center justify-between p-4 border rounded-xl bg-white dark:bg-gray-800 transition-all hover:shadow-md border-gray-200 dark:border-gray-700`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                                    <CreditCard className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900 dark:text-white capitalize">{pm.card?.brand}</span>
                                        <Badge variant="secondary" className="text-xs">•••• {pm.card?.last4}</Badge>
                                    </div>
                                    <p className="text-sm text-gray-500">Exp {pm.card?.exp_month}/{pm.card?.exp_year}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(pm.id)} className="text-gray-400 hover:text-red-500">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))
                )}
            </div>

            {addingNew ? (
                <form onSubmit={handleAddPaymentMethod} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 animate-fade-in">
                    <h4 className="text-sm font-medium mb-3 text-gray-900 dark:text-white">Add New Card</h4>
                    <div className="p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md mb-4">
                        <CardElement options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                        }} />
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit" disabled={!stripe || processing} className={`${theme.bg} text-white`}>
                            {processing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                            Save Card
                        </Button>
                        <Button type="button" variant="ghost" onClick={() => setAddingNew(false)}>Cancel</Button>
                    </div>
                </form>
            ) : (
                <Button variant="outline" className="w-full border-dashed" onClick={() => setAddingNew(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Add Payment Method
                </Button>
            )}
        </div>
    );
};

export const StripePaymentManager: React.FC<StripePaymentManagerProps> = ({ theme }) => {
    return (
        <Elements stripe={stripePromise}>
            <PaymentMethodList theme={theme} />
        </Elements>
    );
};

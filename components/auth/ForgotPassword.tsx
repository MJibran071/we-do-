import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface ForgotPasswordProps {
  onNavigate: (view: 'login' | 'signup' | 'forgot-password') => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNavigate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  };

  if (isSent) {
      return (
        <AuthLayout title="Check your email" subtitle={`We've sent a reset link to ${email}`}>
            <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click the link in the email to create a new password. If you don't see it, check your spam folder.
                </p>
                <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => onNavigate('login')}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sign in
                </Button>
                <button 
                    className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline"
                    onClick={() => setIsSent(false)}
                >
                    Click here to try another email
                </button>
            </div>
        </AuthLayout>
      )
  }

  return (
    <AuthLayout 
      title="Reset your password" 
      subtitle="Enter your email address and we'll send you a link to reset your password."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-200" htmlFor="email">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                id="email" 
                type="email" 
                placeholder="name@company.com" 
                className="pl-9 h-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
        </div>

        <Button 
            type="submit" 
            className="w-full h-11 text-base bg-indigo-600 hover:bg-indigo-700 transition-all active:scale-[0.98]" 
            disabled={isLoading}
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
        </Button>

        <div className="text-center mt-4">
            <button 
                type="button"
                onClick={() => onNavigate('login')} 
                className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 flex items-center justify-center mx-auto gap-2"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Sign in
            </button>
        </div>
      </form>
    </AuthLayout>
  );
};
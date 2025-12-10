
import React, { useState, useEffect } from 'react';
import { AuthLayout } from './AuthLayout';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Mail, Lock, Loader2, User, Sparkles, ShieldCheck, AlertCircle, Check } from 'lucide-react';
import { AppMode } from '../../types';
import { getTheme } from '../../utils/theme';
import { api } from '../../utils/api';
import { toast } from 'sonner';

interface SignUpProps {
  onLogin: () => void;
  onNavigate: (view: 'login' | 'signup' | 'forgot-password') => void;
  appMode?: AppMode;
}

export const SignUp: React.FC<SignUpProps> = ({ onLogin, onNavigate, appMode = 'property' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isHuman, setIsHuman] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const theme = getTheme(appMode as AppMode);

  useEffect(() => {
    // Simple strength calc
    let score = 0;
    if (password.length > 5) score++;
    if (password.length > 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    setPasswordStrength(score); // Max 5
  }, [password]);

  const handleDemoMode = () => {
      toast.info("Creating Demo Account", { description: "You are being logged in as a simulated Admin." });
      const mockUser = {
          id: `demo-${Date.now()}`,
          name: name || 'Demo User',
          email: email || 'demo@wedo.com',
          role: 'Admin',
          avatar: `https://ui-avatars.com/api/?name=${name || 'Demo'}&background=random`
      };
      localStorage.setItem('access_token', 'demo-token');
      localStorage.setItem('wedo_user', JSON.stringify(mockUser));
      setTimeout(() => onLogin(), 800);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name || !agreed || !isHuman || password !== confirmPassword) return;
    
    setIsLoading(true);
    try {
        const response = await api.post<{ access_token: string; user: any }>(
            '/api/auth/signup', 
            { email, password, name },
            { skipErrorHandling: true }
        );

        if (response.access_token) {
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('wedo_user', JSON.stringify(response.user));
            toast.success(`Account created! Welcome, ${response.user.name}.`);
            onLogin(); // Navigate to dashboard
        }
    } catch (error: any) {
        console.error("Signup error:", error);
        
        // Fallback for any network-related error or if backend is unreachable
        if (
            error.message === 'Failed to fetch' || 
            error.message === 'Network request failed' ||
            error.name === 'TypeError' ||
            error.message.toLowerCase().includes('network') ||
            error.message.toLowerCase().includes('connect')
        ) {
            toast.warning("Backend connection failed. Switching to Offline Mode.");
            handleDemoMode();
        } else {
            toast.error("Registration failed", { 
                description: error.message || "Could not create account." 
            });
        }
    } finally {
        setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
      if (passwordStrength < 2) return 'bg-red-500';
      if (passwordStrength < 4) return 'bg-yellow-500';
      return 'bg-green-500';
  };

  const passwordsMatch = !confirmPassword || password === confirmPassword;

  return (
    <AuthLayout 
      title="Create your account" 
      subtitle="Start automating your guest experience today."
      appMode={appMode}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Social Logins */}
        <Button type="button" variant="outline" className="w-full h-10 bg-white dark:bg-transparent" onClick={handleDemoMode}>
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google (Simulated)
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-gray-50 dark:bg-gray-950 px-2 text-gray-500">Or register with email</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-200" htmlFor="name">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                id="name" 
                type="text" 
                placeholder="John Doe" 
                className="pl-9 h-11"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-200" htmlFor="email">Email</label>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-200" htmlFor="password">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="******" 
                  className="pl-9 h-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-200" htmlFor="confirmPassword">Confirm</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="******" 
                  className={`pl-9 h-11 ${!passwordsMatch ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {!passwordsMatch && (
                    <AlertCircle className="absolute right-3 top-3.5 h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
          </div>
          
          {/* Password Strength Meter */}
          {password && (
              <div className="space-y-1 animate-slide-up">
                  <div className="flex gap-1 h-1 mt-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                          <div 
                              key={level} 
                              className={`h-full flex-1 rounded-full transition-colors duration-300 ${
                                  passwordStrength >= level ? getStrengthColor() : 'bg-gray-200 dark:bg-gray-700'
                              }`}
                          ></div>
                      ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500 font-medium">
                      <span>Strength</span>
                      <span>{passwordStrength < 3 ? 'Weak' : passwordStrength < 5 ? 'Good' : 'Strong'}</span>
                  </div>
                  {!passwordsMatch && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                          Passwords do not match
                      </p>
                  )}
              </div>
          )}
        </div>

        {/* Security Verification */}
        <div 
            onClick={() => setIsHuman(!isHuman)}
            className={`p-3 ${theme.lightBg} dark:bg-opacity-10 rounded-lg border ${theme.border} dark:border-opacity-30 flex items-center gap-3 cursor-pointer select-none transition-colors hover:border-opacity-50`}
        >
            <div className="flex items-center h-5">
                <div
                    className={`h-5 w-5 rounded border flex items-center justify-center transition-all duration-200 ${isHuman ? `${theme.bg} border-transparent` : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'}`}
                >
                    {isHuman && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                </div>
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>Verify you are human</span>
            </div>
        </div>

        <div className="flex items-start gap-2 pt-2">
            <div className="flex h-5 items-center">
                <div
                    onClick={() => setAgreed(!agreed)}
                    className={`h-4 w-4 rounded border flex items-center justify-center cursor-pointer transition-all duration-200 ${agreed ? `${theme.bg} border-transparent` : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'}`}
                >
                    {agreed && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                </div>
            </div>
            <label className="text-xs text-gray-600 dark:text-gray-400 select-none">
                <span onClick={() => setAgreed(!agreed)} className="cursor-pointer">I agree to the </span>
                <a href="#" className={`underline hover:${theme.text}`}>Terms of Service</a>
                <span onClick={() => setAgreed(!agreed)} className="cursor-pointer"> and </span>
                <a href="#" className={`underline hover:${theme.text}`}>Privacy Policy</a>.
            </label>
        </div>

        <Button 
            type="submit" 
            className={`w-full h-11 text-base ${theme.bg} ${theme.hover} text-white transition-all active:scale-[0.98]`} 
            disabled={isLoading || !agreed || !isHuman || !name || !email || !password || !passwordsMatch}
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
            <span className="flex items-center gap-2">Create Account <Sparkles className="w-4 h-4" /></span>
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8">
        Already have an account?{' '}
        <button onClick={() => onNavigate('login')} className={`font-semibold ${theme.text} hover:underline`}>
          Sign in
        </button>
      </p>
    </AuthLayout>
  );
};

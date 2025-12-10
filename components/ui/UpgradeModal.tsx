import React from 'react';
import { X, Sparkles, CheckCircle2, Zap } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  featureName: string;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onUpgrade, featureName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <Card className="w-full max-w-lg relative overflow-hidden border-0 shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5 z-0"></div>
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        <div className="relative z-10 p-8">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4 animate-bounce-gentle">
                <Zap className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
               Unlock {featureName}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xs mx-auto">
               Upgrade to the <span className="font-semibold text-indigo-600 dark:text-indigo-400">Growth Plan</span> to access advanced AI features and generate more revenue.
            </p>
          </div>

          <div className="space-y-3 mb-8 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
             <div className="flex items-center gap-3">
                 <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                 <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Smart Revenue Intelligence (Gap Night & Lead Recovery)</span>
             </div>
             <div className="flex items-center gap-3">
                 <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                 <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Voice Commands & Audio Transcription</span>
             </div>
             <div className="flex items-center gap-3">
                 <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                 <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Vision AI for Maintenance Photos</span>
             </div>
             <div className="flex items-center gap-3">
                 <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                 <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Contextual Upsell Engine</span>
             </div>
          </div>

          <div className="flex gap-3">
             <Button variant="ghost" className="flex-1" onClick={onClose}>Maybe Later</Button>
             <Button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20 border-0" onClick={onUpgrade}>
                Upgrade to Growth <Sparkles className="w-4 h-4 ml-2" />
             </Button>
          </div>
          <p className="text-xs text-center text-gray-400 mt-4">
              Start with a 14-day free trial. Cancel anytime.
          </p>
        </div>
      </Card>
    </div>
  );
};
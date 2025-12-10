import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';

export interface TourStep {
  target: string; // CSS selector
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
}

interface InteractiveTourProps {
  steps: TourStep[];
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export const InteractiveTour: React.FC<InteractiveTourProps> = ({
  steps,
  isActive,
  onComplete,
  onSkip
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!isActive || !steps[currentStep]) return;

    const updatePosition = () => {
      const element = document.querySelector(steps[currentStep].target);
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const placement = steps[currentStep].placement || 'bottom';

      let top = 0;
      let left = 0;

      switch (placement) {
        case 'top':
          top = rect.top - 120;
          left = rect.left + rect.width / 2;
          break;
        case 'bottom':
          top = rect.bottom + 10;
          left = rect.left + rect.width / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2;
          left = rect.left - 320;
          break;
        case 'right':
          top = rect.top + rect.height / 2;
          left = rect.right + 10;
          break;
      }

      setPosition({ top, left });

      // Highlight element
      element.classList.add('tour-highlight');
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      const element = document.querySelector(steps[currentStep].target);
      element?.classList.remove('tour-highlight');
    };
  }, [currentStep, isActive, steps]);

  if (!isActive || !steps[currentStep]) return null;

  const handleNext = () => {
    if (steps[currentStep].action) {
      steps[currentStep].action!();
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = steps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-[100]" onClick={onSkip} />

      {/* Tour Card */}
      <div
        className="fixed z-[101] bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 w-80 transform -translate-x-1/2"
        style={{ top: `${position.top}px`, left: `${position.left}px` }}
      >
        <button
          onClick={onSkip}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
              {step.title}
            </h3>
            <span className="text-sm text-gray-500">
              {currentStep + 1} / {steps.length}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {step.content}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === currentStep
                    ? 'bg-indigo-600'
                    : i < currentStep
                    ? 'bg-indigo-300'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm flex items-center gap-1 transition-colors"
          >
            {currentStep === steps.length - 1 ? (
              <>
                <Check className="w-4 h-4" /> Finish
              </>
            ) : (
              <>
                Next <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Spotlight effect */}
      <style>{`
        .tour-highlight {
          position: relative;
          z-index: 102;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.5);
          border-radius: 8px;
        }
      `}</style>
    </>
  );
};

// Predefined tours
export const dashboardTour: TourStep[] = [
  {
    target: '[data-tour="inbox"]',
    title: 'Inbox',
    content: 'View and manage all your customer messages in one place. AI helps you respond faster.',
    placement: 'right'
  },
  {
    target: '[data-tour="calendar"]',
    title: 'Calendar',
    content: 'See all your bookings and reservations at a glance. Drag and drop to reschedule.',
    placement: 'right'
  },
  {
    target: '[data-tour="operations"]',
    title: 'Operations',
    content: 'Manage maintenance, cleaning, and daily operations efficiently.',
    placement: 'right'
  },
  {
    target: '[data-tour="copilot"]',
    title: 'Business Copilot',
    content: 'Get AI-powered insights and recommendations to grow your business.',
    placement: 'right'
  }
];

export const inboxTour: TourStep[] = [
  {
    target: '[data-tour="thread-list"]',
    title: 'Message Threads',
    content: 'All your conversations organized by platform. Click any thread to view details.',
    placement: 'right'
  },
  {
    target: '[data-tour="ai-draft"]',
    title: 'AI Draft',
    content: 'AI automatically generates reply suggestions. Edit and send with one click.',
    placement: 'top'
  },
  {
    target: '[data-tour="templates"]',
    title: 'Templates',
    content: 'Use pre-written templates for common responses. Save time on repetitive messages.',
    placement: 'left'
  },
  {
    target: '[data-tour="autopilot"]',
    title: 'Autopilot Mode',
    content: 'Enable autopilot to let AI send approved responses automatically.',
    placement: 'bottom'
  }
];

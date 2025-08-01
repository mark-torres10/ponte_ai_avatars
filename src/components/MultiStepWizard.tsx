'use client';

import { useState, useEffect, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface WizardStep {
  id: string;
  title: string;
  emotionalTitle: string; // Emotional framing like "What's Your Vision?"
  description: string;
  component: ReactNode;
  isComplete: boolean;
  isAccessible: boolean;
}

interface FormData {
  [key: string]: unknown;
}

interface MultiStepWizardProps {
  steps: WizardStep[];
  onStepChange?: (stepIndex: number, step: WizardStep) => void;
  onComplete?: (formData: FormData) => void;
  persistKey?: string; // localStorage key for persistence
}

export default function MultiStepWizard({ 
  steps, 
  onStepChange, 
  onComplete,
  persistKey = 'ponte-wizard-progress'
}: MultiStepWizardProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>({});

  // Load progress from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedProgress = localStorage.getItem(persistKey);
        if (savedProgress) {
          const { stepIndex, data } = JSON.parse(savedProgress);
          setCurrentStepIndex(stepIndex || 0);
          setFormData(data || {});
        }
      } catch (error) {
        console.warn('Failed to load wizard progress:', error);
      }
    }
  }, [persistKey]);

  // Persist progress to localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const progressData = {
          stepIndex: currentStepIndex,
          data: formData,
          timestamp: Date.now()
        };
        localStorage.setItem(persistKey, JSON.stringify(progressData));
      } catch (error) {
        console.warn('Failed to save wizard progress:', error);
      }
    }
  }, [currentStepIndex, formData, persistKey]);

  const currentStep = steps[currentStepIndex];
  const totalSteps = steps.length;
  const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100;

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < totalSteps && steps[stepIndex].isAccessible) {
      setCurrentStepIndex(stepIndex);
      if (onStepChange) {
        onStepChange(stepIndex, steps[stepIndex]);
      }
    }
  };

  const nextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      goToStep(currentStepIndex + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      goToStep(currentStepIndex - 1);
    }
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete(formData);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Header */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-foreground/70">
                Step {currentStepIndex + 1} of {totalSteps}
              </span>
              <span className="text-sm font-medium text-primary">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            <div className="w-full bg-secondary/50 rounded-full h-2">
              <div 
                className="bg-gradient-ponte h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Step Navigation */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gradient">
                {currentStep.emotionalTitle}
              </h1>
              <p className="text-sm text-foreground/70 mt-1">
                {currentStep.description}
              </p>
            </div>
            
            {/* Step Indicators */}
            <div className="hidden md:flex space-x-2">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => goToStep(index)}
                  disabled={!step.isAccessible}
                  className={cn(
                    "w-8 h-8 rounded-full text-xs font-medium transition-all duration-200",
                    index === currentStepIndex
                      ? "bg-primary text-primary-foreground shadow-lg scale-110"
                      : step.isComplete
                      ? "bg-green-500 text-white cursor-pointer hover:scale-105"
                      : step.isAccessible
                      ? "bg-secondary text-secondary-foreground cursor-pointer hover:scale-105"
                      : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                  )}
                  aria-label={`Go to step ${index + 1}: ${step.title}`}
                >
                  {step.isComplete ? '✓' : index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Step Component */}
          <div className="animate-fade-in">
            {currentStep.component}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/10">
            <button
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className={cn(
                "btn-secondary-ponte px-6 py-3 rounded-md font-medium transition-all duration-200",
                currentStepIndex === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-105"
              )}
            >
              ← Previous
            </button>

            <div className="flex space-x-4">
              {currentStepIndex === totalSteps - 1 ? (
                <button
                  onClick={handleComplete}
                  className="btn-primary-ponte px-8 py-3 rounded-md font-medium hover:scale-105 transition-all duration-200"
                >
                  Complete Request ✨
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="btn-primary-ponte px-6 py-3 rounded-md font-medium hover:scale-105 transition-all duration-200"
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom animations
const styles = `
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.5s ease-out;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
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
  validation?: () => boolean; // Optional validation function
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
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

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

  // Validate current step
  const validateCurrentStep = (): boolean => {
    if (currentStep.validation) {
      try {
        const isValid = currentStep.validation();
        if (!isValid) {
          setValidationErrors(['Please complete all required fields before proceeding']);
        } else {
          setValidationErrors([]);
        }
        return isValid;
      } catch {
        setValidationErrors(['Validation error occurred']);
        return false;
      }
    }
    setValidationErrors([]);
    return true;
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < totalSteps && steps[stepIndex].isAccessible) {
      setCurrentStepIndex(stepIndex);
      setValidationErrors([]); // Clear validation errors when changing steps
      if (onStepChange) {
        onStepChange(stepIndex, steps[stepIndex]);
      }
    }
  };

  const nextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      // Validate current step before proceeding
      if (validateCurrentStep()) {
        goToStep(currentStepIndex + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      goToStep(currentStepIndex - 1);
    }
  };

  const handleComplete = () => {
    // Validate final step before completion
    if (validateCurrentStep()) {
      if (onComplete) {
        onComplete(formData);
      }
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft' && currentStepIndex > 0) {
      event.preventDefault();
      prevStep();
    } else if (event.key === 'ArrowRight' && currentStepIndex < totalSteps - 1) {
      event.preventDefault();
      nextStep();
    } else if (event.key === 'Enter' && currentStepIndex === totalSteps - 1) {
      event.preventDefault();
      handleComplete();
    }
  };

  return (
    <div 
      className="min-h-screen bg-background"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="application"
      aria-label="Multi-step wizard"
    >
      {/* Progress Header - Enhanced for mobile */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-white/10 shadow-lg mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          {/* Progress Bar - Improved */}
          <div className="mb-4 md:mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm md:text-base font-semibold text-foreground/70">
                Step {currentStepIndex + 1} of {totalSteps}
              </span>
              <span className="text-sm md:text-base font-semibold text-primary">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            <div className="w-full bg-secondary/50 rounded-full h-3 md:h-4 overflow-hidden">
              <div 
                className="bg-gradient-ponte h-full rounded-full transition-all duration-700 ease-out shadow-lg"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Step Header - Better mobile layout */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gradient mb-2">
                {currentStep.emotionalTitle}
              </h1>
              <p className="text-sm md:text-base text-foreground/70 font-medium">
                {currentStep.description}
              </p>
            </div>
            
            {/* Step Indicators - Enhanced for mobile */}
            <div className="flex justify-center md:justify-end">
              <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                {steps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => goToStep(index)}
                    disabled={!step.isAccessible}
                    className={cn(
                      "w-10 h-10 md:w-12 md:h-12 rounded-full text-sm md:text-base font-bold transition-all duration-300 shadow-lg hover:shadow-xl",
                      "flex items-center justify-center min-w-[40px] md:min-w-[48px]",
                      index === currentStepIndex
                        ? "bg-primary text-primary-foreground scale-110 shadow-primary/50"
                        : step.isComplete
                        ? "bg-green-500 text-white cursor-pointer hover:scale-105 hover:bg-green-400"
                        : step.isAccessible
                        ? "bg-secondary text-secondary-foreground cursor-pointer hover:scale-105 hover:bg-secondary/80"
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
      </div>

      {/* Step Content - Enhanced spacing with proper top margin to avoid overlap */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-12 mt-8">
        <div className="max-w-5xl mx-auto">
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div 
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
              role="alert"
              aria-live="polite"
            >
              <div className="flex items-center space-x-2">
                <span className="text-red-500 text-lg" aria-hidden="true">⚠️</span>
                <div>
                  {validationErrors.map((error, index) => (
                    <p key={index} className="text-red-500 text-sm font-medium">
                      {error}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step Component */}
          <div className="animate-fade-in" role="main" aria-label={`Step ${currentStepIndex + 1}: ${currentStep.title}`}>
            {currentStep.component}
          </div>

          {/* Navigation Controls - Enhanced for mobile */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 md:mt-12 pt-6 md:pt-8 border-t border-white/10 space-y-4 sm:space-y-0">
            <button
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className={cn(
                "btn-secondary-ponte px-6 md:px-8 py-3 md:py-4 rounded-lg md:rounded-xl font-semibold text-base md:text-lg transition-all duration-300 w-full sm:w-auto",
                "flex items-center justify-center space-x-2",
                currentStepIndex === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-105 hover:shadow-lg"
              )}
            >
              <span className="text-lg">←</span>
              <span>Previous</span>
            </button>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              {currentStepIndex === totalSteps - 1 ? (
                <button
                  onClick={handleComplete}
                  className="btn-primary-ponte px-8 md:px-12 py-3 md:py-4 rounded-lg md:rounded-xl font-bold text-base md:text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl w-full sm:w-auto"
                >
                  Complete Request ✨
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="btn-primary-ponte px-6 md:px-8 py-3 md:py-4 rounded-lg md:rounded-xl font-semibold text-base md:text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto"
                >
                  <span>Next</span>
                  <span className="text-lg">→</span>
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
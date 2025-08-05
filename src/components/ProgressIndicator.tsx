'use client'

import React from 'react'

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  stepTitles: string[]
  completedSteps?: number[]
  canNavigateToStep?: (stepIndex: number) => boolean
  onStepClick?: (stepIndex: number) => void
  showValidation?: boolean
  isResuming?: boolean
}

export default function ProgressIndicator({ 
  currentStep, 
  totalSteps, 
  stepTitles,
  completedSteps = [],
  canNavigateToStep,
  onStepClick,
  showValidation = false,
  isResuming = false
}: ProgressIndicatorProps) {
  const getStepStatus = (index: number) => {
    if (completedSteps.includes(index)) {
      return 'completed'
    } else if (index === currentStep) {
      return 'current'
    } else if (index < currentStep) {
      return 'visited'
    } else {
      return 'upcoming'
    }
  }

  const getStepIcon = (index: number, status: string) => {
    if (status === 'completed') {
      return '✓'
    } else if (status === 'current') {
      return index + 1
    } else {
      return index + 1
    }
  }

  const getStepClasses = (index: number, status: string) => {
    const baseClasses = 'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300'
    
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-500 text-white`
      case 'current':
        return `${baseClasses} bg-gradient-ponte text-white ring-2 ring-primary/50`
      case 'visited':
        return `${baseClasses} bg-primary/20 text-primary border border-primary/30`
      default:
        return `${baseClasses} bg-white/10 text-foreground/60`
    }
  }

  const getTitleClasses = (index: number, status: string) => {
    const baseClasses = 'text-xs mt-2 text-center max-w-20 transition-colors duration-300'
    
    switch (status) {
      case 'completed':
        return `${baseClasses} text-green-400 font-medium`
      case 'current':
        return `${baseClasses} text-foreground font-medium`
      case 'visited':
        return `${baseClasses} text-primary/80`
      default:
        return `${baseClasses} text-foreground/60`
    }
  }

  const handleStepClick = (index: number) => {
    if (onStepClick && canNavigateToStep && canNavigateToStep(index)) {
      onStepClick(index)
    }
  }

  const completionPercentage = totalSteps > 0 ? Math.round((completedSteps.length / totalSteps) * 100) : 0

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="relative mb-6">
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-ponte transition-all duration-500 ease-out"
            style={{ 
              width: totalSteps === 0 ? '0%' : `${((currentStep + 1) / totalSteps) * 100}%` 
            }}
          />
        </div>
        
        {/* Completion Percentage */}
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-foreground/60">Progress</span>
          <span className="text-xs font-medium text-primary">
            {completionPercentage}% complete
          </span>
        </div>
        
        {/* Step Indicators */}
        <div className="flex justify-between mt-4">
          {stepTitles.map((title, index) => {
            const status = getStepStatus(index)
            const isClickable = canNavigateToStep && canNavigateToStep(index)
            
            return (
              <div 
                key={index} 
                className="flex flex-col items-center"
              >
                <button
                  onClick={() => handleStepClick(index)}
                  disabled={!isClickable}
                  className={`${getStepClasses(index, status)} ${
                    isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'
                  }`}
                  title={isClickable ? `Go to ${title}` : title}
                >
                  {getStepIcon(index, status)}
                </button>
                <span className={getTitleClasses(index, status)}>
                  {title}
                </span>
                
                {/* Validation indicator */}
                {showValidation && status === 'completed' && (
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-1" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Current Step Title */}
      <div className="text-center mb-6">
        {isResuming && (
          <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm text-primary">
              🔄 Resuming your progress...
            </p>
          </div>
        )}
        
        <h2 className="text-2xl font-bold mb-2">
          {currentStep >= 0 && currentStep < stepTitles.length 
            ? stepTitles[currentStep] 
            : 'Loading...'
          }
        </h2>
        <p className="text-foreground/70">
          Step {currentStep + 1} of {totalSteps}
          {completedSteps.length > 0 && (
            <span className="ml-2 text-primary">
              • {completedSteps.length} completed
            </span>
          )}
        </p>
      </div>
    </div>
  )
} 
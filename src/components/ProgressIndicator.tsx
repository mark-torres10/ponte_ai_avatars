'use client'

import React from 'react'

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  stepTitles: string[]
}

export default function ProgressIndicator({ 
  currentStep, 
  totalSteps, 
  stepTitles 
}: ProgressIndicatorProps) {
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
        
        {/* Step Indicators */}
        <div className="flex justify-between mt-4">
          {stepTitles.map((title, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  index <= currentStep 
                    ? 'bg-gradient-ponte text-white' 
                    : 'bg-white/10 text-foreground/60'
                }`}
              >
                {index + 1}
              </div>
              <span 
                className={`text-xs mt-2 text-center max-w-20 transition-colors duration-300 ${
                  index <= currentStep 
                    ? 'text-foreground' 
                    : 'text-foreground/60'
                }`}
              >
                {title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Title */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">
          {currentStep >= 0 && currentStep < stepTitles.length 
            ? stepTitles[currentStep] 
            : 'Loading...'
          }
        </h2>
        <p className="text-foreground/70">
          Step {currentStep + 1} of {totalSteps}
        </p>
      </div>
    </div>
  )
} 
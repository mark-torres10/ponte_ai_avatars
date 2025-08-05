'use client'

import React from 'react'
import { OnboardingDraft } from '@/lib/storage'

interface DraftRecoveryModalProps {
  draft: OnboardingDraft
  onResume: () => void
  onStartFresh: () => void
  onClose: () => void
}

export default function DraftRecoveryModal({ 
  draft, 
  onResume, 
  onStartFresh, 
  onClose 
}: DraftRecoveryModalProps) {
  const formatTimeAgo = (timestamp: number): string => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days > 0) {
      return `${days} day${days === 1 ? '' : 's'} ago`
    } else if (hours > 0) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`
    } else if (minutes > 0) {
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
    } else {
      return 'Just now'
    }
  }

  const getProgressSummary = () => {
    const { completedSteps } = draft.progress
    const totalSteps = 5 // Assuming 5 steps in onboarding
    
    if (completedSteps.length === 0) {
      return 'You started the onboarding process'
    } else if (completedSteps.length === totalSteps) {
      return 'You completed all steps and were ready to submit'
    } else {
      return `You completed ${completedSteps.length} of ${totalSteps} steps`
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-white/20 rounded-lg p-6 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-ponte rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📝</span>
          </div>
          <h2 className="text-xl font-bold mb-2">Continue where you left off?</h2>
          <p className="text-foreground/70 text-sm">
            We found your previous progress from {formatTimeAgo(draft.timestamp)}
          </p>
        </div>

        {/* Progress Summary */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-xs text-foreground/60">
              {formatTimeAgo(draft.timestamp)}
            </span>
          </div>
          <p className="text-sm text-foreground/80 mb-3">
            {getProgressSummary()}
          </p>
          
          {/* Progress Bar */}
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-ponte transition-all duration-300"
              style={{ 
                width: `${((draft.progress.completedSteps.length + 1) / 5) * 100}%` 
              }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-foreground/60 mt-2">
            <span>Step {draft.progress.currentStep + 1} of 5</span>
            <span>{Math.round(((draft.progress.completedSteps.length + 1) / 5) * 100)}% complete</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onResume}
            className="w-full btn-primary-ponte py-3 rounded-md font-medium"
          >
            Resume Application
          </button>
          
          <button
            onClick={onStartFresh}
            className="w-full btn-secondary-ponte py-3 rounded-md font-medium"
          >
            Start Fresh
          </button>
          
          <button
            onClick={onClose}
            className="w-full text-foreground/60 hover:text-foreground py-2 text-sm"
          >
            Maybe later
          </button>
        </div>

        {/* Info Notice */}
        <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-xs text-foreground/70">
            Your progress is automatically saved as you work. You can always return later to continue where you left off.
          </p>
        </div>
      </div>
    </div>
  )
} 
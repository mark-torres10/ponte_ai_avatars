import { useState, useEffect, useCallback, useRef } from 'react'
import { 
  saveDraft, 
  loadDraft, 
  clearDraft, 
  hasDraft, 
  getDraftAge, 
  updateLastActivity, 
  markOnboardingComplete,
  getCompletionPercentage,
  markStepCompleted,
  isStepCompleted,
  isLocalStorageSupported,
  type OnboardingDraft
} from './storage'

interface UseOnboardingProgressOptions {
  totalSteps: number
  autoSaveInterval?: number // in milliseconds, default 5000ms
  inactivityTimeout?: number // in minutes, default 30
}

interface UseOnboardingProgressReturn {
  // State
  currentStep: number
  completedSteps: number[]
  completionPercentage: number
  hasExistingDraft: boolean
  draftAge: number
  isResuming: boolean
  
  // Actions
  setCurrentStep: (step: number) => void
  markStepAsCompleted: (stepIndex: number) => void
  saveCurrentProgress: (formData: Record<string, unknown>) => void
  loadExistingDraft: () => OnboardingDraft | null
  clearAllProgress: () => void
  markOnboardingAsComplete: () => void
  resumeFromDraft: () => boolean
  
  // Utilities
  isStepCompleted: (stepIndex: number) => boolean
  canNavigateToStep: (stepIndex: number) => boolean
}

export function useOnboardingProgress({
  totalSteps,
  autoSaveInterval = 5000,
  inactivityTimeout = 30
}: UseOnboardingProgressOptions): UseOnboardingProgressReturn {
  const [currentStep, setCurrentStepState] = useState(0)
  const [completedSteps, setCompletedStepsState] = useState<number[]>([])
  const [hasExistingDraft, setHasExistingDraft] = useState(false)
  const [draftAge, setDraftAge] = useState(0)
  const [isResuming, setIsResuming] = useState(false)
  
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const inactivityCheckRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const lastActivityRef = useRef<number>(Date.now())

  // Check for existing draft on mount
  useEffect(() => {
    if (!isLocalStorageSupported()) {
      console.warn('Local storage not supported, progress saving disabled')
      return
    }

    const existingDraft = hasDraft()
    setHasExistingDraft(existingDraft)
    
    if (existingDraft) {
      setDraftAge(getDraftAge())
    }
  }, [])

  // Auto-save functionality
  const saveCurrentProgress = useCallback((formData: Record<string, unknown>) => {
    if (!isLocalStorageSupported()) return

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    // Set new timeout for auto-save
    autoSaveTimeoutRef.current = setTimeout(() => {
      saveDraft(formData, currentStep, completedSteps)
      updateLastActivity()
      lastActivityRef.current = Date.now()
    }, autoSaveInterval)
  }, [currentStep, completedSteps, autoSaveInterval])

  // Inactivity monitoring
  useEffect(() => {
    const checkInactivity = () => {
      const timeSinceLastActivity = Date.now() - lastActivityRef.current
      const inactiveMinutes = Math.floor(timeSinceLastActivity / (1000 * 60))
      
      if (inactiveMinutes >= inactivityTimeout) {
        console.log(`User inactive for ${inactiveMinutes} minutes`)
        // Could trigger a warning or auto-save here
      }
    }

    inactivityCheckRef.current = setInterval(checkInactivity, 60000) // Check every minute

    return () => {
      if (inactivityCheckRef.current) {
        clearInterval(inactivityCheckRef.current)
      }
    }
  }, [inactivityTimeout])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
      if (inactivityCheckRef.current) {
        clearInterval(inactivityCheckRef.current)
      }
    }
  }, [])

  // Set current step with validation
  const setCurrentStep = useCallback((step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStepState(step)
      updateLastActivity()
      lastActivityRef.current = Date.now()
    }
  }, [totalSteps])

  // Mark step as completed
  const markStepAsCompleted = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < totalSteps) {
      setCompletedStepsState(prev => markStepCompleted(stepIndex, prev))
      updateLastActivity()
      lastActivityRef.current = Date.now()
    }
  }, [totalSteps])

  // Load existing draft
  const loadExistingDraft = useCallback((): OnboardingDraft | null => {
    return loadDraft()
  }, [])

  // Resume from draft
  const resumeFromDraft = useCallback((): boolean => {
    const draft = loadDraft()
    if (!draft) return false

    setIsResuming(true)
    setCurrentStepState(draft.progress.currentStep)
    setCompletedStepsState(draft.progress.completedSteps)
    setDraftAge(getDraftAge())
    
    // Reset resuming flag after a short delay
    setTimeout(() => setIsResuming(false), 1000)
    
    return true
  }, [])

  // Clear all progress
  const clearAllProgress = useCallback(() => {
    clearDraft()
    setCurrentStepState(0)
    setCompletedStepsState([])
    setHasExistingDraft(false)
    setDraftAge(0)
    setIsResuming(false)
  }, [])

  // Mark onboarding as complete
  const markOnboardingAsComplete = useCallback(() => {
    markOnboardingComplete()
    clearDraft()
  }, [])

  // Check if step is completed
  const isStepCompletedCheck = useCallback((stepIndex: number): boolean => {
    return isStepCompleted(stepIndex, completedSteps)
  }, [completedSteps])

  // Check if can navigate to step (completed or next available)
  const canNavigateToStep = useCallback((stepIndex: number): boolean => {
    if (stepIndex < 0 || stepIndex >= totalSteps) return false
    
    // Can always go to completed steps
    if (isStepCompleted(stepIndex, completedSteps)) return true
    
    // Can go to next available step
    const nextAvailableStep = completedSteps.length
    return stepIndex <= nextAvailableStep
  }, [completedSteps, totalSteps])

  // Calculate completion percentage
  const completionPercentage = getCompletionPercentage(completedSteps, totalSteps)

  return {
    // State
    currentStep,
    completedSteps,
    completionPercentage,
    hasExistingDraft,
    draftAge,
    isResuming,
    
    // Actions
    setCurrentStep,
    markStepAsCompleted,
    saveCurrentProgress,
    loadExistingDraft,
    clearAllProgress,
    markOnboardingAsComplete,
    resumeFromDraft,
    
    // Utilities
    isStepCompleted: isStepCompletedCheck,
    canNavigateToStep,
  }
} 
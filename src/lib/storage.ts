// Local storage utilities for draft saving and progress management

const STORAGE_KEYS = {
  ONBOARDING_DRAFT: 'ponte_ai_onboarding_draft',
  ONBOARDING_PROGRESS: 'ponte_ai_onboarding_progress',
  ONBOARDING_TIMESTAMP: 'ponte_ai_onboarding_timestamp',
  ONBOARDING_SESSION_ID: 'ponte_ai_onboarding_session_id',
} as const

export interface OnboardingProgress {
  currentStep: number
  completedSteps: number[]
  lastActivity: number
  sessionId: string
  isComplete: boolean
}

export interface OnboardingDraft {
  formData: Record<string, unknown>
  progress: OnboardingProgress
  timestamp: number
  version: string
}

// Generate a unique session ID for tracking user sessions
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Get current session ID or create a new one
export function getSessionId(): string {
  const existing = localStorage.getItem(STORAGE_KEYS.ONBOARDING_SESSION_ID)
  if (existing) {
    return existing
  }
  
  const newSessionId = generateSessionId()
  localStorage.setItem(STORAGE_KEYS.ONBOARDING_SESSION_ID, newSessionId)
  return newSessionId
}

// Save draft data to local storage
export function saveDraft(formData: Record<string, unknown>, currentStep: number, completedSteps: number[] = []): void {
  try {
    const sessionId = getSessionId()
    const timestamp = Date.now()
    
    const progress: OnboardingProgress = {
      currentStep,
      completedSteps,
      lastActivity: timestamp,
      sessionId,
      isComplete: false,
    }
    
    const draft: OnboardingDraft = {
      formData,
      progress,
      timestamp,
      version: '1.0.0', // For future migrations
    }
    
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_DRAFT, JSON.stringify(draft))
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_PROGRESS, JSON.stringify(progress))
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_TIMESTAMP, timestamp.toString())
    
    console.log('Draft saved successfully:', { currentStep, timestamp })
  } catch (error) {
    console.error('Failed to save draft:', error)
  }
}

// Load draft data from local storage
export function loadDraft(): OnboardingDraft | null {
  try {
    const draftData = localStorage.getItem(STORAGE_KEYS.ONBOARDING_DRAFT)
    if (!draftData) {
      return null
    }
    
    const draft: OnboardingDraft = JSON.parse(draftData)
    
    // Validate draft data
    if (!draft.formData || !draft.progress || !draft.timestamp) {
      console.warn('Invalid draft data found, clearing...')
      clearDraft()
      return null
    }
    
    // Check if draft is too old (7 days)
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
    if (draft.timestamp < sevenDaysAgo) {
      console.log('Draft is too old, clearing...')
      clearDraft()
      return null
    }
    
    return draft
  } catch (error) {
    console.error('Failed to load draft:', error)
    return null
  }
}

// Load just the progress data
export function loadProgress(): OnboardingProgress | null {
  try {
    const progressData = localStorage.getItem(STORAGE_KEYS.ONBOARDING_PROGRESS)
    if (!progressData) {
      return null
    }
    
    return JSON.parse(progressData)
  } catch (error) {
    console.error('Failed to load progress:', error)
    return null
  }
}

// Clear all draft data
export function clearDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.ONBOARDING_DRAFT)
    localStorage.removeItem(STORAGE_KEYS.ONBOARDING_PROGRESS)
    localStorage.removeItem(STORAGE_KEYS.ONBOARDING_TIMESTAMP)
    localStorage.removeItem(STORAGE_KEYS.ONBOARDING_SESSION_ID)
    console.log('Draft data cleared')
  } catch (error) {
    console.error('Failed to clear draft:', error)
  }
}

// Check if there's a draft available
export function hasDraft(): boolean {
  return loadDraft() !== null
}

// Get draft age in minutes
export function getDraftAge(): number {
  try {
    const timestamp = localStorage.getItem(STORAGE_KEYS.ONBOARDING_TIMESTAMP)
    if (!timestamp) {
      return 0
    }
    
    const age = Date.now() - parseInt(timestamp)
    return Math.floor(age / (1000 * 60)) // Convert to minutes
  } catch (error) {
    return 0
  }
}

// Update last activity timestamp
export function updateLastActivity(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_TIMESTAMP, Date.now().toString())
  } catch (error) {
    console.error('Failed to update last activity:', error)
  }
}

// Check if user has been inactive for too long (30 minutes)
export function isUserInactive(): boolean {
  const lastActivity = getDraftAge()
  return lastActivity > 30 // 30 minutes
}

// Mark onboarding as complete
export function markOnboardingComplete(): void {
  try {
    const progress = loadProgress()
    if (progress) {
      progress.isComplete = true
      progress.lastActivity = Date.now()
      localStorage.setItem(STORAGE_KEYS.ONBOARDING_PROGRESS, JSON.stringify(progress))
    }
  } catch (error) {
    console.error('Failed to mark onboarding complete:', error)
  }
}

// Get completion percentage based on completed steps
export function getCompletionPercentage(completedSteps: number[], totalSteps: number): number {
  if (totalSteps === 0) return 0
  return Math.round((completedSteps.length / totalSteps) * 100)
}

// Check if a step is completed
export function isStepCompleted(stepIndex: number, completedSteps: number[]): boolean {
  return completedSteps.includes(stepIndex)
}

// Mark a step as completed
export function markStepCompleted(stepIndex: number, completedSteps: number[]): number[] {
  if (!completedSteps.includes(stepIndex)) {
    return [...completedSteps, stepIndex].sort((a, b) => a - b)
  }
  return completedSteps
}

// Check if browser supports local storage
export function isLocalStorageSupported(): boolean {
  try {
    const test = '__localStorage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch (error) {
    console.warn('Local storage not supported:', error)
    return false
  }
} 
import {
  saveDraft,
  loadDraft,
  clearDraft,
  hasDraft,
  getDraftAge,
  getCompletionPercentage,
  markStepCompleted,
  isStepCompleted,
  isLocalStorageSupported
} from '../storage'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('Storage Utilities', () => {
  beforeEach(() => {
    localStorageMock.clear()
    jest.clearAllMocks()
  })

  describe('isLocalStorageSupported', () => {
    it('should return true when localStorage is available', () => {
      expect(isLocalStorageSupported()).toBe(true)
    })

    it('should return false when localStorage throws an error', () => {
      const originalSetItem = localStorage.setItem
      localStorage.setItem = jest.fn().mockImplementation(() => {
        throw new Error('localStorage not available')
      })

      expect(isLocalStorageSupported()).toBe(false)

      localStorage.setItem = originalSetItem
    })
  })

  describe('saveDraft and loadDraft', () => {
    it('should save and load draft data correctly', () => {
      const mockFormData = {
        basicInfo: { name: 'John Doe', email: 'john@example.com' },
        personality: { toneCategories: ['professional'] }
      }
      const currentStep = 2
      const completedSteps = [0, 1]

      saveDraft(mockFormData, currentStep, completedSteps)

      const loadedDraft = loadDraft()
      expect(loadedDraft).not.toBeNull()
      expect(loadedDraft?.formData).toEqual(mockFormData)
      expect(loadedDraft?.progress.currentStep).toBe(currentStep)
      expect(loadedDraft?.progress.completedSteps).toEqual(completedSteps)
    })

    it('should return null when no draft exists', () => {
      const loadedDraft = loadDraft()
      expect(loadedDraft).toBeNull()
    })
  })

  describe('hasDraft', () => {
    it('should return true when draft exists', () => {
      const mockFormData = { test: 'data' }
      saveDraft(mockFormData, 0, [])
      expect(hasDraft()).toBe(true)
    })

    it('should return false when no draft exists', () => {
      expect(hasDraft()).toBe(false)
    })
  })

  describe('clearDraft', () => {
    it('should clear all draft data', () => {
      const mockFormData = { test: 'data' }
      saveDraft(mockFormData, 0, [])
      expect(hasDraft()).toBe(true)

      clearDraft()
      expect(hasDraft()).toBe(false)
    })
  })

  describe('getCompletionPercentage', () => {
    it('should calculate completion percentage correctly', () => {
      expect(getCompletionPercentage([0, 1], 5)).toBe(40) // 2/5 = 40%
      expect(getCompletionPercentage([0, 1, 2, 3, 4], 5)).toBe(100) // 5/5 = 100%
      expect(getCompletionPercentage([], 5)).toBe(0) // 0/5 = 0%
    })

    it('should handle zero total steps', () => {
      expect(getCompletionPercentage([0, 1], 0)).toBe(0)
    })
  })

  describe('markStepCompleted', () => {
    it('should add step to completed steps if not already present', () => {
      const completedSteps = [0, 1]
      const newCompletedSteps = markStepCompleted(2, completedSteps)
      expect(newCompletedSteps).toEqual([0, 1, 2])
    })

    it('should not add duplicate steps', () => {
      const completedSteps = [0, 1, 2]
      const newCompletedSteps = markStepCompleted(1, completedSteps)
      expect(newCompletedSteps).toEqual([0, 1, 2])
    })

    it('should maintain sorted order', () => {
      const completedSteps = [0, 2]
      const newCompletedSteps = markStepCompleted(1, completedSteps)
      expect(newCompletedSteps).toEqual([0, 1, 2])
    })
  })

  describe('isStepCompleted', () => {
    it('should return true for completed steps', () => {
      const completedSteps = [0, 1, 2]
      expect(isStepCompleted(1, completedSteps)).toBe(true)
    })

    it('should return false for incomplete steps', () => {
      const completedSteps = [0, 1, 2]
      expect(isStepCompleted(3, completedSteps)).toBe(false)
    })
  })

  describe('getDraftAge', () => {
    it('should return draft age in minutes', () => {
      const mockFormData = { test: 'data' }
      saveDraft(mockFormData, 0, [])
      
      // Mock current time to be 30 minutes later
      const originalNow = Date.now
      Date.now = jest.fn(() => originalNow() + (30 * 60 * 1000))
      
      expect(getDraftAge()).toBe(30)
      
      Date.now = originalNow
    })

    it('should return 0 when no timestamp exists', () => {
      expect(getDraftAge()).toBe(0)
    })
  })
}) 
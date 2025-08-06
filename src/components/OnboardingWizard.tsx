'use client'

import React, { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ProgressIndicator from './ProgressIndicator'
import BasicInfoStep from './BasicInfoStep'
import MediaUploadStep from './MediaUploadStep'
import TonePersonalityStep from './TonePersonalityStep'
import SelfInterviewStep from './SelfInterviewStep'
import ReviewStep from './ReviewStep'
import MockDashboard from './MockDashboard'
import DraftRecoveryModal from './DraftRecoveryModal'
import AutoSaveIndicator from './AutoSaveIndicator'
import { useOnboardingProgress } from '@/lib/useOnboardingProgress'
import { isLocalStorageSupported, type OnboardingDraft } from '@/lib/storage'
import { ONBOARDING_CONSTANTS } from '@/lib/constants'

// Form schema for the entire onboarding process
const onboardingSchema = z.object({
  basicInfo: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().optional(),
    location: z.string().optional(),
  }),
  media: z.object({
    headshots: z.array(z.any()).optional(),
    videoSample: z.any().optional(),
  }).optional(),
  personality: z.object({
    toneCategories: z.array(z.string()).optional(),
    personalityTraits: z.object({
      extroversion: z.number().min(0).max(100),
      formality: z.number().min(0).max(100),
      energy: z.number().min(0).max(100),
      professionalism: z.number().min(0).max(100),
    }),
    customTone: z.string().optional(),
  }),
  interview: z.object({
    predefinedAnswers: z.record(z.string(), z.string()).optional(),
    freeformText: z.string().optional(),
    freeformAudio: z.string().optional(),
  }),
})

type OnboardingFormData = z.infer<typeof onboardingSchema>

const steps = [
  { id: 'basic-info', title: 'Basic Information', component: BasicInfoStep },
  { id: 'media-upload', title: 'Media Upload', component: MediaUploadStep },
  { id: 'tone-personality', title: 'Tone & Personality', component: TonePersonalityStep },
  { id: 'self-interview', title: 'Self Interview', component: SelfInterviewStep },
  { id: 'review', title: 'Review & Submit', component: ReviewStep },
]

interface OnboardingWizardProps {
  onComplete?: () => void
}

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [showDraftModal, setShowDraftModal] = useState(false)
  const [draftData, setDraftData] = useState<OnboardingDraft | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<number>(Date.now())
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  // Progress management hook
  const {
    currentStep,
    completedSteps,
    hasExistingDraft,
    isResuming,
    setCurrentStep,
    markStepAsCompleted,
    saveCurrentProgress,
    loadExistingDraft,
    clearAllProgress,
    markOnboardingAsComplete,
    resumeFromDraft,
    canNavigateToStep,
  } = useOnboardingProgress({
    totalSteps: ONBOARDING_CONSTANTS.TOTAL_STEPS,
    autoSaveInterval: ONBOARDING_CONSTANTS.AUTO_SAVE_INTERVAL,
    inactivityTimeout: ONBOARDING_CONSTANTS.INACTIVITY_TIMEOUT,
  })
  
  const methods = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      basicInfo: {
        name: '',
        email: '',
        phone: '',
        location: '',
      },
      media: {
        headshots: [],
        videoSample: undefined,
      },
      personality: {
        toneCategories: [],
        personalityTraits: {
          extroversion: 50,
          formality: 50,
          energy: 50,
          professionalism: 50,
        },
        customTone: '',
      },
      interview: {
        predefinedAnswers: {},
        freeformText: '',
        freeformAudio: '',
      },
    },
    mode: 'onChange',
  })

  const { formState, watch } = methods

  // Load existing draft on mount
  useEffect(() => {
    if (hasExistingDraft) {
      setShowDraftModal(true)
      loadExistingDraft().then(draft => {
        if (draft) {
          setDraftData(draft)
        }
      })
    }
  }, [hasExistingDraft, loadExistingDraft])

  // Auto-save functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (hasUnsavedChanges && formState.isDirty) {
        handleAutoSave()
      }
    }, ONBOARDING_CONSTANTS.AUTO_SAVE_INTERVAL)

    return () => clearInterval(interval)
  }, [hasUnsavedChanges, formState.isDirty])

  const handleAutoSave = async () => {
    if (!formState.isDirty) return

    setIsSaving(true)
    try {
      await saveCurrentProgress(methods.getValues())
      setLastSaved(Date.now())
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error('Auto-save failed:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleManualSave = () => {
    if (!isLocalStorageSupported() || !formState.isDirty) return
    
    setIsSaving(true)
    const formData = methods.getValues()
    saveCurrentProgress(formData)
    setLastSaved(Date.now())
    setHasUnsavedChanges(false)
    setTimeout(() => setIsSaving(false), 1000)
  }

  // Track form changes for manual save
  useEffect(() => {
    if (!isLocalStorageSupported()) return

    const subscription = watch(() => {
      setHasUnsavedChanges(true)
    })

    return () => subscription.unsubscribe()
  }, [watch])

  // Auto-save on blur (when user finishes editing a field)
  const handleFormBlur = () => {
    if (!isLocalStorageSupported()) return
    
    if (formState.isDirty && hasUnsavedChanges) {
      setIsSaving(true)
      const formData = methods.getValues()
      saveCurrentProgress(formData)
      setLastSaved(Date.now())
      setHasUnsavedChanges(false)
      setTimeout(() => setIsSaving(false), 1000)
    }
  }

  const goToNextStep = async () => {
    // Validate current step before proceeding
    const isValid = await methods.trigger()
    if (isValid && currentStep < steps.length - 1) {
      console.log('Moving to next step:', currentStep + 1)
      
      // Mark current step as completed
      markStepAsCompleted(currentStep)
      
      // Move to next step
      setCurrentStep(currentStep + 1)
      setHasUnsavedChanges(true)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleNavigateToStep = (stepIndex: number) => {
    if (canNavigateToStep(stepIndex)) {
      setCurrentStep(stepIndex)
    }
  }

  const handleResumeDraft = () => {
    if (draftData) {
      // Reset form with draft data
      methods.reset(draftData.formData)
      
      // Resume progress
      resumeFromDraft()
      
      // Close modal
      setShowDraftModal(false)
      setDraftData(null)
    }
  }

  const handleStartFresh = () => {
    // Clear all progress and start over
    clearAllProgress()
    methods.reset()
    setShowDraftModal(false)
    setDraftData(null)
  }

  const handleCloseDraftModal = () => {
    setShowDraftModal(false)
    setDraftData(null)
  }

  const onSubmit = (data: OnboardingFormData) => {
    console.log('Onboarding data submitted:', data)
    setIsSubmitted(true)
    markOnboardingAsComplete()
    
    // Call onComplete callback if provided
    if (onComplete) {
      onComplete()
    }
  }

  const handleSubmitClick = async () => {
    console.log('Submit button clicked!')
    
    // Validate the entire form before submission
    const isValid = await methods.trigger()
    
    if (!isValid) {
      console.log('Form validation failed:', methods.formState.errors)
      console.log('Current form data:', methods.getValues())
      console.log('Form errors:', methods.formState.errors)
      // Don't proceed with submission - errors will be displayed in UI
      return
    }
    
    console.log('Form is valid, proceeding with submission')
    console.log('Current form data:', methods.getValues())
    
    // Submit the form
    methods.handleSubmit(onSubmit)()
  }

  const handleViewDashboard = () => {
    setShowDashboard(true)
  }

  const handleEditProfile = () => {
    setShowDashboard(false)
    setIsSubmitted(false)
    setCurrentStep(0) // Go back to first step
  }

  const CurrentStepComponent = steps[currentStep].component

  // Show mock dashboard after submission
  if (showDashboard) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <FormProvider {...methods}>
                <MockDashboard onEditProfile={handleEditProfile} />
                          </FormProvider>
          </div>
        </div>
      </div>
      
      {/* Auto-save indicator */}
      <AutoSaveIndicator
        lastSaved={lastSaved}
        isSaving={isSaving}
        hasChanges={hasUnsavedChanges}
        onManualSave={handleManualSave}
      />
    </div>
  )
}

  // Show success message after submission
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Success Header */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-ponte rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl text-white">✅</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                  Application{" "}
                  <span className="text-gradient-ponte">Submitted!</span>
                </h1>
                <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                  Thank you for your application! We&apos;ve received your information and will review it carefully.
                </p>
              </div>

              {/* Success Details */}
              <div className="card-ponte p-8 rounded-lg mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">What happens next?</h3>
                    <ul className="space-y-2 text-sm text-foreground/70">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Our team will review your application within 2-3 business days</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>We&apos;ll contact you via email with next steps</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>If approved, we&apos;ll help you create your first AI avatar</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Application Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-foreground/60">Application ID:</span>
                        <span className="font-mono text-primary">APP-{Date.now().toString().slice(-6)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/60">Submitted:</span>
                        <span>{new Date().toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/60">Status:</span>
                        <span className="text-yellow-500">Under Review</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleViewDashboard}
                  className="btn-primary-ponte px-8 py-3 rounded-md font-medium"
                >
                  View Demo Dashboard
                </button>
                <button
                  onClick={handleEditProfile}
                  className="btn-secondary-ponte px-8 py-3 rounded-md font-medium"
                >
                  Edit Application
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Draft Recovery Modal */}
      {showDraftModal && draftData && (
        <DraftRecoveryModal
          draft={draftData}
          onResume={handleResumeDraft}
          onStartFresh={handleStartFresh}
          onClose={handleCloseDraftModal}
        />
      )}
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Progress Indicator */}
            <ProgressIndicator
              currentStep={currentStep}
              totalSteps={steps.length}
              stepTitles={steps.map(step => step.title)}
              completedSteps={completedSteps}
              canNavigateToStep={canNavigateToStep}
              onStepClick={handleNavigateToStep}
              showValidation={true}
              isResuming={isResuming}
            />

            {/* Form */}
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8" onBlur={handleFormBlur}>
                {/* Current Step Component */}
                <div className="card-ponte p-8 rounded-lg">
                  {currentStep === steps.length - 1 ? (
                    <ReviewStep onNavigateToStep={handleNavigateToStep} />
                  ) : (
                    <CurrentStepComponent />
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/20">
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    disabled={currentStep === 0}
                    className="btn-secondary-ponte px-6 py-3 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <div className="text-sm text-foreground/60">
                    Step {currentStep + 1} of {steps.length}
                  </div>
                  
                  {currentStep === steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleSubmitClick}
                      disabled={!formState.isValid || formState.isSubmitting}
                      className="btn-primary-ponte px-6 py-3 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {formState.isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={goToNextStep}
                      className="btn-primary-ponte px-6 py-3 rounded-md font-medium"
                    >
                      Next
                    </button>
                  )}
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
      
      {/* Auto-save indicator */}
      <AutoSaveIndicator
        lastSaved={lastSaved}
        isSaving={isSaving}
        hasChanges={hasUnsavedChanges}
        onManualSave={handleManualSave}
      />
    </div>
  )
} 
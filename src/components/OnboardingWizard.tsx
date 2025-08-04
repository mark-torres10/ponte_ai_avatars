'use client'

import React, { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import ProgressIndicator from './ProgressIndicator'
import BasicInfoStep from './BasicInfoStep'
import MediaUploadStep from './MediaUploadStep'
import TonePersonalityStep from './TonePersonalityStep'
import SelfInterviewStep from './SelfInterviewStep'
import ReviewStep from './ReviewStep'
import MockDashboard from './MockDashboard'

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

export default function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  
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
        personalityTraits: {
          extroversion: 50,
          formality: 50,
          energy: 50,
          professionalism: 50,
        },
      },
      interview: {
        predefinedAnswers: {},
        freeformText: '',
        freeformAudio: '',
      },
    },
    mode: 'onChange',
  })

  const { handleSubmit, formState } = methods

  const goToNextStep = async () => {
    // Validate current step before proceeding
    const isValid = await methods.trigger()
    if (isValid && currentStep < steps.length - 1) {
      console.log('Moving to next step:', currentStep + 1)
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = (data: OnboardingFormData) => {
    console.log('Form submitted:', data)
    console.log('Setting isSubmitted to true')
    // TODO: Handle form submission
    setIsSubmitted(true)
    console.log('isSubmitted should now be true')
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
                  <span className="text-gradient">Submitted!</span>
                </h1>
                <p className="text-lg text-foreground/70">
                  Thank you for your interest in joining Ponte AI as talent. We&apos;ll review your application and get back to you soon.
                </p>
              </div>

              {/* Success Content */}
              <div className="card-ponte p-8 rounded-lg text-center">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-4">What happens next?</h2>
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-primary text-xl">📧</span>
                      </div>
                      <h3 className="font-semibold mb-2">Review Process</h3>
                      <p className="text-sm text-foreground/60">Our team will review your application within 2-3 business days</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-primary text-xl">🎯</span>
                      </div>
                      <h3 className="font-semibold mb-2">Approval</h3>
                      <p className="text-sm text-foreground/60">Once approved, you&apos;ll receive access to your talent dashboard</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-primary text-xl">💰</span>
                      </div>
                      <h3 className="font-semibold mb-2">Start Earning</h3>
                      <p className="text-sm text-foreground/60">Begin monetizing your likeness through AI avatar licensing</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleViewDashboard}
                    className="btn-primary-ponte text-base px-6 py-3 rounded-md font-medium"
                  >
                    🚀 Preview Your Earning Potential
                  </button>
                  <Link
                    href="/"
                    className="btn-secondary-ponte text-base px-6 py-3 rounded-md font-medium"
                  >
                    Return to Home
                  </Link>
                  <Link
                    href="/request-talent"
                    className="btn-secondary-ponte text-base px-6 py-3 rounded-md font-medium"
                  >
                    Browse Avatars
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-ponte rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white">👤</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                Join as{" "}
                <span className="text-gradient">Talent</span>
              </h1>
              <p className="text-lg text-foreground/70">
                Complete your profile to start monetizing your likeness through AI avatar licensing.
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="mb-8">
              <ProgressIndicator 
                currentStep={currentStep} 
                totalSteps={steps.length}
                stepTitles={steps.map(step => step.title)}
              />
            </div>

            {/* Wizard Container */}
            <div className="card-ponte p-8 rounded-lg">
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <CurrentStepComponent />
                  
                  {/* Validation Errors Display */}
                  {Object.keys(formState.errors).length > 0 && (
                    <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-red-500 mb-2">Please fix the following errors:</h4>
                          <ul className="space-y-1 text-sm text-red-400">
                            {Object.entries(formState.errors).map(([field, error]) => {
                              // Handle nested errors recursively
                              const renderError = (fieldName: string, errorObj: any): React.ReactNode => {
                                if (errorObj && typeof errorObj === 'object') {
                                  if ('type' in errorObj && 'message' in errorObj) {
                                    return (
                                      <li key={fieldName}>
                                        <strong className="capitalize">{fieldName.replace(/([A-Z])/g, ' $1').trim()}:</strong> {errorObj.message || 'This field is required'}
                                      </li>
                                    )
                                  } else {
                                    // Handle nested object errors
                                    return Object.entries(errorObj).map(([nestedField, nestedError]) => 
                                      renderError(`${fieldName}.${nestedField}`, nestedError)
                                    )
                                  }
                                }
                                return (
                                  <li key={fieldName}>
                                    <strong className="capitalize">{fieldName.replace(/([A-Z])/g, ' $1').trim()}:</strong> {errorObj?.message || 'This field is required'}
                                  </li>
                                )
                              }
                              
                              return renderError(field, error)
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  
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
      </div>
    </div>
  )
} 
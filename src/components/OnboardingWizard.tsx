'use client'

import React, { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import ProgressIndicator from './ProgressIndicator'
import BasicInfoStep from './BasicInfoStep'

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
  }),
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
  { id: 'media-upload', title: 'Media Upload', component: () => <div>Media Upload Step (Coming Soon)</div> },
  { id: 'tone-personality', title: 'Tone & Personality', component: () => <div>Tone & Personality Step (Coming Soon)</div> },
  { id: 'self-interview', title: 'Self Interview', component: () => <div>Self Interview Step (Coming Soon)</div> },
  { id: 'review', title: 'Review & Submit', component: () => <div>Review Step (Coming Soon)</div> },
]

export default function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const methods = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      basicInfo: {
        name: '',
        email: '',
        phone: '',
        location: '',
      },
      personality: {
        personalityTraits: {
          extroversion: 50,
          formality: 50,
          energy: 50,
          professionalism: 50,
        },
      },
    },
    mode: 'onChange',
  })

  const { handleSubmit, trigger } = methods

  const goToNextStep = async () => {
    // For now, just proceed to next step (validation can be added later)
    if (currentStep < steps.length - 1) {
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
    // TODO: Handle form submission
    setIsSubmitted(true)
  }

  const CurrentStepComponent = steps[currentStep].component

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
                  <Link
                    href="/"
                    className="btn-primary-ponte text-base px-6 py-3 rounded-md font-medium"
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
                        type="submit"
                        className="btn-primary-ponte px-6 py-3 rounded-md font-medium"
                      >
                        Submit Application
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
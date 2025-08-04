'use client'

import React, { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
    const isValid = await trigger()
    if (isValid && currentStep < steps.length - 1) {
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
  }

  const CurrentStepComponent = steps[currentStep].component

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
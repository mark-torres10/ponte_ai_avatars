"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import MultiStepWizard, { WizardStep } from "@/components/MultiStepWizard"
import EmotionalLanding from "@/components/EmotionalLanding"
import EnhancedAvatarSelection from "@/components/EnhancedAvatarSelection"
import StoryCreationStep from "@/components/wizard-steps/StoryCreationStep"
import CampaignPreviewStep from "@/components/wizard-steps/CampaignPreviewStep"
import SuccessStoryStep from "@/components/wizard-steps/SuccessStoryStep"
import PremiumFeaturesStep from "@/components/wizard-steps/PremiumFeaturesStep"
import BrandCustomizationStep from "@/components/wizard-steps/BrandCustomizationStep"
import FinalReviewStep from "@/components/wizard-steps/FinalReviewStep"
import { Persona } from "@/lib/personas"

export default function RequestTalentPage() {
  const router = useRouter()
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null)
  const [formData, setFormData] = useState<any>({})
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  // Update form data from any step
  const handleDataUpdate = (stepData: any) => {
    setFormData(prev => ({ ...prev, ...stepData }))
  }

  // Handle avatar selection from step 2
  const handleAvatarSelect = (persona: Persona) => {
    setSelectedPersona(persona)
    setFormData(prev => ({ ...prev, selectedAvatar: persona }))
  }

  // Handle wizard completion
  const handleWizardComplete = (finalData: any) => {
    console.log("Campaign request completed:", finalData)
    // TODO: In future phases, this will submit to backend
    alert("🎉 Campaign request submitted successfully! We'll be in touch within 24 hours.")
  }

  // Define the 8-step wizard flow
  const wizardSteps: WizardStep[] = [
    {
      id: 'emotional-landing',
      title: 'Vision',
      emotionalTitle: "What's Your Vision? 🌟",
      description: 'Transform your brand with celebrity AI avatars',
      component: (
        <EmotionalLanding
          onContinue={() => setCurrentStepIndex(1)}
          onDataUpdate={handleDataUpdate}
        />
      ),
      isComplete: false,
      isAccessible: true
    },
    {
      id: 'avatar-selection',
      title: 'Avatar',
      emotionalTitle: "Meet Your Perfect Match 💫",
      description: 'Choose your brand\'s perfect voice',
      component: (
        <EnhancedAvatarSelection
          onAvatarSelect={handleAvatarSelect}
          onDataUpdate={handleDataUpdate}
          selectedPersona={selectedPersona}
        />
      ),
      isComplete: false,
      isAccessible: true
    },
    {
      id: 'story-creation',
      title: 'Story',
      emotionalTitle: "Your Story, Their Voice 📖",
      description: 'What story do you want to tell?',
      component: (
        <StoryCreationStep
          onDataUpdate={handleDataUpdate}
          formData={formData}
        />
      ),
      isComplete: false,
      isAccessible: true
    },
    {
      id: 'campaign-preview',
      title: 'Preview',
      emotionalTitle: "See Your Future 🔮",
      description: 'Here\'s your campaign in action',
      component: (
        <CampaignPreviewStep
          onDataUpdate={handleDataUpdate}
          formData={formData}
        />
      ),
      isComplete: false,
      isAccessible: true
    },
    {
      id: 'success-story',
      title: 'Success',
      emotionalTitle: "Your Success Story 📈",
      description: 'Here\'s what success looks like for you',
      component: (
        <SuccessStoryStep
          onDataUpdate={handleDataUpdate}
          formData={formData}
        />
      ),
      isComplete: false,
      isAccessible: true
    },
    {
      id: 'premium-features',
      title: 'Amplify',
      emotionalTitle: "Amplify Your Impact 🚀",
      description: 'Want even bigger results?',
      component: (
        <PremiumFeaturesStep
          onDataUpdate={handleDataUpdate}
          formData={formData}
        />
      ),
      isComplete: false,
      isAccessible: true
    },
    {
      id: 'brand-customization',
      title: 'Perfect',
      emotionalTitle: "Make It Perfect ✨",
      description: 'Let\'s make it perfect for your brand',
      component: (
        <BrandCustomizationStep
          onDataUpdate={handleDataUpdate}
          formData={formData}
        />
      ),
      isComplete: false,
      isAccessible: true
    },
    {
      id: 'final-review',
      title: 'Launch',
      emotionalTitle: "Ready to Launch? 🎯",
      description: 'Your campaign is ready to launch',
      component: (
        <FinalReviewStep
          onDataUpdate={handleDataUpdate}
          onComplete={() => handleWizardComplete(formData)}
          formData={formData}
        />
      ),
      isComplete: false,
      isAccessible: true
    }
  ]

  const handleStepChange = (stepIndex: number, step: WizardStep) => {
    setCurrentStepIndex(stepIndex)
    
    // Track step interactions for analytics
    if (typeof window !== 'undefined') {
      console.log(`Step changed to: ${step.title} (${stepIndex + 1}/8)`)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <MultiStepWizard
        steps={wizardSteps}
        onStepChange={handleStepChange}
        onComplete={handleWizardComplete}
        persistKey="ponte-request-wizard"
      />
    </div>
  )
} 
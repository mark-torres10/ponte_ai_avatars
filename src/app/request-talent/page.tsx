"use client"

import { useState, useEffect, useCallback } from "react"
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
import { Persona, PERSONAS } from "@/lib/personas"
import { loadAvatarImages } from "@/lib/supabase-images"
import PersonalityQuiz from "@/components/PersonalityQuiz"

interface FormData {
  [key: string]: unknown;
}

// Global cache for avatar images
let avatarImagesCache: Record<string, unknown> | null = null;
let avatarImagesLoading = false;

export default function RequestTalentPage() {
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null)
  const [formData, setFormData] = useState<FormData>({})
  const [avatarImages, setAvatarImages] = useState<Record<string, unknown> | null>(null)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [avatarError, setAvatarError] = useState<string | null>(null)

  // Load avatar images once on page load
  const loadAvatarData = useCallback(async () => {
    // If already loading, don't start another request
    if (avatarImagesLoading) {
      return;
    }

    // If we have cached images, use them
    if (avatarImagesCache) {
      setAvatarImages(avatarImagesCache);
      return;
    }

    // Set loading state
    avatarImagesLoading = true;
    setAvatarLoading(true);
    setAvatarError(null);

    try {
      console.log('Page: Loading avatar images...');
      const images = await loadAvatarImages();
      
      // Cache the results
      avatarImagesCache = images;
      setAvatarImages(images);
      console.log('Page: Avatar images loaded successfully');
    } catch (err) {
      console.error('Page: Failed to load avatar images:', err);
      setAvatarError('Failed to load avatar images. Please try again.');
    } finally {
      avatarImagesLoading = false;
      setAvatarLoading(false);
    }
  }, []);

  // Load avatar images on page mount
  useEffect(() => {
    loadAvatarData();
  }, [loadAvatarData]);

  // Update form data from any step
  const handleDataUpdate = useCallback((stepData: FormData) => {
    setFormData(prev => ({ ...prev, ...stepData }))
  }, []);

  // Handle avatar selection from step 2
  const handleAvatarSelect = useCallback((persona: Persona) => {
    setSelectedPersona(persona)
    setFormData(prev => ({ ...prev, selectedAvatar: persona }))
  }, []);

  // Handle personality quiz completion
  const handleQuizComplete = useCallback((results: { persona: string; score: number }) => {
    const recommendedPersona = PERSONAS.find(p => p.id === results.persona);
    if (recommendedPersona) {
      setSelectedPersona(recommendedPersona);
      setFormData(prev => ({ 
        ...prev, 
        quizResults: results,
        recommendedAvatar: recommendedPersona 
      }));
    }
  }, []);



  // Handle wizard completion
  const handleWizardComplete = useCallback((finalData: FormData) => {
    console.log("Campaign request completed:", finalData)
    // TODO: In future phases, this will submit to backend
    alert("🎉 Campaign request submitted successfully! We'll be in touch within 24 hours.")
  }, []);

  // Validation functions for each step - memoized to prevent infinite re-renders
  const validateStep2 = useCallback((): boolean => {
    return selectedPersona !== null;
  }, [selectedPersona]);

  const validateStep3 = useCallback((): boolean => {
    const { brandMission, storyToTell, emotionalTone, callToAction } = formData;
    return (
      Boolean(brandMission) && 
      typeof brandMission === 'string' && 
      brandMission.trim().length >= 10 &&
      Boolean(storyToTell) && 
      typeof storyToTell === 'string' && 
      storyToTell.trim().length >= 20 &&
      Boolean(emotionalTone) && 
      typeof emotionalTone === 'string' &&
      emotionalTone.trim() !== '' &&
      Boolean(callToAction) && 
      typeof callToAction === 'string' && 
      callToAction.trim().length >= 5
    );
  }, [formData]);

  // Define the 9-step wizard flow (added personality quiz)
  const wizardSteps: WizardStep[] = [
    {
      id: 'emotional-landing',
      title: 'Vision',
      emotionalTitle: "What's Your Vision? 🌟",
      description: 'Transform your brand with celebrity AI avatars',
      component: (
        <EmotionalLanding
          onContinue={() => {/* Navigation handled by wizard */}}
          onDataUpdate={handleDataUpdate}
        />
      ),
      isComplete: false,
      isAccessible: true
    },
    {
      id: 'personality-quiz',
      title: 'Quiz',
      emotionalTitle: "Discover Your Perfect Match 🎯",
      description: 'Take our quick personality quiz to find your ideal avatar',
      component: (
        <PersonalityQuiz
          onComplete={handleQuizComplete}
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
          avatarImages={avatarImages || undefined}
          loading={avatarLoading}
          error={avatarError}
          onRetry={loadAvatarData}
        />
      ),
      isComplete: false,
      isAccessible: true,
      validation: validateStep2
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
      isAccessible: true,
      validation: validateStep3
    },
    {
      id: 'campaign-preview',
      title: 'Preview',
      emotionalTitle: "See Your Future 🔮",
      description: 'Here\'s your campaign in action',
      component: <CampaignPreviewStep />,
      isComplete: false,
      isAccessible: true
    },
    {
      id: 'success-story',
      title: 'Success',
      emotionalTitle: "Your Success Story 📈",
      description: 'See what success looks like',
      component: <SuccessStoryStep />,
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

  const handleStepChange = useCallback((stepIndex: number, step: WizardStep) => {
    // Track step interactions for analytics
    if (typeof window !== 'undefined') {
      console.log(`Step changed to: ${step.title} (${stepIndex + 1}/9)`)
    }
  }, []);

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
export interface WizardFormData {
  [key: string]: unknown;
  
  // Known form fields with proper typing
  brandMission?: string;
  storyToTell?: string;
  emotionalTone?: string;
  callToAction?: string;
  selectedAvatar?: any;
  quizResults?: {
    persona: string;
    score: number;
  };
  recommendedAvatar?: any;
  selectedPersona?: any;
  landingInteraction?: boolean;
  engagementTime?: number;
  viewedStories?: number;
  quizAnswers?: Record<string, string>;
  currentQuestion?: number;
  quizComplete?: boolean;
  recommendedPersona?: string;
  quizScore?: number;
  brandVoice?: string;
  competitiveDifferentiation?: string;
  selectedPremiumFeatures?: string[];
}

export interface WizardStepProps {
  onDataUpdate?: (data: WizardFormData) => void;
  formData?: WizardFormData;
  onComplete?: () => void;
} 
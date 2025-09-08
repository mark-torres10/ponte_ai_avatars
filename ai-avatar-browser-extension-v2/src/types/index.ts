export type FeatureMode = 
  | 'debate'
  | 'hot-take'
  | 'predictions'
  | 'nba-recap'
  | 'fan-reactions'
  | 'game-companion';

export type DifficultyLevel = 'easy' | 'savage';

export interface FeatureConfig {
  id: FeatureMode;
  name: string;
  icon: string;
  description: string;
  isActive: boolean;
  isComingSoon?: boolean;
}

export interface UIState {
  currentMode: FeatureMode;
  difficulty: DifficultyLevel;
  isRecording: boolean;
  isProcessing: boolean;
}

export interface MockResponse {
  text: string;
  confidence?: number;
  isSpicy?: boolean;
}

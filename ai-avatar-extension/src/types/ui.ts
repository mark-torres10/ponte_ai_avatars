// UI-specific types for the AI Avatar Browser Extension V2

export type FeatureMode = 
  | 'debate'
  | 'hot-take'
  | 'predictions'
  | 'nba-recap'
  | 'fan-reactions'
  | 'game-companion';

export type DifficultyLevel = 'easy' | 'savage';

export interface FeatureIcon {
  id: FeatureMode;
  icon: string;
  label: string;
  tooltip: string;
  isActive: boolean;
}

export interface DebateModeState {
  isRecording: boolean;
  difficulty: DifficultyLevel;
  userInput: string;
  parkerResponse: string;
  isTyping: boolean;
}

export interface MainPopupState {
  activeMode: FeatureMode;
  isVisible: boolean;
  debateMode: DebateModeState;
}

export interface FeatureGridProps {
  activeMode: FeatureMode;
  onModeChange: (mode: FeatureMode) => void;
}

export interface HeaderProps {
  activeMode: FeatureMode;
  onModeChange: (mode: FeatureMode) => void;
}

export interface DebateModeProps {
  state: DebateModeState;
  onStateChange: (state: Partial<DebateModeState>) => void;
}

export interface MicrophoneButtonProps {
  isRecording: boolean;
  onToggleRecording: () => void;
}

export interface DifficultyToggleProps {
  difficulty: DifficultyLevel;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
}

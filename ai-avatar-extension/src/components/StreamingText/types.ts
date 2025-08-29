// StreamingText component types

export interface StreamingTextState {
  text: string;
  currentIndex: number;
  isComplete: boolean;
  speed: number; // characters per second
}

export interface StreamingTextProps {
  text: string;
  speed?: number; // characters per second, default 10
  isStreaming: boolean;
  onComplete?: () => void;
  className?: string;
  showCursor?: boolean;
  cursorBlink?: boolean;
  // Audio integration props (PON-85)
  audioSync?: boolean;
  onAudioStateChange?: (currentTime: number) => void;
  audioPlaybackState?: {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
  };
}

export interface CharacterAnimationProps {
  character: string;
  index: number;
  isVisible: boolean;
  speed: number;
}

export type FeatureMode = 
  | 'debate'
  | 'hot-take'
  | 'predictions'
  | 'nba-recap'
  | 'fan-reactions'
  | 'game-companion';

export type DifficultyLevel = 'easy' | 'savage' | 'expert';

export type VoiceType = 'verse' | 'cedar' | 'marin';

export type VoiceQuality = 'standard' | 'high' | 'ultra';

export type AudioFormat = 'pcm' | 'mp3' | 'wav';

export type ResponseLength = 'short' | 'medium' | 'long';

export type SportsContext = 'basketball' | 'football' | 'soccer' | 'baseball' | 'hockey';

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

// Voice interaction types
export interface VoiceSession {
  sessionId: string;
  clientSecret: string;
  webRtcUrl: string;
  voice: VoiceType;
  difficulty: DifficultyLevel;
  isConnected: boolean;
  isRecording: boolean;
  isSpeaking: boolean;
}

export interface VoiceEventHandlers {
  onConnectionChange?: (connected: boolean) => void;
  onRecordingChange?: (recording: boolean) => void;
  onSpeakingChange?: (speaking: boolean) => void;
  onTranscript?: (text: string) => void;
  onResponse?: (text: string) => void;
  onError?: (error: Error) => void;
}

// API types
export interface TokenRequest {
  model: 'gpt-realtime';
  voice: VoiceType;
  instructions: string;
  difficulty: DifficultyLevel;
  voice_quality?: VoiceQuality;
  audio_format?: AudioFormat;
  enable_interruptions?: boolean;
  response_length?: ResponseLength;
  sports_context?: SportsContext;
}

export interface TokenResponse {
  client_secret: string;
  expires_at: number;
  session_id: string;
  model: string;
  voice: string;
  instructions: string;
  web_rtc_url: string;
  voice_quality: string;
  audio_format: string;
  difficulty: string;
  enable_interruptions: boolean;
  response_length: string;
  sports_context: string | null;
}

export interface ApiError {
  error: {
    code: number;
    message: string;
    details: Record<string, any>;
  };
  request_id: string;
  timestamp: string;
}

// Debate mode specific types
export interface DebateQuestion {
  text: string;
  timestamp: Date;
  voiceType?: VoiceType;
  sportsContext?: SportsContext;
}

export interface DebateResponse {
  text: string;
  timestamp: Date;
  voiceType: VoiceType;
  difficulty: DifficultyLevel;
  confidence?: number;
  isSpicy?: boolean;
}

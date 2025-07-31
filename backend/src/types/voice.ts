// Shared types for voice generation API
export interface GenerateVoiceRequest {
  text: string;
  personaId: string;
}

export interface GenerateVoiceResponse {
  success: boolean;
  data?: {
    audioUrl: string;
    audioData?: string; // Base64 encoded audio for immediate playback
    personaId: string;
    text: string;
  };
  error?: string | { code: string; message: string };
  timestamp: string;
} 
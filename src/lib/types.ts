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

// Shared types for video generation API
export interface GenerateVideoRequest {
  audioUrl: string;
  personaId: string;
  imageIndex?: number;
  videoFormat?: 'mp4' | 'webm';
  quality?: 'low' | 'medium' | 'high';
}

export interface GenerateVideoResponse {
  success: boolean;
  data?: {
    videoUrl: string;
    videoId: string;
    status: 'processing' | 'completed' | 'failed';
    progress?: number;
    estimatedTimeRemaining?: number;
    personaId: string;
    audioUrl: string;
    imageUrl: string;
  };
  error?: string | { code: string; message: string };
  timestamp: string;
}

export interface VideoStatusResponse {
  success: boolean;
  data?: {
    videoId: string;
    status: 'processing' | 'completed' | 'failed';
    progress: number;
    estimatedTimeRemaining?: number;
    videoUrl?: string;
    error?: string;
  };
  error?: string;
  timestamp: string;
} 
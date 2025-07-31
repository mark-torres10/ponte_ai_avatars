// Shared types for video generation API with D-ID integration
export interface GenerateVideoRequest {
  audioUrl: string;
  personaId: string;
  imageIndex?: number; // Optional: which image from the persona's image array to use
  videoFormat?: 'mp4' | 'webm';
  quality?: 'low' | 'medium' | 'high';
}

export interface GenerateVideoResponse {
  success: boolean;
  data?: {
    videoUrl: string;
    videoId: string;
    status: 'processing' | 'completed' | 'failed';
    progress?: number; // 0-100 percentage
    estimatedTimeRemaining?: number; // in seconds
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

// D-ID API specific types
export interface DIDCreateVideoRequest {
  source_url: string;
  script: {
    type: 'audio';
    audio_url: string;
  };
  config: {
    fluent: boolean;
    pad_audio: number;
    stitch: boolean;
  };
  presenter_id?: string;
  driver_id?: string;
  background?: {
    color?: string;
    image_url?: string;
  };
}

export interface DIDCreateVideoResponse {
  id: string;
  status: 'created' | 'processing' | 'done' | 'error';
  created_at: string;
  updated_at: string;
  result?: {
    video_url: string;
    duration: number;
  };
  error?: {
    code: string;
    message: string;
  };
} 
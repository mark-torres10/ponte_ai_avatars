// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  uptime: number;
  timestamp: string;
  version: string;
  environment: string;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Avatar Generation Types (for future use)
export interface Persona {
  id: string;
  name: string;
  description: string;
  imageUrls: string[];
}

export interface TextGenerationRequest {
  personaId: string;
  inputText: string;
  personalizationLevel: 'low' | 'medium' | 'high';
}

export interface TextGenerationResponse {
  originalText: string;
  personalizedText: string;
  personaId: string;
  generationTime: number;
}

export interface VoiceGenerationRequest {
  text: string;
  voiceId: string;
  stability?: number;
  similarityBoost?: number;
}

export interface VoiceGenerationResponse {
  audioUrl: string;
  duration: number;
  voiceId: string;
  generationTime: number;
}

export interface VideoGenerationRequest {
  audioUrl: string;
  imageUrl: string;
  voiceId: string;
}

export interface VideoGenerationResponse {
  videoUrl: string;
  duration: number;
  generationTime: number;
  status: 'processing' | 'completed' | 'failed';
}

// Environment Configuration Types
export interface EnvironmentConfig {
  NODE_ENV: string;
  PORT: number;
  CORS_ORIGIN: string;
  OPENAI_API_KEY: string | undefined;
  ELEVENLABS_API_KEY: string | undefined;
  DID_API_KEY: string | undefined;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  LOG_LEVEL: string;
}

// Request/Response Middleware Types
export interface RequestWithUser extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export interface LoggedRequest extends Request {
  requestId: string;
  startTime: number;
} 
// API Service for Parker Sports Extension
// Handles communication with the FastAPI backend

const API_BASE_URL = 'https://ponte-ai-backend-production.up.railway.app';

export interface TokenRequest {
  model: 'gpt-realtime';
  voice: 'verse' | 'cedar' | 'marin';
  instructions: string;
  difficulty: 'easy' | 'savage' | 'expert';
  voice_quality?: 'standard' | 'high' | 'ultra';
  audio_format?: 'pcm' | 'mp3' | 'wav';
  enable_interruptions?: boolean;
  response_length?: 'short' | 'medium' | 'long';
  sports_context?: 'basketball' | 'football' | 'soccer' | 'baseball' | 'hockey';
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

export interface VoiceConfig {
  available_voices: Array<{
    voice: string;
    description: string;
    tone: string;
    energy: string;
    style: string;
  }>;
  available_difficulties: Array<{
    difficulty: string;
    description: string;
  }>;
  voice_performance_stats: {
    total_requests: number;
    average_response_time_ms: number;
    average_audio_quality: number;
    average_user_satisfaction: number;
    interruption_rate: number;
    voice_distribution: Record<string, number>;
    difficulty_distribution: Record<string, number>;
    error_rate: number;
    last_updated: string;
  };
  voice_performance_by_type: Record<string, any>;
  monitoring_health: {
    status: string;
    active_sessions: number;
    total_requests: number;
    error_rate: number;
    average_response_time_ms: number;
    recent_errors: number;
    last_updated: string;
  };
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

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    // Debug logging
    console.log('API Request Details:', {
      url,
      method: config.method || 'GET',
      headers: config.headers,
      body: config.body ? JSON.parse(config.body as string) : null
    });

    try {
      const response = await fetch(url, config);
      
      console.log('API Response Details:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url
      });
      
      if (!response.ok) {
        let errorData: ApiError;
        try {
          errorData = await response.json();
        } catch (parseError) {
          errorData = {
            error: {
              code: response.status,
              message: response.statusText,
              details: {}
            },
            request_id: 'unknown',
            timestamp: new Date().toISOString()
          };
        }
        
        console.error('API Error Details:', errorData);
        throw new Error(`API Error ${response.status}: ${errorData.error.message}`);
      }

      const result = await response.json();
      console.log('API Success Response:', result);
      return result;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Health check
  async getHealth(): Promise<{ status: string; timestamp: string; version: string; openai_status: string }> {
    return this.makeRequest('/healthz');
  }

  // Get voice configuration
  async getVoiceConfig(): Promise<{ status: string; voice_configuration: VoiceConfig; timestamp: string }> {
    return this.makeRequest('/v1/voice/config');
  }

  // Generate token for voice interaction
  async generateToken(request: TokenRequest): Promise<TokenResponse> {
    return this.makeRequest('/v1/realtime/token', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Test voice quality
  async testVoiceQuality(
    voiceType: 'verse' | 'cedar' | 'marin',
    options: {
      instructions?: string;
      difficulty?: 'easy' | 'savage' | 'expert';
      sports_context?: string;
    } = {}
  ): Promise<{
    status: string;
    voice_test_result: {
      voice_type: string;
      test_phrase: string;
      token_generated: boolean;
      session_id: string;
      web_rtc_url: string;
      client_secret: string;
      voice_config: {
        voice: string;
        quality: string;
        format: string;
        difficulty: string;
      };
    };
    request_id: string;
    timestamp: string;
  }> {
    return this.makeRequest(`/v1/voice/test/${voiceType}`, {
      method: 'POST',
      body: JSON.stringify(options),
    });
  }

  // Get voice monitoring stats
  async getVoiceMonitoring(): Promise<{
    status: string;
    performance_stats: {
      total_requests: number;
      average_response_time_ms: number;
      average_audio_quality: number;
      average_user_satisfaction: number;
      error_rate: number;
      active_sessions: number;
    };
    voice_performance_by_type: Record<string, any>;
    recent_metrics: Array<{
      timestamp: string;
      request_id: string;
      voice_type: string;
      difficulty: string;
      response_time_ms: number;
      audio_quality: number | null;
      user_satisfaction: number | null;
      audio_chunks_processed: number;
      interruptions: number;
      error: string | null;
    }>;
    health_status: {
      status: string;
      timestamp: string;
      metrics_count: number;
      active_sessions_count: number;
    };
    timestamp: string;
  }> {
    return this.makeRequest('/v1/voice/monitoring');
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Note: Types are exported from types/index.ts to avoid conflicts

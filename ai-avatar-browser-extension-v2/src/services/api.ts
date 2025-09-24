// API Service for Parker Sports Extension
// Handles communication with the FastAPI backend

// Default fallback URL (unused; configuration comes from chrome.storage.local)
// const DEFAULT_API_BASE_URL = 'https://api.example.com';

// Get API base URL from Chrome storage
const getApiBaseUrl = (): Promise<string> => {
  console.log('🔍 DEBUG: getApiBaseUrl called');
  console.log('🔍 DEBUG: chrome.storage available?', typeof chrome.storage);
  console.log('🔍 DEBUG: chrome.storage.local available?', typeof chrome.storage?.local);
  
  return new Promise((resolve, reject) => {
    console.log('🔍 DEBUG: About to call chrome.storage.local.get');
    
    chrome.storage.local.get(['apiBaseUrl'], (result) => {
      console.log('🔍 DEBUG: chrome.storage.local.get callback executed');
      console.log('🔍 DEBUG: chrome.runtime.lastError:', chrome.runtime.lastError);
      console.log('🔍 DEBUG: result:', result);
      console.log('🔍 DEBUG: result.apiBaseUrl:', result.apiBaseUrl);
      console.log('🔍 DEBUG: typeof result.apiBaseUrl:', typeof result.apiBaseUrl);
      
      if (chrome.runtime.lastError) {
        console.log('❌ DEBUG: chrome.runtime.lastError detected:', chrome.runtime.lastError.message);
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      
      if (result.apiBaseUrl) {
        console.log('✅ DEBUG: API base URL found:', result.apiBaseUrl);
        resolve(result.apiBaseUrl);
      } else {
        console.log('❌ DEBUG: No API base URL found in result');
        console.log('🔍 DEBUG: Full result object:', JSON.stringify(result));
        reject(new Error('API base URL not configured. Please set it in extension settings.'));
      }
    });
  });
};

// Get bypass token from environment or storage
const getBypassToken = (): Promise<string> => {
  console.log('🔍 DEBUG: getBypassToken called');
  
  return new Promise((resolve, reject) => {
    console.log('🔍 DEBUG: About to call chrome.storage.local.get for bypass token');
    
    chrome.storage.local.get(['vercelBypassToken'], (result) => {
      console.log('🔍 DEBUG: chrome.storage.local.get callback executed for bypass token');
      console.log('🔍 DEBUG: chrome.runtime.lastError:', chrome.runtime.lastError);
      console.log('🔍 DEBUG: result:', result);
      console.log('🔍 DEBUG: result.vercelBypassToken:', result.vercelBypassToken);
      console.log('🔍 DEBUG: typeof result.vercelBypassToken:', typeof result.vercelBypassToken);
      
      if (chrome.runtime.lastError) {
        console.log('❌ DEBUG: chrome.runtime.lastError detected:', chrome.runtime.lastError.message);
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      if (result.vercelBypassToken) {
        console.log('✅ DEBUG: Bypass token found:', result.vercelBypassToken);
        resolve(result.vercelBypassToken);
      } else {
        console.log('❌ DEBUG: No bypass token found in result');
        console.log('🔍 DEBUG: Full result object:', JSON.stringify(result));
        reject(new Error('Vercel bypass token not configured. Please set it in extension settings.'));
      }
    });
  });
};

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
  constructor() {
    // No hardcoded base URL - will be fetched dynamically
  }

  // Set the API base URL securely
  async setApiBaseUrl(url: string): Promise<void> {
    await chrome.storage.local.set({ apiBaseUrl: url });
  }

  // Set the Vercel bypass token securely
  async setBypassToken(token: string): Promise<void> {
    await chrome.storage.local.set({ vercelBypassToken: token });
  }

  // Check if API base URL is configured
  async isApiBaseUrlConfigured(): Promise<boolean> {
    try {
      await getApiBaseUrl();
      return true;
    } catch {
      return false;
    }
  }

  // Check if bypass token is configured
  async isBypassTokenConfigured(): Promise<boolean> {
    try {
      await getBypassToken();
      return true;
    } catch {
      return false;
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    console.log('🔍 DEBUG: makeRequest called with endpoint:', endpoint);
    console.log('🔍 DEBUG: makeRequest options:', options);
    
    let baseUrl: string;
    let url: string;
    let config: RequestInit;
    
    try {
      console.log('🔍 DEBUG: About to call getApiBaseUrl()');
      // Get API base URL and bypass token securely
      baseUrl = await getApiBaseUrl();
      console.log('🔍 DEBUG: getApiBaseUrl() returned:', baseUrl);
      
      url = `${baseUrl}${endpoint}`;
      console.log('🔍 DEBUG: Final URL constructed:', url);

      // Only set Content-Type for requests with body to avoid unnecessary preflight
      const defaultHeaders: Record<string, string> = {};
      if (options.body) {
        defaultHeaders['Content-Type'] = 'application/json';
      }

      console.log('🔍 DEBUG: Default headers:', defaultHeaders);

      config = {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      };
      
      console.log('🔍 DEBUG: Final config:', config);
    } catch (error) {
      console.log('❌ DEBUG: Error in makeRequest setup:', error);
      throw error;
    }

    // Debug logging
    console.log('🔍 DEBUG: API Request Details:', {
      url,
      method: config.method || 'GET',
      headers: config.headers,
      body: config.body ? JSON.parse(config.body as string) : null
    });
    
    console.log('🔍 DEBUG: About to send message to background script');
    console.log('🔍 DEBUG: Message payload:', {
      action: 'apiCall',
      method: config.method || 'GET',
      url: url,
      headers: config.headers,
      body: config.body ? JSON.parse(config.body as string) : undefined
    });

    try {
      // Use message passing to background script instead of direct fetch
      const response = await new Promise<any>((resolve, reject) => {
        console.log('🔍 DEBUG: Sending chrome.runtime.sendMessage');
        chrome.runtime.sendMessage({
          action: 'apiCall',
          method: config.method || 'GET',
          url: url,
          headers: config.headers,
          body: config.body ? JSON.parse(config.body as string) : undefined
        }, (response) => {
          console.log('🔍 DEBUG: Background script response received:', response);
          console.log('🔍 DEBUG: chrome.runtime.lastError:', chrome.runtime.lastError);
          
          if (chrome.runtime.lastError) {
            console.log('❌ DEBUG: chrome.runtime.lastError detected:', chrome.runtime.lastError.message);
            reject(new Error(chrome.runtime.lastError.message));
          } else if (response && response.success) {
            console.log('✅ DEBUG: Background script returned success:', response.data);
            resolve(response.data);
          } else {
            console.log('❌ DEBUG: Background script returned error:', response?.error);
            reject(new Error(response?.error || 'Unknown error from background script'));
          }
        });
      });
      
      console.log('API Success Response:', response);
      return response;
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
    console.log('🔍 DEBUG: generateToken called with request:', request);
    console.log('🔍 DEBUG: About to call makeRequest with /v1/realtime/token');
    
    try {
      const result = await this.makeRequest<TokenResponse>('/v1/realtime/token', {
        method: 'POST',
        body: JSON.stringify(request),
      });
      console.log('🔍 DEBUG: generateToken makeRequest completed successfully:', result);
      return result;
    } catch (error) {
      console.log('❌ DEBUG: generateToken makeRequest failed:', error);
      throw error;
    }
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

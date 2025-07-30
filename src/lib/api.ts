// API Configuration for Railway Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ponteaiavatars-production.up.railway.app';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string | { code: string; message: string };
  timestamp: string;
}

export interface HealthCheckResponse {
  status: string;
  uptime: number;
  timestamp: string;
  version: string;
  environment: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: 'Network error occurred',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Health check endpoints
  async getHealth(): Promise<ApiResponse<HealthCheckResponse>> {
    return this.request<HealthCheckResponse>('/health');
  }

  async getDetailedHealth(): Promise<ApiResponse<HealthCheckResponse>> {
    return this.request<HealthCheckResponse>('/health/detailed');
  }

  // Avatar generation endpoints (for future use)
  async generateAvatar(payload: unknown): Promise<ApiResponse<unknown>> {
    return this.request('/api/v1/avatar', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export the base URL for debugging
export const getApiBaseUrl = () => API_BASE_URL; 
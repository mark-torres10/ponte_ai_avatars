import axios, { AxiosInstance } from 'axios';
import { logger } from '../utils/logger';

// ElevenLabs Configuration
const ELEVENLABS_CONFIG = {
  baseUrl: 'https://api.elevenlabs.io',
  apiVersion: 'v1',
  timeout: 60000, // 1 minute for voice generation
  retryAttempts: 3,
  retryDelay: 2000,
};

// Voice Configuration
const VOICE_CONFIG = {
  // Default voice settings
  stability: 0.5,
  similarityBoost: 0.75,
  style: 0.0,
  useSpeakerBoost: true,
  // Voice IDs for personas
  voices: {
    'terry-crews': process.env['ELEVENLABS_TERRY_CREWS_VOICE_ID'] || '',
    'will-howard': process.env['ELEVENLABS_WILL_HOWARD_VOICE_ID'] || '',
  }
};

export interface VoiceGenerationRequest {
  text: string;
  voiceId: string;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  useSpeakerBoost?: boolean;
}

export interface VoiceGenerationResponse {
  success: boolean;
  data?: {
    audioUrl: string;
    audioData?: string; // Base64 encoded audio
    voiceId: string;
    text: string;
    duration?: number;
    characterCount?: number;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface VoiceInfo {
  voiceId: string;
  name: string;
  category: string;
  description?: string;
  labels?: Record<string, string>;
  available: boolean;
}

export class VoiceService {
  private apiKey: string;
  private baseUrl: string;
  private client: AxiosInstance;

  constructor() {
    this.apiKey = process.env['ELEVENLABS_API_KEY'] || '';
    this.baseUrl = ELEVENLABS_CONFIG.baseUrl;

    if (!this.apiKey) {
      throw new Error('ELEVENLABS_API_KEY is required in environment variables');
    }

    this.client = axios.create({
      baseURL: `${this.baseUrl}/v${ELEVENLABS_CONFIG.apiVersion}`,
      timeout: ELEVENLABS_CONFIG.timeout,
      headers: {
        'xi-api-key': this.apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  /**
   * Generate voice from text using ElevenLabs API
   * @param params - Voice generation parameters
   * @returns Promise<Voice generation result>
   */
  async generateVoice({ 
    text, 
    voiceId, 
    stability = VOICE_CONFIG.stability,
    similarityBoost = VOICE_CONFIG.similarityBoost,
    style = VOICE_CONFIG.style,
    useSpeakerBoost = VOICE_CONFIG.useSpeakerBoost
  }: VoiceGenerationRequest): Promise<VoiceGenerationResponse> {
    try {
      logger.info('Generating voice with ElevenLabs', { 
        voiceId, 
        textLength: text.length,
        stability,
        similarityBoost
      });

      const requestData = {
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability,
          similarity_boost: similarityBoost,
          style,
          use_speaker_boost: useSpeakerBoost
        }
      };

      const response = await this.client.post(`/text-to-speech/${voiceId}`, requestData, {
        responseType: 'arraybuffer',
        headers: {
          'Accept': 'audio/mpeg'
        }
      });

      // Convert audio buffer to base64
      const audioBuffer = Buffer.from(response.data);
      const audioBase64 = audioBuffer.toString('base64');
      const audioDataUrl = `data:audio/mpeg;base64,${audioBase64}`;

      logger.info('Voice generation completed successfully', { 
        voiceId, 
        audioSize: audioBuffer.length,
        textLength: text.length
      });

      return {
        success: true,
        data: {
          audioUrl: audioDataUrl,
          audioData: audioBase64,
          voiceId,
          text,
          characterCount: text.length
        }
      };

    } catch (error) {
      logger.error('Voice generation failed', { 
        voiceId, 
        error: (error as any).response?.data || (error as any).message 
      });
      
      return {
        success: false,
        error: {
          code: this.getErrorCode(error as any),
          message: this.getErrorMessage(error as any)
        }
      };
    }
  }

  /**
   * Get available voices from ElevenLabs
   * @returns Promise<Array of voice information>
   */
  async getVoices(): Promise<VoiceInfo[]> {
    try {
      const response = await this.client.get('/voices');
      
      return response.data.voices.map((voice: any) => ({
        voiceId: voice.voice_id,
        name: voice.name,
        category: voice.category,
        description: voice.description,
        labels: voice.labels,
        available: voice.available || true
      }));
    } catch (error) {
      logger.error('Failed to fetch voices', error);
      throw new Error('Failed to fetch available voices');
    }
  }

  /**
   * Get voice information by ID
   * @param voiceId - Voice ID to fetch
   * @returns Promise<Voice information>
   */
  async getVoice(voiceId: string): Promise<VoiceInfo> {
    try {
      const response = await this.client.get(`/voices/${voiceId}`);
      const voice = response.data;
      
      return {
        voiceId: voice.voice_id,
        name: voice.name,
        category: voice.category,
        description: voice.description,
        labels: voice.labels,
        available: voice.available || true
      };
    } catch (error) {
      logger.error('Failed to fetch voice', { voiceId, error });
      throw new Error(`Failed to fetch voice: ${voiceId}`);
    }
  }

  /**
   * Get available voice IDs for personas
   * @returns Array of configured voice IDs
   */
  getAvailableVoices(): string[] {
    return Object.values(VOICE_CONFIG.voices).filter(voiceId => voiceId !== '');
  }

  /**
   * Get voice ID for a specific persona
   * @param personaId - Persona ID
   * @returns Voice ID or null if not configured
   */
  getVoiceIdForPersona(personaId: string): string | null {
    return VOICE_CONFIG.voices[personaId as keyof typeof VOICE_CONFIG.voices] || null;
  }

  /**
   * Validate if a voice ID is configured for a persona
   * @param personaId - Persona ID
   * @returns Boolean indicating if voice is configured
   */
  isVoiceConfigured(personaId: string): boolean {
    const voiceId = this.getVoiceIdForPersona(personaId);
    return voiceId !== null && voiceId !== '';
  }

  /**
   * Get all configured personas with their voice IDs
   * @returns Record of persona IDs to voice IDs
   */
  getConfiguredPersonas(): Record<string, string> {
    return Object.entries(VOICE_CONFIG.voices)
      .filter(([_, voiceId]) => voiceId !== '')
      .reduce((acc, [personaId, voiceId]) => {
        acc[personaId] = voiceId;
        return acc;
      }, {} as Record<string, string>);
  }

  /**
   * Handle ElevenLabs API errors with proper mapping
   * @param error - The error object
   * @returns Error code string
   */
  private getErrorCode(error: any): string {
    const status = error.response?.status;
    const errorMap: { [key: number]: string } = {
      400: 'ELEVENLABS_BAD_REQUEST',
      401: 'ELEVENLABS_UNAUTHORIZED',
      402: 'ELEVENLABS_PAYMENT_REQUIRED',
      403: 'ELEVENLABS_FORBIDDEN',
      404: 'ELEVENLABS_NOT_FOUND',
      429: 'ELEVENLABS_RATE_LIMITED',
      500: 'ELEVENLABS_SERVER_ERROR'
    };

    return errorMap[status] || 'ELEVENLABS_UNKNOWN_ERROR';
  }

  /**
   * Get user-friendly error message
   * @param error - The error object
   * @returns Error message string
   */
  private getErrorMessage(error: any): string {
    const status = error.response?.status;
    const errorMap: { [key: number]: string } = {
      400: 'Invalid voice generation request',
      401: 'Invalid ElevenLabs API credentials',
      402: 'ElevenLabs subscription required or quota exceeded',
      403: 'Access denied to ElevenLabs service',
      404: 'Voice not found',
      429: 'ElevenLabs rate limit exceeded',
      500: 'ElevenLabs service temporarily unavailable'
    };

    return errorMap[status] || 'Voice generation failed. Please try again.';
  }

  /**
   * Test ElevenLabs API connection
   * @returns Promise<boolean> indicating if connection is successful
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.client.get('/voices');
      return true;
    } catch (error) {
      logger.error('ElevenLabs connection test failed', error);
      return false;
    }
  }
} 
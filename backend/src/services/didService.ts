import axios, { AxiosInstance } from 'axios';
import { logger } from '../utils/logger';

// D-ID Configuration
const DID_CONFIG = {
  baseUrl: process.env['DID_API_URL'] || 'https://api.d-id.com',
  apiVersion: 'v1',
  timeout: 120000, // 2 minutes for video generation
  retryAttempts: 3,
  retryDelay: 5000,
  maxPollingAttempts: 60, // 5 minutes max (5 second intervals)
  pollingInterval: 5000, // 5 seconds
};

// Default Presenter Configuration
const PRESENTER_CONFIG = {
  // Default avatar - professional, friendly appearance
  sourceUrl: 'https://d-id-public-bucket.s3.amazonaws.com/alice.jpg',
  // Alternative presenters for variety
  alternatives: [
    'https://d-id-public-bucket.s3.amazonaws.com/amy.jpg', // Professional female
    'https://d-id-public-bucket.s3.amazonaws.com/noah.jpg', // Professional male
    'https://d-id-public-bucket.s3.amazonaws.com/emma.jpg' // Casual friendly
  ],
  // Video quality settings
  quality: 'high',
  resolution: '512x512', // Optimized for web
  format: 'mp4'
};

export interface DIDTalkRequest {
  audioUrl: string;
  script?: string | undefined;
  presenterId?: string | undefined;
}

export interface DIDTalkResponse {
  id: string;
  status: string;
  result_url?: string;
  created_at: string;
  duration?: number;
  error?: {
    description: string;
  };
}

export interface VideoGenerationResult {
  success: boolean;
  data?: {
    taskId: string;
    status: 'completed' | 'processing' | 'failed';
    videoUrl?: string | undefined;
    duration?: number | undefined;
    createdAt?: string | undefined;
  };
  error?: {
    code: string;
    message: string;
  };
  metadata?: {
    presenterId: string;
    resolution: string;
    format: string;
  };
}

export class DIDService {
  private apiKey: string;
  private baseUrl: string;
  private client: AxiosInstance;

  constructor() {
    this.apiKey = process.env['DID_API_KEY'] || '';
    this.baseUrl = DID_CONFIG.baseUrl;

    if (!this.apiKey) {
      throw new Error('DID_API_KEY is required in environment variables');
    }

    this.client = axios.create({
      baseURL: `${this.baseUrl}`,
      timeout: DID_CONFIG.timeout,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  /**
   * Create a talk request with D-ID API
   * @param params - Talk parameters
   * @returns Promise<Talk request response>
   */
  async createTalkRequest({ audioUrl, script, presenterId }: DIDTalkRequest): Promise<DIDTalkResponse> {
    try {
      const presenterUrl = presenterId || PRESENTER_CONFIG.sourceUrl;
      const requestData = {
        source_url: presenterUrl,
        script: {
          type: 'audio',
          audio_url: audioUrl,
          reduce_noise: true,
          ssml: false
        },
        config: {
          result_format: 'mp4',
          fluent: true,
          pad_audio: 0.0,
          stitch: true,
          align_driver: true,
          align_expand_factor: 1.0
        }
      };

      logger.info('Creating D-ID talk request', { 
        presenterUrl, 
        audioUrl: audioUrl.substring(0, 50) + '...', 
        scriptLength: script?.length || 0 
      });

      const response = await this.client.post('/talks', requestData);
      
      logger.info('D-ID talk request created', { 
        id: response.data.id, 
        status: response.data.status 
      });

      return response.data;
    } catch (error) {
      logger.error('Error creating D-ID talk request', { 
        status: (error as any).response?.status, 
        statusText: (error as any).response?.statusText, 
        data: (error as any).response?.data, 
        message: (error as any).message 
      });
      throw this.handleDidApiError(error as any, 'createTalkRequest');
    }
  }

  /**
   * Poll for video generation status
   * @param talkId - Talk request ID
   * @returns Promise<Completed video data>
   */
  async pollVideoStatus(talkId: string): Promise<DIDTalkResponse> {
    let attempts = 0;
    
    logger.info(`Starting to poll video status for talk ID: ${talkId}`);

    while (attempts < DID_CONFIG.maxPollingAttempts) {
      try {
        const response = await this.client.get(`/talks/${talkId}`);
        const status = response.data.status;
        
        logger.info(`Poll attempt ${attempts + 1}: Status = ${status}`);

        switch (status) {
          case 'done':
            logger.info('Video generation completed successfully');
            return {
              id: response.data.id,
              status: response.data.status,
              result_url: response.data.result_url,
              created_at: response.data.created_at,
              duration: response.data.duration
            };
          case 'error':
          case 'rejected':
            logger.error('Video generation failed', response.data);
            throw new Error(`Video generation failed: ${response.data.error?.description || 'Unknown error'}`);
          case 'created':
          case 'started':
            // Continue polling
            break;
          default:
            logger.warn(`Unknown status: ${status}`);
        }

        attempts++;
        await this.sleep(DID_CONFIG.pollingInterval);
      } catch (error) {
        logger.error(`Error polling video status (attempt ${attempts + 1}):`, (error as any).message);
        
        if (attempts >= DID_CONFIG.retryAttempts) {
          throw this.handleDidApiError(error as any, 'pollVideoStatus');
        }
        
        attempts++;
        await this.sleep(DID_CONFIG.pollingInterval);
      }
    }

    throw new Error(`Video generation timeout: exceeded ${DID_CONFIG.maxPollingAttempts} polling attempts`);
  }

  /**
   * Generate complete video from audio URL and script
   * @param params - Generation parameters
   * @returns Promise<Complete video generation result>
   */
  async generateVideo({ audioUrl, script, presenterId }: DIDTalkRequest): Promise<VideoGenerationResult> {
    try {
      logger.info('Starting video generation process');

      // Step 1: Create talk request
      const talkRequest = await this.createTalkRequest({ 
        audioUrl, 
        script: script || undefined, 
        presenterId: presenterId || undefined 
      });

      // Step 2: Poll for completion
      const completedVideo = await this.pollVideoStatus(talkRequest.id);

      logger.info('Video generation completed', { 
        id: completedVideo.id, 
        videoUrl: completedVideo.result_url?.substring(0, 50) + '...', 
        duration: completedVideo.duration 
      });

      return {
        success: true,
        data: {
          taskId: completedVideo.id,
          status: 'completed',
          videoUrl: completedVideo.result_url || undefined,
          duration: completedVideo.duration || undefined,
          createdAt: completedVideo.created_at
        },
        metadata: {
          presenterId: presenterId || PRESENTER_CONFIG.sourceUrl,
          resolution: PRESENTER_CONFIG.resolution,
          format: PRESENTER_CONFIG.format
        }
      };
    } catch (error) {
      logger.error('Video generation failed', (error as any).message);
      return {
        success: false,
        error: {
          code: (error as any).code || 'VIDEO_GENERATION_ERROR',
          message: (error as any).message
        }
      };
    }
  }

  /**
   * Handle D-ID API errors with proper mapping
   * @param error - The error object
   * @param context - Context where error occurred
   * @returns Error - Mapped error
   */
  private handleDidApiError(error: any, context: string): Error {
    const status = error.response?.status;
    const errorMap: { [key: number]: () => Error } = {
      400: () => new Error('Invalid video generation parameters'),
      401: () => new Error('Invalid D-ID API credentials'),
      402: () => new Error('D-ID quota exceeded or payment required'),
      429: () => new Error('D-ID rate limit exceeded'),
      500: () => new Error('D-ID service temporarily unavailable'),
      503: () => new Error('D-ID service overloaded')
    };

    const mappedError = errorMap[status];
    if (mappedError) {
      const err = mappedError();
      (err as any).code = `DID_API_${status}`;
      return err;
    }

    // Log unexpected errors for investigation
    logger.error('Unexpected D-ID API error', { 
      status, 
      message: error.message, 
      context, 
      timestamp: new Date().toISOString() 
    });

    const unexpectedError = new Error('Unexpected video generation error');
    (unexpectedError as any).code = 'DID_API_UNEXPECTED';
    return unexpectedError;
  }

  /**
   * Utility function for delays
   * @param ms - Milliseconds to sleep
   * @returns Promise
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get available presenters
   * @returns Array - List of available presenter configurations
   */
  getAvailablePresenters() {
    return [
      { id: 'alice', url: PRESENTER_CONFIG.sourceUrl, name: 'Alice (Default)' },
      { id: 'amy', url: PRESENTER_CONFIG.alternatives[0], name: 'Amy (Professional)' },
      { id: 'noah', url: PRESENTER_CONFIG.alternatives[1], name: 'Noah (Professional)' },
      { id: 'emma', url: PRESENTER_CONFIG.alternatives[2], name: 'Emma (Casual)' }
    ];
  }
} 
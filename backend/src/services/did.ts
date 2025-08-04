import { config } from '../utils/config';
import { logger } from '../utils/logger';
import FormData from 'form-data';
import axios from 'axios';

// D-ID Configuration
const DID_CONFIG = {
  baseUrl: 'https://api.d-id.com',
  timeout: 120000, // 2 minutes for video generation
  retryAttempts: 3,
  retryDelay: 5000
};

// Voice Actor Configuration - matching your existing system
const VOICE_ACTOR_CONFIG = {
  voiceActorA: {
    id: 'voice_actor_a',
    name: 'Voice Actor A',
    imageUrl: 'https://d-id-public-bucket.s3.amazonaws.com/alice.jpg',
    // Alternative images for variety
    images: [
      '/voice_actor_a/pic1.jpeg',
      '/voice_actor_a/pic2.jpeg',
      '/voice_actor_a/pic3.jpeg',
      '/voice_actor_a/pic4.jpeg',
      '/voice_actor_a/pic5.jpeg'
    ]
  },
  voiceActorB: {
    id: 'voice_actor_b',
    name: 'Voice Actor B',
    imageUrl: 'https://d-id-public-bucket.s3.amazonaws.com/amy.jpg',
    // Alternative images for variety
    images: [
      '/voice_actor_b/pic1.jpeg',
      '/voice_actor_b/pic2.jpeg',
      '/voice_actor_b/pic3.jpeg',
      '/voice_actor_b/pic4.jpeg',
      '/voice_actor_b/pic5.jpeg'
    ]
  }
};

// D-ID API response interfaces
export interface DIDUploadImageResponse {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  size: number;
  mime_type: string;
  url: string;
}

export interface DIDCreateTalkResponse {
  id: string;
  status: 'created' | 'started' | 'done' | 'error';
  created_at: string;
  updated_at: string;
  result?: {
    video_url?: string;
    duration?: number;
    size?: number;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface DIDGetTalkResponse {
  id: string;
  status: 'created' | 'started' | 'done' | 'error';
  created_at: string;
  updated_at: string;
  result_url?: string;
  duration?: number;
  error?: {
    code: string;
    message: string;
  };
}

export interface VideoGenerationResult {
  success: boolean;
  data?: {
    taskId: string;
    status: string;
    videoUrl?: string;
    duration?: number;
    createdAt: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

class DidService {
  private client: any;
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = config.DID_API_KEY || '';
    this.baseUrl = DID_CONFIG.baseUrl;
    
    if (!this.apiKey) {
      throw new Error('DID_API_KEY is required in environment variables');
    }
    
    this.client = axios.create({
      baseURL: `${this.baseUrl}`,
      timeout: DID_CONFIG.timeout,
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.apiKey}:`).toString('base64')}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  /**
   * Test D-ID API key validity and account status
   */
  async testConnection(): Promise<{
    valid: boolean;
    accountStatus?: any;
    error?: string;
  }> {
    const requestId = `did-test-${Date.now()}`;
    
    try {
      logger.info('Testing D-ID API connection', { requestId });

      // Test with a simple endpoint - get talks
      const response = await this.client.get('/talks');
      const data = response.data as any;
      const talksCount = Array.isArray(data) ? data.length : 0;
      
      logger.info('D-ID API test successful', { requestId, talksCount });
      
      return {
        valid: true,
        accountStatus: {
          talksAvailable: talksCount,
          apiKeyValid: true
        }
      };
    } catch (error: any) {
      logger.error('D-ID API test error', { 
        requestId, 
        status: error.response?.status,
        statusText: error.response?.statusText,
        error: error.message 
      });
      
      return {
        valid: false,
        error: `D-ID API test failed: ${error.response?.status} ${error.response?.statusText} - ${error.message}`
      };
    }
  }

  /**
   * Upload an image to D-ID for use in video generation
   */
  async uploadImage(
    imageBuffer: Buffer,
    filename?: string,
    contentType?: string
  ): Promise<DIDUploadImageResponse> {
    const requestId = `did-upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      logger.info('Uploading image to D-ID', { requestId, filename, size: imageBuffer.length });

      // Create form data for multipart upload
      const form = new FormData();
      
      // Detect content type from filename or use provided content type
      let detectedContentType = contentType;
      if (!detectedContentType && filename) {
        const extension = filename.toLowerCase().split('.').pop();
        switch (extension) {
          case 'png':
            detectedContentType = 'image/png';
            break;
          case 'gif':
            detectedContentType = 'image/gif';
            break;
          case 'webp':
            detectedContentType = 'image/webp';
            break;
          default:
            detectedContentType = 'image/jpeg';
        }
      } else if (!detectedContentType) {
        detectedContentType = 'image/jpeg'; // Default fallback
      }
      
      form.append('image', imageBuffer, {
        filename: filename || 'avatar.jpg',
        contentType: detectedContentType
      });
      
      if (filename) {
        form.append('filename', filename);
      }

      const response = await this.client.post('/images', form, {
        headers: {
          ...form.getHeaders(),
        },
      });

      const data = response.data as DIDUploadImageResponse;
      logger.info('D-ID image uploaded successfully', { 
        requestId, 
        imageId: data.id, 
        name: data.name,
        size: data.size 
      });
      
      return data;
    } catch (error: any) {
      logger.error('Failed to upload image to D-ID', { 
        requestId, 
        status: error.response?.status,
        statusText: error.response?.statusText,
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Create a talk request with D-ID API
   */
  async createTalkRequest(params: {
    scriptText: string;
    sourceUrl?: string;
    sourceImageId?: string;
    presenterId?: string;
    audioUrl?: string;
    imageUrl?: string;
  }): Promise<DIDCreateTalkResponse> {
    const requestId = `did-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      logger.info('Creating D-ID talk', { 
        requestId, 
        sourceUrl: params.sourceUrl, 
        sourceImageId: params.sourceImageId, 
        scriptLength: params.scriptText.length 
      });
      
      const requestData: any = {
        script: {
          type: 'audio',
          audio_url: params.audioUrl,
          reduce_noise: true
        },
        config: {
          result_format: 'mp4',
          fluent: true,
          pad_audio: 0.0,
          stitch: true,
          align_driver: true,
          align_expand_factor: 0.3
        }
      };

      // Add source (either URL or image ID)
      if (params.sourceImageId) {
        requestData.source_image_id = params.sourceImageId;
      } else if (params.imageUrl) {
        requestData.source_url = params.imageUrl;
      } else {
        requestData.source_url = params.sourceUrl || VOICE_ACTOR_CONFIG.voiceActorA.imageUrl;
      }



      logger.info('Creating D-ID talk request:', {
        requestId,
        imageUrl: params.imageUrl || params.sourceUrl || 'fallback_url',
        scriptLength: params.scriptText.length,
        requestData: {
          source_url: requestData.source_url,
          source_image_id: requestData.source_image_id,
          audio_url: requestData.script.audio_url?.substring(0, 50) + '...'
        }
      });

      const response = await this.client.post('/talks', requestData);
      const data = response.data as DIDCreateTalkResponse;
      

      
      logger.info('D-ID talk request created:', {
        requestId,
        id: data.id,
        status: data.status
      });

      return data;
      
    } catch (error: any) {
      logger.error('Error creating D-ID talk request:', {
        requestId,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      throw this.handleDidApiError(error, 'createTalkRequest');
    }
  }

  /**
   * Poll for video generation status
   */
  async pollVideoStatus(talkId: string): Promise<DIDGetTalkResponse> {
    const maxAttempts = 60; // 5 minutes max (5 second intervals)
    let attempts = 0;
    let errorRetries = 0;
    const requestId = `did-poll-${talkId}`;

    logger.info(`Starting to poll video status for talk ID: ${talkId}`, { requestId });

    while (attempts < maxAttempts) {
      try {
        const response = await this.client.get(`/talks/${talkId}`);
        const data = response.data as DIDGetTalkResponse;
        const status = data.status;
        
        logger.info(`Poll attempt ${attempts + 1}: Status = ${status}`, { requestId });

        switch (status) {
          case 'done':
            logger.info('Video generation completed successfully', { requestId, talkId });
            return data;

          case 'error':
            logger.error('Video generation failed:', { requestId, talkId, data });
            throw new Error(`Video generation failed: ${data.error?.message || 'Unknown error'}`);

          case 'created':
          case 'started':
            // Continue polling
            break;

          default:
            logger.warn(`Unknown status: ${status}`, { requestId });
        }

        attempts++;
        await this.sleep(DID_CONFIG.retryDelay);
        
      } catch (error: any) {
        logger.error(`Error polling video status (attempt ${attempts + 1}, error retry ${errorRetries + 1}):`, { 
          requestId, 
          talkId,
          error: error.message 
        });
        
        errorRetries++;
        if (errorRetries >= DID_CONFIG.retryAttempts) {
          throw this.handleDidApiError(error, 'pollVideoStatus');
        }
        
        attempts++;
        await this.sleep(DID_CONFIG.retryDelay);
      }
    }

    throw new Error(`Video generation timeout: exceeded ${maxAttempts} polling attempts`);
  }

  /**
   * Generate complete video from text script with voice actor integration
   */
  async generateVideo(params: {
    scriptText: string;
    voiceActorId?: 'voice_actor_a' | 'voice_actor_b';
    sourceUrl?: string;
    sourceImageId?: string;
    audioUrl?: string;
    imageUrl?: string;
  }): Promise<VideoGenerationResult> {
    try {
      logger.info('Starting video generation process', { voiceActorId: params.voiceActorId });
      
      // Step 1: Create talk request
      const talkRequestParams: any = {
        scriptText: params.scriptText
      };
      
      if (params.audioUrl) {
        talkRequestParams.audioUrl = params.audioUrl;
      }
      if (params.imageUrl) {
        talkRequestParams.imageUrl = params.imageUrl;
      } else if (params.sourceImageId) {
        talkRequestParams.sourceImageId = params.sourceImageId;
      } else if (params.sourceUrl) {
        talkRequestParams.sourceUrl = params.sourceUrl;
      }
      
      const talkRequest = await this.createTalkRequest(talkRequestParams);

      // Step 2: Poll for completion
      const completedVideo = await this.pollVideoStatus(talkRequest.id);


      
      logger.info('Video generation completed:', {
        id: completedVideo.id,
        videoUrl: completedVideo.result_url?.substring(0, 50) + '...',
        duration: completedVideo.duration
      });

      const resultData: any = {
        taskId: completedVideo.id,
        status: 'completed',
        createdAt: completedVideo.created_at
      };
      
      if (completedVideo.result_url) {
        resultData.videoUrl = completedVideo.result_url;
      }
      if (completedVideo.duration) {
        resultData.duration = completedVideo.duration;
      }
      
      return {
        success: true,
        data: resultData
      };

    } catch (error: any) {
      logger.error('Video generation failed:', { error: error.message });
      
      return {
        success: false,
        error: {
          code: error.code || 'VIDEO_GENERATION_ERROR',
          message: error.message
        }
      };
    }
  }

  /**
   * Handle D-ID API errors with proper mapping
   */
  private handleDidApiError(error: any, context: string): Error {
    const status = error.response?.status;
    
    const errorMap: { [key: number]: () => Error } = {
      400: () => new Error('Invalid video generation parameters'),
      401: () => new Error('Invalid D-ID API credentials'),
      402: () => new Error('D-ID quota exceeded or payment required'),
      403: () => new Error('D-ID API access forbidden - check API key and permissions'),
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
    logger.error('Unexpected D-ID API error:', {
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
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get available voice actors
   */
  getAvailableVoiceActors() {
    return [
      { 
        id: VOICE_ACTOR_CONFIG.voiceActorA.id, 
        name: VOICE_ACTOR_CONFIG.voiceActorA.name, 
        imageUrl: VOICE_ACTOR_CONFIG.voiceActorA.imageUrl,
        images: VOICE_ACTOR_CONFIG.voiceActorA.images
      },
      { 
        id: VOICE_ACTOR_CONFIG.voiceActorB.id, 
        name: VOICE_ACTOR_CONFIG.voiceActorB.name, 
        imageUrl: VOICE_ACTOR_CONFIG.voiceActorB.imageUrl,
        images: VOICE_ACTOR_CONFIG.voiceActorB.images
      }
    ];
  }
}

// Create singleton instance
let didServiceInstance: DidService | null = null;

export const getDidService = (): DidService => {
  if (!didServiceInstance) {
    didServiceInstance = new DidService();
  }
  return didServiceInstance;
};

// Export individual functions for backward compatibility
export const testDIDConnection = async () => {
  const service = getDidService();
  return service.testConnection();
};

export const uploadImage = async (imageBuffer: Buffer, filename?: string) => {
  const service = getDidService();
  return service.uploadImage(imageBuffer, filename);
};

export const createTalk = async (
  scriptText: string,
  sourceUrl?: string,
  sourceImageId?: string,
  presenterId?: string
) => {
  const service = getDidService();
  const params: any = { scriptText };
  
  if (sourceUrl) {
    params.sourceUrl = sourceUrl;
  }
  if (sourceImageId) {
    params.sourceImageId = sourceImageId;
  }
  if (presenterId) {
    params.presenterId = presenterId;
  }
  
  return service.createTalkRequest(params);
};

export const getTalk = async (talkId: string) => {
  const service = getDidService();
  return service.pollVideoStatus(talkId);
};

export const waitForTalkCompletion = async (talkId: string) => {
  const service = getDidService();
  return service.pollVideoStatus(talkId);
};

export const downloadVideo = async (videoUrl: string): Promise<ArrayBuffer> => {
  const requestId = `did-download-${Date.now()}`;
  
  try {
    logger.info('Downloading video from D-ID', { requestId, videoUrl });

    const response = await fetch(videoUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to download video: ${response.status} ${response.statusText}`);
    }

    const videoBuffer = await response.arrayBuffer();
    logger.info('Video downloaded successfully', { requestId, size: videoBuffer.byteLength });
    
    return videoBuffer;
  } catch (error: any) {
    logger.error('Failed to download video from D-ID', { requestId, videoUrl, error: error.message });
    throw error;
  }
};

export const isDIDConfigured = (): boolean => {
  return !!config.DID_API_KEY;
};

export const getDIDConfigStatus = () => {
  return {
    apiKeyConfigured: !!config.DID_API_KEY,
    apiKeyLength: config.DID_API_KEY ? config.DID_API_KEY.length : 0,
  };
}; 
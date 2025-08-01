import { config } from '../utils/config';
import { logger } from '../utils/logger';
import FormData from 'form-data';

// D-ID API configuration
const DID_API_BASE = 'https://api.d-id.com';

// D-ID API response interfaces
export interface DIDUploadImageRequest {
  image: Buffer;
  filename?: string;
}

export interface DIDUploadImageResponse {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  size: number;
  mime_type: string;
  url: string;
}

export interface DIDCreateTalkRequest {
  source_url?: string;
  source_image_id?: string;
  script: {
    type: 'text';
    input: string;
    provider?: {
      type: 'microsoft' | 'amazon' | 'elevenlabs';
      voice_id?: string;
    };
  };
  presenter_id?: string;
  driver_id?: string;
  config?: {
    fluent?: boolean;
    pad_audio?: number;
    stitch?: boolean;
    align_driver?: boolean;
    align_expand_factor?: number;
    auto_match?: boolean;
    normalization_factor?: number;
    motion_factor?: number;
    result_format?: 'mp4' | 'webm';
    quality?: 'draft' | 'preview' | 'production';
    background?: {
      color?: string;
      blur?: number;
    };
  };
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

export interface DIDError {
  code: string;
  message: string;
  details?: any;
}

/**
 * Create D-ID API authentication header
 */
const getAuthHeader = (): string => {
  if (!config.DID_API_KEY) {
    throw new Error('D-ID API key not configured');
  }
  
  // D-ID uses Basic Auth with API key format: API_USERNAME:API_PASSWORD
  // The API key should already be in the correct format, just encode it as base64
  const credentials = Buffer.from(config.DID_API_KEY).toString('base64');
  return `Basic ${credentials}`;
};

/**
 * Test D-ID API key validity and account status
 */
export const testDIDConnection = async (): Promise<{
  valid: boolean;
  accountStatus?: any;
  error?: string;
}> => {
  const requestId = `did-test-${Date.now()}`;
  
  try {
    logger.info('Testing D-ID API connection', { requestId });

    // Test with a simple endpoint - get voices
    const response = await fetch(`${DID_API_BASE}/voices`, {
      method: 'GET',
      headers: {
        'Authorization': getAuthHeader(),
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error('D-ID API test failed', { 
        requestId, 
        status: response.status, 
        statusText: response.statusText,
        error: errorText 
      });
      
      return {
        valid: false,
        error: `D-ID API test failed: ${response.status} ${response.statusText} - ${errorText}`
      };
    }

    const data = await response.json() as any;
    const voicesCount = Array.isArray(data) ? data.length : 0;
    logger.info('D-ID API test successful', { requestId, voicesCount });
    
    return {
      valid: true,
      accountStatus: {
        voicesAvailable: voicesCount,
        apiKeyValid: true
      }
    };
  } catch (error) {
    logger.error('D-ID API test error', { 
      requestId, 
      error: error instanceof Error ? error.message : error 
    });
    
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Upload an image to D-ID for use in video generation
 */
export const uploadImage = async (
  imageBuffer: Buffer,
  filename?: string
): Promise<DIDUploadImageResponse> => {
  const requestId = `did-upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    logger.info('Uploading image to D-ID', { requestId, filename, size: imageBuffer.length });

    const authHeader = getAuthHeader();
    
    // Create form data for multipart upload
    const form = new FormData();
    form.append('image', imageBuffer, {
      filename: filename || 'avatar.jpg',
      contentType: 'image/jpeg'
    });
    
    if (filename) {
      form.append('filename', filename);
    }

    // Debug: Log form data details
    logger.info('D-ID upload form data details', { 
      requestId, 
      filename: filename || 'avatar.jpg',
      contentType: 'image/jpeg',
      imageBufferSize: imageBuffer.length,
      formHeaders: form.getHeaders()
    });

    const response = await fetch(`${DID_API_BASE}/images`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        ...form.getHeaders(),
      },
      body: form,
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error('D-ID image upload error', { 
        requestId, 
        status: response.status, 
        statusText: response.statusText,
        error: errorText 
      });
      
      throw new Error(`D-ID image upload error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json() as DIDUploadImageResponse;
    logger.info('D-ID image uploaded successfully', { 
      requestId, 
      imageId: data.id, 
      name: data.name,
      size: data.size 
    });
    
    return data;
  } catch (error) {
    logger.error('Failed to upload image to D-ID', { 
      requestId, 
      error: error instanceof Error ? error.message : error 
    });
    throw error;
  }
};

/**
 * Create a new talk video using D-ID API
 */
export const createTalk = async (
  scriptText: string,
  sourceUrl?: string,
  sourceImageId?: string,
  presenterId?: string
): Promise<DIDCreateTalkResponse> => {
  const requestId = `did-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    logger.info('Creating D-ID talk', { requestId, sourceUrl, sourceImageId, scriptLength: scriptText.length });

    // Build payload based on available source
    const payload: DIDCreateTalkRequest = {
      script: {
        type: 'text',
        input: scriptText,
      },
    };

    // Add source (either URL or image ID)
    if (sourceImageId) {
      payload.source_image_id = sourceImageId;
    } else if (sourceUrl) {
      payload.source_url = sourceUrl;
    } else {
      throw new Error('Either sourceUrl or sourceImageId must be provided');
    }

    // Add presenter ID if provided
    if (presenterId) {
      payload.presenter_id = presenterId;
    }

    // Debug: Log the payload to check for circular references
    logger.info('D-ID request payload', { 
      requestId, 
      payload: JSON.stringify(payload, null, 2),
      sourceUrl,
      scriptLength: scriptText.length
    });

    const authHeader = getAuthHeader();
    
    // Debug: Log auth header format (without revealing the actual credentials)
    logger.info('D-ID auth header format', { 
      requestId, 
      authHeaderLength: authHeader.length,
      authHeaderPrefix: authHeader.substring(0, 10) + '...'
    });

    const response = await fetch(`${DID_API_BASE}/talks`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error('D-ID API error', { 
        requestId, 
        status: response.status, 
        statusText: response.statusText,
        error: errorText 
      });
      
      throw new Error(`D-ID API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json() as DIDCreateTalkResponse;
    logger.info('D-ID talk created successfully', { requestId, talkId: data.id, status: data.status });
    
    return data;
  } catch (error) {
    logger.error('Failed to create D-ID talk', { requestId, error: error instanceof Error ? error.message : error });
    throw error;
  }
};

/**
 * Get talk status and result from D-ID API
 */
export const getTalk = async (talkId: string): Promise<DIDGetTalkResponse> => {
  const requestId = `did-get-${talkId}`;
  
  try {
    logger.info('Getting D-ID talk status', { requestId, talkId });

    const response = await fetch(`${DID_API_BASE}/talks/${talkId}`, {
      method: 'GET',
      headers: {
        'Authorization': getAuthHeader(),
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error('D-ID API error getting talk', { 
        requestId, 
        talkId,
        status: response.status, 
        statusText: response.statusText,
        error: errorText 
      });
      
      throw new Error(`D-ID API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json() as DIDGetTalkResponse;
    logger.info('D-ID talk status retrieved', { requestId, talkId, status: data.status });
    
    return data;
  } catch (error) {
    logger.error('Failed to get D-ID talk', { requestId, talkId, error: error instanceof Error ? error.message : error });
    throw error;
  }
};

/**
 * Wait for talk to complete with polling
 */
export const waitForTalkCompletion = async (
  talkId: string,
  maxWaitTime: number = 300000, // 5 minutes
  pollInterval: number = 5000 // 5 seconds
): Promise<DIDGetTalkResponse> => {
  const startTime = Date.now();
  const requestId = `did-wait-${talkId}`;
  
  logger.info('Starting to wait for D-ID talk completion', { requestId, talkId, maxWaitTime });

  while (Date.now() - startTime < maxWaitTime) {
    const talk = await getTalk(talkId);
    
    if (talk.status === 'done') {
      logger.info('D-ID talk completed successfully', { requestId, talkId, videoUrl: talk.result?.video_url });
      return talk;
    }
    
    if (talk.status === 'error') {
      logger.error('D-ID talk failed', { requestId, talkId, error: talk.error });
      throw new Error(`D-ID talk failed: ${talk.error?.message || 'Unknown error'}`);
    }
    
    // Wait before next poll
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }
  
  throw new Error(`D-ID talk timeout after ${maxWaitTime}ms`);
};

/**
 * Download video from D-ID URL
 */
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
  } catch (error) {
    logger.error('Failed to download video from D-ID', { requestId, videoUrl, error: error instanceof Error ? error.message : error });
    throw error;
  }
};

/**
 * Check if D-ID API is properly configured
 */
export const isDIDConfigured = (): boolean => {
  return !!config.DID_API_KEY;
};

/**
 * Get D-ID API configuration status
 */
export const getDIDConfigStatus = () => {
  return {
    apiKeyConfigured: !!config.DID_API_KEY,
    apiKeyLength: config.DID_API_KEY ? config.DID_API_KEY.length : 0,
  };
}; 
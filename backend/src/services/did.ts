import { config } from '../utils/config';
import { logger } from '../utils/logger';

// D-ID API configuration
const DID_API_BASE = 'https://api.d-id.com';

// D-ID API response interfaces
export interface DIDCreateTalkRequest {
  source_url: string;
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
 * Create a new talk video using D-ID API
 */
export const createTalk = async (
  sourceUrl: string,
  scriptText: string,
  presenterId?: string
): Promise<DIDCreateTalkResponse> => {
  const requestId = `did-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    logger.info('Creating D-ID talk', { requestId, sourceUrl, scriptLength: scriptText.length });

    const payload: DIDCreateTalkRequest = {
      source_url: sourceUrl,
      script: {
        type: 'text',
        input: scriptText,
      },
      config: {
        fluent: true,
        pad_audio: 0.5,
        stitch: true,
        result_format: 'mp4',
        quality: 'preview',
      },
    };

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
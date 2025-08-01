import { getSupabaseClient, validateBucket } from '../utils/supabase';
import { logger } from '../utils/logger';

// Storage configuration
const STORAGE_BUCKET = 'test-bucket-ponteai';
const DEFAULT_REQUESTER_ID = 'test_user_id';

export interface StorageMetadata {
  actor: string;
  text: string;
  audio_file_key: string;
  generation_timestamp: string;
  api_response_data: {
    elevenlabs_response?: any;
    openai_response?: any;
  };
  version: number;
  format: string;
}

export interface StorageResult {
  success: boolean;
  fileKey?: string;
  metadataKey?: string;
  error?: string;
  version?: number;
}

export interface FileUploadOptions {
  requesterId?: string;
  voiceActorId: string;
  audioBuffer: ArrayBuffer;
  text: string;
  format?: string;
  apiResponseData?: {
    elevenlabs_response?: any;
    openai_response?: any;
  };
}

/**
 * Generate file path following the specified hierarchy
 * @param requesterId - User ID
 * @param voiceActorId - Voice actor ID
 * @param timestamp - Generation timestamp
 * @param filename - File name
 * @returns File path string
 */
export const generateFilePath = (
  requesterId: string,
  voiceActorId: string,
  timestamp: string,
  filename: string
): string => {
  return `${requesterId}/${voiceActorId}/${timestamp}/${filename}`;
};

/**
 * Generate timestamp string in YYYY-MM-DD_HH:MM:SS format
 * @returns Timestamp string
 */
export const generateTimestamp = (): string => {
  const now = new Date();
  return now.toISOString()
    .replace(/T/, '_')
    .replace(/\..+/, '')
    .replace(/:/g, '-');
};

/**
 * Get next version number for a file
 * @param requesterId - User ID
 * @param voiceActorId - Voice actor ID
 * @param timestamp - Generation timestamp
 * @param baseFilename - Base filename without version
 * @returns Next version number
 */
export const getNextVersion = async (
  requesterId: string,
  voiceActorId: string,
  timestamp: string,
  baseFilename: string
): Promise<number> => {
  try {
    const client = getSupabaseClient();
    const folderPath = `${requesterId}/${voiceActorId}/${timestamp}`;
    
    const { data, error } = await client.storage
      .from(STORAGE_BUCKET)
      .list(folderPath);
    
    if (error) {
      logger.warn('Failed to list files for version detection', { 
        folderPath, 
        error: error.message 
      });
      return 1; // Default to version 1 if listing fails
    }

    // Find existing versions of the file
    const existingVersions = data
      ?.filter(file => file.name?.startsWith(baseFilename))
      .map(file => {
        const match = file.name?.match(new RegExp(`${baseFilename}_v(\\d+)\\.`));
        return match && match[1] ? parseInt(match[1], 10) : 0;
      })
      .filter(version => version > 0) || [];

    return existingVersions.length > 0 ? Math.max(...existingVersions) + 1 : 1;
  } catch (error) {
    logger.error('Error getting next version', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    return 1; // Default to version 1 on error
  }
};

/**
 * Upload audio file to Supabase storage
 * @param options - Upload options
 * @returns Promise<StorageResult>
 */
export const uploadAudioFile = async (options: FileUploadOptions): Promise<StorageResult> => {
  const {
    requesterId = DEFAULT_REQUESTER_ID,
    voiceActorId,
    audioBuffer,
    text,
    format = 'mp3',
    apiResponseData = {}
  } = options;

  try {
    // Validate bucket access
    const bucketValid = await validateBucket(STORAGE_BUCKET);
    if (!bucketValid) {
      return {
        success: false,
        error: 'Storage bucket not accessible'
      };
    }

    const client = getSupabaseClient();
    const timestamp = generateTimestamp();
    const baseFilename = `audio`;
    const version = await getNextVersion(requesterId, voiceActorId, timestamp, baseFilename);
    const filename = `${baseFilename}_v${version}.${format}`;
    const fileKey = generateFilePath(requesterId, voiceActorId, timestamp, filename);

    // Upload audio file
    const { error: uploadError } = await client.storage
      .from(STORAGE_BUCKET)
      .upload(fileKey, audioBuffer, {
        contentType: `audio/${format}`,
        upsert: false
      });

    if (uploadError) {
      logger.error('Audio file upload failed', { 
        fileKey, 
        error: uploadError.message 
      });
      return {
        success: false,
        error: `Failed to upload audio file: ${uploadError.message}`
      };
    }

    // Generate and upload metadata
    const metadata: StorageMetadata = {
      actor: voiceActorId,
      text,
      audio_file_key: fileKey,
      generation_timestamp: new Date().toISOString(),
      api_response_data: apiResponseData,
      version,
      format
    };

    const metadataKey = generateFilePath(requesterId, voiceActorId, timestamp, 'metadata.json');
    const metadataBuffer = Buffer.from(JSON.stringify(metadata, null, 2));

    const { error: metadataError } = await client.storage
      .from(STORAGE_BUCKET)
      .upload(metadataKey, metadataBuffer, {
        contentType: 'application/json',
        upsert: false
      });

    if (metadataError) {
      logger.error('Metadata upload failed', { 
        metadataKey, 
        error: metadataError.message 
      });
      // Note: We don't fail the entire operation if metadata upload fails
      // The audio file is still successfully uploaded
    }

    // Upload text asset
    const textAsset = {
      text,
      actor: voiceActorId,
      generation_timestamp: new Date().toISOString(),
      version
    };

    const textKey = generateFilePath(requesterId, voiceActorId, timestamp, `text_v${version}.json`);
    const textBuffer = Buffer.from(JSON.stringify(textAsset, null, 2));

    const { error: textError } = await client.storage
      .from(STORAGE_BUCKET)
      .upload(textKey, textBuffer, {
        contentType: 'application/json',
        upsert: false
      });

    if (textError) {
      logger.error('Text asset upload failed', { 
        textKey, 
        error: textError.message 
      });
      // Note: We don't fail the entire operation if text upload fails
    }

    logger.info('Audio file uploaded successfully', { 
      fileKey, 
      version, 
      format,
      audioSize: audioBuffer.byteLength 
    });

    return {
      success: true,
      fileKey,
      metadataKey,
      version
    };

  } catch (error) {
    logger.error('Audio file upload failed', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    return {
      success: false,
      error: 'Failed to upload audio file'
    };
  }
};

/**
 * Get public URL for a file
 * @param fileKey - File key in storage
 * @returns Public URL string
 */
export const getPublicUrl = (fileKey: string): string => {
  const client = getSupabaseClient();
  const { data } = client.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(fileKey);
  
  return data.publicUrl;
};

/**
 * List files in a directory
 * @param requesterId - User ID
 * @param voiceActorId - Voice actor ID
 * @param timestamp - Generation timestamp (optional)
 * @returns Promise<Array<string>> - List of file keys
 */
export const listFiles = async (
  requesterId: string,
  voiceActorId: string,
  timestamp?: string
): Promise<string[]> => {
  try {
    const client = getSupabaseClient();
    const folderPath = timestamp 
      ? `${requesterId}/${voiceActorId}/${timestamp}`
      : `${requesterId}/${voiceActorId}`;
    
    const { data, error } = await client.storage
      .from(STORAGE_BUCKET)
      .list(folderPath);
    
    if (error) {
      logger.error('Failed to list files', { 
        folderPath, 
        error: error.message 
      });
      return [];
    }

    return data?.map(file => `${folderPath}/${file.name}`) || [];
  } catch (error) {
    logger.error('Error listing files', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    return [];
  }
}; 
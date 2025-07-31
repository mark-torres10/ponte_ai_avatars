import { createClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger';

// Supabase Configuration
const SUPABASE_CONFIG = {
  url: process.env['SUPABASE_URL'] || '',
  anonKey: process.env['SUPABASE_ANON_KEY'] || '',
  bucketName: 'test-bucket-ponteai', // Public bucket for now
  // TODO: Move to private bucket later for production
};

export interface FileUploadResult {
  success: boolean;
  data?: {
    fileUrl: string;
    filePath: string;
    fileSize: number;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface SessionMetadata {
  requesterId: string;
  avatarId: string;
  timestamp: string;
  sessionId: string;
}

export class SupabaseService {
  private client: any;
  private bucketName: string;

  constructor() {
    if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
      throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY are required in environment variables');
    }

    this.client = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    this.bucketName = SUPABASE_CONFIG.bucketName;
  }

  /**
   * Generate session timestamp in the required format
   * @returns Formatted timestamp string
   */
  generateSessionTimestamp(): string {
    const now = new Date();
    return now.toISOString().replace(/[:.]/g, '-').slice(0, 19); // YYYY-MM-DD_HH-MM-SS
  }

  /**
   * Generate session ID for organizing files
   * @param requesterId - User making the request
   * @param avatarId - Selected avatar ID
   * @returns Session metadata
   */
  generateSessionMetadata(requesterId: string = 'test_user_ID', avatarId: string): SessionMetadata {
    const timestamp = this.generateSessionTimestamp();
    const sessionId = `${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      requesterId,
      avatarId,
      timestamp,
      sessionId
    };
  }

  /**
   * Upload audio file to Supabase storage
   * @param audioData - Base64 audio data or URL
   * @param fileExtension - Audio file extension (mp3, wav, etc.)
   * @param sessionMetadata - Session information
   * @returns Upload result with public URL
   */
  async uploadAudioFile(
    audioData: string, 
    fileExtension: string = 'mp3',
    sessionMetadata: SessionMetadata
  ): Promise<FileUploadResult> {
    try {
      let buffer: Buffer;

      // Check if it's a URL or base64 data
      if (audioData.startsWith('http://') || audioData.startsWith('https://')) {
        // It's a URL - download the audio file
        logger.info('Downloading audio from URL', { 
          url: audioData.substring(0, 50) + '...',
          sessionId: sessionMetadata.sessionId 
        });
        
        const response = await fetch(audioData);
        if (!response.ok) {
          throw new Error(`Failed to fetch audio: ${response.statusText}`);
        }
        
        buffer = Buffer.from(await response.arrayBuffer());
      } else {
        // It's base64 data - convert to buffer
        const base64Data = audioData.replace(/^data:audio\/[^;]+;base64,/, '');
        buffer = Buffer.from(base64Data, 'base64');
      }

      // Generate file path
      const filePath = `${sessionMetadata.requesterId}/${sessionMetadata.avatarId}/${sessionMetadata.timestamp}/audio.${fileExtension}`;

      logger.info('Uploading audio file to Supabase', {
        filePath,
        fileSize: buffer.length,
        sessionId: sessionMetadata.sessionId
      });

      // Upload to Supabase storage
      const { error } = await this.client.storage
        .from(this.bucketName)
        .upload(filePath, buffer, {
          contentType: `audio/${fileExtension}`,
          upsert: false
        });

      if (error) {
        logger.error('Supabase upload error', error);
        return {
          success: false,
          error: {
            code: 'SUPABASE_UPLOAD_ERROR',
            message: error.message
          }
        };
      }

      // Get public URL
      const { data: urlData } = this.client.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      logger.info('Audio file uploaded successfully', {
        filePath,
        publicUrl: urlData.publicUrl,
        sessionId: sessionMetadata.sessionId
      });

      return {
        success: true,
        data: {
          fileUrl: urlData.publicUrl,
          filePath,
          fileSize: buffer.length
        }
      };

    } catch (error) {
      logger.error('Error uploading audio file', error);
      return {
        success: false,
        error: {
          code: 'UPLOAD_ERROR',
          message: error instanceof Error ? error.message : 'Unknown upload error'
        }
      };
    }
  }

  /**
   * Upload image file to Supabase storage
   * @param imageUrl - URL of the image to upload
   * @param fileExtension - Image file extension (jpg, png, etc.)
   * @param sessionMetadata - Session information
   * @returns Upload result with public URL
   */
  async uploadImageFile(
    imageUrl: string,
    fileExtension: string = 'jpg',
    sessionMetadata: SessionMetadata
  ): Promise<FileUploadResult> {
    try {
      // Download image from URL
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      const filePath = `${sessionMetadata.requesterId}/${sessionMetadata.avatarId}/${sessionMetadata.timestamp}/chosen_image.${fileExtension}`;

      logger.info('Uploading image file to Supabase', {
        filePath,
        fileSize: buffer.length,
        sessionId: sessionMetadata.sessionId
      });

      // Upload to Supabase storage
      const { error } = await this.client.storage
        .from(this.bucketName)
        .upload(filePath, buffer, {
          contentType: `image/${fileExtension}`,
          upsert: false
        });

      if (error) {
        logger.error('Supabase image upload error', error);
        return {
          success: false,
          error: {
            code: 'SUPABASE_UPLOAD_ERROR',
            message: error.message
          }
        };
      }

      // Get public URL
      const { data: urlData } = this.client.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      logger.info('Image file uploaded successfully', {
        filePath,
        publicUrl: urlData.publicUrl,
        sessionId: sessionMetadata.sessionId
      });

      return {
        success: true,
        data: {
          fileUrl: urlData.publicUrl,
          filePath,
          fileSize: buffer.length
        }
      };

    } catch (error) {
      logger.error('Error uploading image file', error);
      return {
        success: false,
        error: {
          code: 'UPLOAD_ERROR',
          message: error instanceof Error ? error.message : 'Unknown upload error'
        }
      };
    }
  }

  /**
   * Save session metadata as JSON file
   * @param sessionMetadata - Session information
   * @param additionalData - Any additional data to include
   * @returns Upload result
   */
  async saveSessionMetadata(
    sessionMetadata: SessionMetadata,
    additionalData: any = {}
  ): Promise<FileUploadResult> {
    try {
      const metadata = {
        ...sessionMetadata,
        createdAt: new Date().toISOString(),
        ...additionalData
      };

      const metadataJson = JSON.stringify(metadata, null, 2);
      const buffer = Buffer.from(metadataJson, 'utf-8');
      const filePath = `${sessionMetadata.requesterId}/${sessionMetadata.avatarId}/${sessionMetadata.timestamp}/metadata.json`;

      logger.info('Saving session metadata', {
        filePath,
        sessionId: sessionMetadata.sessionId
      });

      // Upload metadata to Supabase storage
      const { error } = await this.client.storage
        .from(this.bucketName)
        .upload(filePath, buffer, {
          contentType: 'application/json',
          upsert: false
        });

      if (error) {
        logger.error('Supabase metadata upload error', error);
        return {
          success: false,
          error: {
            code: 'SUPABASE_UPLOAD_ERROR',
            message: error.message
          }
        };
      }

      // Get public URL
      const { data: urlData } = this.client.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      logger.info('Session metadata saved successfully', {
        filePath,
        publicUrl: urlData.publicUrl,
        sessionId: sessionMetadata.sessionId
      });

      return {
        success: true,
        data: {
          fileUrl: urlData.publicUrl,
          filePath,
          fileSize: buffer.length
        }
      };

    } catch (error) {
      logger.error('Error saving session metadata', error);
      return {
        success: false,
        error: {
          code: 'METADATA_SAVE_ERROR',
          message: error instanceof Error ? error.message : 'Unknown metadata save error'
        }
      };
    }
  }

  /**
   * Upload generated video file (for future use)
   * @param videoUrl - URL of the generated video
   * @param fileExtension - Video file extension (mp4, webm, etc.)
   * @param sessionMetadata - Session information
   * @returns Upload result with public URL
   */
  async uploadVideoFile(
    videoUrl: string,
    fileExtension: string = 'mp4',
    sessionMetadata: SessionMetadata
  ): Promise<FileUploadResult> {
    try {
      // Download video from URL
      const response = await fetch(videoUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.statusText}`);
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      const filePath = `${sessionMetadata.requesterId}/${sessionMetadata.avatarId}/${sessionMetadata.timestamp}/generated_video.${fileExtension}`;

      logger.info('Uploading video file to Supabase', {
        filePath,
        fileSize: buffer.length,
        sessionId: sessionMetadata.sessionId
      });

      // Upload to Supabase storage
      const { error } = await this.client.storage
        .from(this.bucketName)
        .upload(filePath, buffer, {
          contentType: `video/${fileExtension}`,
          upsert: false
        });

      if (error) {
        logger.error('Supabase video upload error', error);
        return {
          success: false,
          error: {
            code: 'SUPABASE_UPLOAD_ERROR',
            message: error.message
          }
        };
      }

      // Get public URL
      const { data: urlData } = this.client.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      logger.info('Video file uploaded successfully', {
        filePath,
        publicUrl: urlData.publicUrl,
        sessionId: sessionMetadata.sessionId
      });

      return {
        success: true,
        data: {
          fileUrl: urlData.publicUrl,
          filePath,
          fileSize: buffer.length
        }
      };

    } catch (error) {
      logger.error('Error uploading video file', error);
      return {
        success: false,
        error: {
          code: 'UPLOAD_ERROR',
          message: error instanceof Error ? error.message : 'Unknown upload error'
        }
      };
    }
  }
} 
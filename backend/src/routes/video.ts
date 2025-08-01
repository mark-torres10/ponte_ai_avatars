import { Router, Request, Response } from 'express';
import { config } from '../utils/config';
import { logger } from '../utils/logger';
import { 
  createTalk, 
  waitForTalkCompletion, 
  downloadVideo, 
  testDIDConnection,
  isDIDConfigured,
  DIDCreateTalkResponse,
  DIDGetTalkResponse
} from '../services/did';
import { 
  uploadVideoFile, 
  getPublicUrl, 
  generateFilePath, 
  generateTimestamp,
  getNextVersion,
  createPublicImageUrl
} from '../services/storage';

const router = Router();

// Persona image URLs for D-ID - using publicly accessible images
const PERSONA_IMAGES = {
  'terry-crews': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  'will-howard': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
};

// Video generation request interface
interface GenerateVideoRequest {
  text: string;
  personaId: string;
  audioUrl: string;
  avatarImageUrl?: string;
  useCachedAvatar?: boolean;
}

// Video generation response interface
interface GenerateVideoResponse {
  videoUrl: string;
  storageInfo?: {
    fileKey: string;
    metadataKey: string;
    version: number;
  } | undefined;
}

// Video metadata interface (for future use)
// interface VideoMetadata {
//   actor: string;
//   text: string;
//   audio_file_key: string;
//   video_file_key: string;
//   generation_timestamp: string;
//   api_response_data: {
//     did_response?: {
//       talk_id: string;
//       status: string;
//       duration?: number;
//       size?: number;
//     };
//   };
//   version: number;
//   format: string;
// }

router.post('/generate', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const requestId = req.headers['x-request-id'] as string;

  try {
    const { text, personaId, audioUrl, avatarImageUrl, useCachedAvatar = false }: GenerateVideoRequest = req.body;

    // Validate input
    if (!text || typeof text !== 'string') {
      logger.warn('Invalid text input for video generation', { requestId, text });
      return res.status(400).json({
        success: false,
        error: 'Text input is required and must be a string',
        timestamp: new Date().toISOString(),
      });
    }

    if (!personaId || typeof personaId !== 'string') {
      logger.warn('Invalid persona ID for video generation', { requestId, personaId });
      return res.status(400).json({
        success: false,
        error: 'Persona ID is required and must be a string',
        timestamp: new Date().toISOString(),
      });
    }

    if (!audioUrl || typeof audioUrl !== 'string') {
      logger.warn('Invalid audio URL for video generation', { requestId, audioUrl });
      return res.status(400).json({
        success: false,
        error: 'Audio URL is required and must be a string',
        timestamp: new Date().toISOString(),
      });
    }

    // Validate persona exists
    const personaImage = PERSONA_IMAGES[personaId as keyof typeof PERSONA_IMAGES];
    if (!personaImage && !avatarImageUrl) {
      logger.warn('Invalid persona ID provided for video generation', { requestId, personaId });
      return res.status(400).json({
        success: false,
        error: 'Invalid persona ID provided or missing avatar image URL',
        timestamp: new Date().toISOString(),
      });
    }

    // Use provided avatar image URL or fallback to persona image
    const imageSource = avatarImageUrl || personaImage;
    if (!imageSource) {
      logger.warn('No image source available for video generation', { requestId, personaId, avatarImageUrl });
      return res.status(400).json({
        success: false,
        error: 'No avatar image available for video generation',
        timestamp: new Date().toISOString(),
      });
    }

    // Validate that we have a proper URL
    if (!imageSource.startsWith('http')) {
      logger.error('Invalid image URL provided', { requestId, personaId, imageSource });
      return res.status(400).json({
        success: false,
        error: 'Invalid avatar image URL provided - must be a full HTTP URL',
        timestamp: new Date().toISOString(),
      });
    }

    // Check if D-ID API is configured
    if (!isDIDConfigured()) {
      logger.error('D-ID API not configured', { requestId });
      return res.status(500).json({
        success: false,
        error: 'Video generation service not configured',
        timestamp: new Date().toISOString(),
      });
    }

    // Test D-ID API connection before proceeding
    logger.info('Testing D-ID API connection', { requestId });
    const didTest = await testDIDConnection();
    if (!didTest.valid) {
      logger.error('D-ID API connection test failed', { requestId, error: didTest.error });
      return res.status(500).json({
        success: false,
        error: `D-ID API connection failed: ${didTest.error}`,
        timestamp: new Date().toISOString(),
      });
    }
    logger.info('D-ID API connection test successful', { requestId, accountStatus: didTest.accountStatus });

    logger.info('Starting video generation', { 
      requestId, 
      personaId, 
      textLength: text.length,
      avatarImageUrl,
      imageSource,
      useCachedAvatar 
    });

    let videoUrl: string;
    let storageInfo: { fileKey: string; metadataKey: string; version: number } | undefined;

    if (useCachedAvatar) {
      // Use cached avatar mode - return a placeholder video URL for testing
      logger.info('Using cached avatar mode', { requestId });
      videoUrl = 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'; // Placeholder
    } else {
      // Generate video using D-ID API
      try {
        // Create a fresh signed URL for the selected image
        logger.info('Creating fresh signed URL for avatar image', { requestId, personaId });
        
        // Determine the image path based on persona and selected image
        let imagePath: string;
        if (avatarImageUrl && avatarImageUrl.includes('pic')) {
          // Extract the image number from the URL (e.g., pic1.jpeg, pic2.jpeg, etc.)
          const match = avatarImageUrl.match(/pic(\d+)\.jpeg/);
          if (match) {
            const imageNumber = match[1];
            const folder = personaId === 'terry-crews' ? 'voice_actor_a' : 'voice_actor_b';
            imagePath = `avatar_assets/${folder}/static/pic${imageNumber}.jpeg`;
          } else {
            throw new Error('Could not determine image path from URL');
          }
        } else {
          // Fallback to first image if no specific image selected
          const folder = personaId === 'terry-crews' ? 'voice_actor_a' : 'voice_actor_b';
          imagePath = `avatar_assets/${folder}/static/pic1.jpeg`;
        }
        
        logger.info('Creating signed URL for image path', { requestId, imagePath });
        
        // Create a fresh signed URL with longer expiry for D-ID processing
        const publicImageUrl = await createPublicImageUrl(
          imagePath, 
          'ponteai-assets', // Use production bucket
          7200 // 2 hours expiry for D-ID processing
        );
        
        logger.info('Successfully created public image URL for D-ID', { 
          requestId, 
          imagePath, 
          publicUrl: publicImageUrl.substring(0, 50) + '...' 
        });
        
        // Create D-ID talk using the public image URL directly
        const talkResponse: DIDCreateTalkResponse = await createTalk(
          text,
          publicImageUrl, // Use the public signed URL directly
          undefined, // No image ID since we're using URL
          undefined // presenter ID
        );

        logger.info('D-ID talk created', { requestId, talkId: talkResponse.id });

        // Wait for talk completion
        const completedTalk: DIDGetTalkResponse = await waitForTalkCompletion(talkResponse.id);

        if (!completedTalk.result?.video_url) {
          throw new Error('No video URL in completed talk response');
        }

        videoUrl = completedTalk.result.video_url;

        // Download video and store in Supabase
        const videoBuffer = await downloadVideo(videoUrl);
        
        // Generate storage paths
        const timestamp = generateTimestamp();
        const requesterId = config.DEFAULT_REQUESTER_ID;
        const baseFilename = 'video';
        const version = await getNextVersion(requesterId, personaId, timestamp, baseFilename);
        
        const videoFileKey = generateFilePath(requesterId, personaId, timestamp, `video_v${version}.mp4`);
        const metadataKey = generateFilePath(requesterId, personaId, timestamp, 'video_metadata.json');

        // Upload video file
        const videoUploadResult = await uploadVideoFile({
          requesterId,
          voiceActorId: personaId,
          videoBuffer,
          text,
          format: 'mp4',
          version,
          apiResponseData: {
            did_response: {
              talk_id: talkResponse.id,
              status: completedTalk.status,
              ...(completedTalk.result?.duration && { duration: completedTalk.result.duration }),
              ...(completedTalk.result?.size && { size: completedTalk.result.size }),
            }
          }
        });

        if (videoUploadResult.success) {
          storageInfo = {
            fileKey: videoFileKey,
            metadataKey: metadataKey,
            version: version
          };
          
          // Update video URL to use Supabase URL
          videoUrl = getPublicUrl(videoFileKey);
          
          logger.info('Video stored successfully', { 
            requestId, 
            fileKey: videoFileKey, 
            version 
          });
        } else {
          logger.warn('Failed to store video, using original URL', { 
            requestId, 
            error: videoUploadResult.error 
          });
        }

      } catch (error) {
        logger.error('D-ID video generation failed', { requestId, error: error instanceof Error ? error.message : error });
        return res.status(500).json({
          success: false,
          error: 'Video generation failed at D-ID',
          timestamp: new Date().toISOString(),
        });
      }
    }

    const response: GenerateVideoResponse = {
      videoUrl,
      storageInfo: storageInfo || undefined
    };

    const duration = Date.now() - startTime;
    logger.info('Video generation completed', { 
      requestId, 
      duration, 
      videoUrl: response.videoUrl 
    });

    return res.json({
      success: true,
      data: response,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('Video generation error', { 
      requestId, 
      duration, 
      error: error instanceof Error ? error.message : error 
    });

    return res.status(500).json({
      success: false,
      error: 'Internal server error during video generation',
      timestamp: new Date().toISOString(),
    });
  }
});

// Health check endpoint for video service
router.get('/health', (_req: Request, res: Response) => {
  const didConfig = isDIDConfigured();
  
  return res.json({
    success: true,
    data: {
      service: 'video-generation',
      status: 'healthy',
      did_configured: didConfig,
      timestamp: new Date().toISOString(),
    },
    timestamp: new Date().toISOString(),
  });
});

export default router; 
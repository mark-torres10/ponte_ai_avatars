import { Router, Request, Response } from 'express';
import { config } from '../utils/config';
import { logger } from '../utils/logger';
import { 
  createTalk, 
  waitForTalkCompletion, 
  downloadVideo, 
  isDIDConfigured,
  DIDCreateTalkResponse,
  DIDGetTalkResponse 
} from '../services/did';
import { 
  uploadVideoFile, 
  getPublicUrl, 
  generateFilePath, 
  generateTimestamp,
  getNextVersion 
} from '../services/storage';

const router = Router();

// Persona image URLs for D-ID
const PERSONA_IMAGES = {
  'terry-crews': 'https://public.ponteai.com/voice_actor_a/pic1.jpeg',
  'will-howard': 'https://public.ponteai.com/voice_actor_b/pic1.jpeg',
};

// Video generation request interface
interface GenerateVideoRequest {
  text: string;
  personaId: string;
  audioUrl: string;
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
    const { text, personaId, audioUrl, useCachedAvatar = false }: GenerateVideoRequest = req.body;

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
    if (!personaImage) {
      logger.warn('Invalid persona ID provided for video generation', { requestId, personaId });
      return res.status(400).json({
        success: false,
        error: 'Invalid persona ID provided',
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

    logger.info('Starting video generation', { 
      requestId, 
      personaId, 
      textLength: text.length,
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
        // Create D-ID talk
        const talkResponse: DIDCreateTalkResponse = await createTalk(
          personaImage,
          text
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
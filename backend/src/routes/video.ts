import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger';
import { DIDService } from '../services/didService';
import { SupabaseService } from '../services/supabaseService';
import { 
  GenerateVideoRequest, 
  GenerateVideoResponse
} from '../types/video';

const router = Router();

// Initialize D-ID Service
let didService: DIDService;
try {
  didService = new DIDService();
  logger.info('D-ID Service initialized successfully');
} catch (error) {
  logger.error('Failed to initialize D-ID Service:', error instanceof Error ? error.message : 'Unknown error');
  logger.error('Make sure DID_API_KEY is set in your environment variables');
}

// Initialize Supabase Service
let supabaseService: SupabaseService;
try {
  supabaseService = new SupabaseService();
  logger.info('Supabase Service initialized successfully');
} catch (error) {
  logger.error('Failed to initialize Supabase Service:', error instanceof Error ? error.message : 'Unknown error');
  logger.error('Make sure SUPABASE_URL and SUPABASE_ANON_KEY are set in your environment variables');
}

// Persona image mappings - maps persona IDs to their image URLs
// TODO: These will eventually be fetched from Supabase database
const PERSONA_IMAGES = {
  'terry-crews': [
    'https://ponte-ai-avatars.vercel.app/voice_actor_a/pic1.jpeg',
    'https://ponte-ai-avatars.vercel.app/voice_actor_a/pic2.jpeg',
    'https://ponte-ai-avatars.vercel.app/voice_actor_a/pic3.jpeg',
    'https://ponte-ai-avatars.vercel.app/voice_actor_a/pic4.jpeg',
    'https://ponte-ai-avatars.vercel.app/voice_actor_a/pic5.jpeg',
  ],
  'will-howard': [
    'https://ponte-ai-avatars.vercel.app/voice_actor_b/pic1.jpeg',
    'https://ponte-ai-avatars.vercel.app/voice_actor_b/pic2.jpeg',
    'https://ponte-ai-avatars.vercel.app/voice_actor_b/pic3.jpeg',
    'https://ponte-ai-avatars.vercel.app/voice_actor_b/pic4.jpeg',
    'https://ponte-ai-avatars.vercel.app/voice_actor_b/pic5.jpeg',
  ],
};



router.post('/generate', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const requestId = req.headers['x-request-id'] as string;

  try {
    const { audioUrl, personaId, imageIndex = 0, videoFormat = 'mp4', quality = 'medium' }: GenerateVideoRequest = req.body;

    // Enhanced input validation with detailed error messages
    if (!audioUrl || typeof audioUrl !== 'string') {
      logger.warn('Invalid audio URL for video generation', { requestId, audioUrl });
      return res.status(400).json({
        success: false,
        error: 'Audio URL is required and must be a string',
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

    // Validate persona exists
    const personaImages = PERSONA_IMAGES[personaId as keyof typeof PERSONA_IMAGES];
    if (!personaImages) {
      logger.warn('Invalid persona ID provided for video generation', { requestId, personaId });
      return res.status(400).json({
        success: false,
        error: 'Invalid persona ID provided',
        timestamp: new Date().toISOString(),
      });
    }

    // Validate image index
    if (imageIndex < 0 || imageIndex >= personaImages.length) {
      logger.warn('Invalid image index for video generation', { requestId, imageIndex, personaId });
      return res.status(400).json({
        success: false,
        error: `Image index must be between 0 and ${personaImages.length - 1}`,
        timestamp: new Date().toISOString(),
      });
    }

    // Check if D-ID service is available
    if (!didService) {
      logger.error('D-ID service not available - check DID_API_KEY environment variable', { requestId });
      return res.status(500).json({
        success: false,
        error: 'Video generation service not configured. Please check DID_API_KEY environment variable.',
        timestamp: new Date().toISOString(),
      });
    }

    // Check if Supabase service is available
    if (!supabaseService) {
      logger.error('Supabase service not available - check SUPABASE_URL and SUPABASE_ANON_KEY environment variables', { requestId });
      return res.status(500).json({
        success: false,
        error: 'File storage service not configured. Please check SUPABASE_URL and SUPABASE_ANON_KEY environment variables.',
        timestamp: new Date().toISOString(),
      });
    }

    const selectedImageUrl = personaImages[imageIndex];

    // Validate that we have a valid image URL
    if (!selectedImageUrl) {
      logger.error('No image URL found for persona', { requestId, personaId, imageIndex });
      return res.status(400).json({
        success: false,
        error: 'Invalid persona image selection',
        timestamp: new Date().toISOString(),
      });
    }

    // Generate session metadata for file organization
    const sessionMetadata = supabaseService.generateSessionMetadata('test_user_ID', personaId);

    logger.info('Starting video generation process', { 
      requestId, 
      personaId, 
      imageIndex,
      imageUrl: selectedImageUrl,
      audioUrl: audioUrl.substring(0, 50) + '...',
      sessionId: sessionMetadata.sessionId,
      videoFormat,
      quality
    });

    // Step 1: Upload audio file to Supabase storage
    logger.info('Uploading audio file to Supabase', { requestId, sessionId: sessionMetadata.sessionId });
    const audioUploadResult = await supabaseService.uploadAudioFile(
      audioUrl,
      'mp3', // Default to mp3 for now
      sessionMetadata
    );

    if (!audioUploadResult.success) {
      logger.error('Audio upload failed', { 
        requestId, 
        error: audioUploadResult.error,
        sessionId: sessionMetadata.sessionId
      });
      return res.status(500).json({
        success: false,
        error: `Failed to upload audio file: ${audioUploadResult.error?.message || 'Unknown error'}`,
        timestamp: new Date().toISOString(),
      });
    }

    // Step 2: Upload selected image to Supabase storage
    logger.info('Uploading image file to Supabase', { requestId, sessionId: sessionMetadata.sessionId });
    const imageUploadResult = await supabaseService.uploadImageFile(
      selectedImageUrl,
      'jpg', // Default to jpg for now
      sessionMetadata
    );

    if (!imageUploadResult.success) {
      logger.error('Image upload failed', { 
        requestId, 
        error: imageUploadResult.error,
        sessionId: sessionMetadata.sessionId
      });
      return res.status(500).json({
        success: false,
        error: `Failed to upload image file: ${imageUploadResult.error?.message || 'Unknown error'}`,
        timestamp: new Date().toISOString(),
      });
    }

    // Step 3: Save session metadata
    logger.info('Saving session metadata', { requestId, sessionId: sessionMetadata.sessionId });
    const metadataResult = await supabaseService.saveSessionMetadata(sessionMetadata, {
      audioUrl: audioUploadResult.data?.fileUrl,
      imageUrl: imageUploadResult.data?.fileUrl,
      videoFormat,
      quality,
      imageIndex
    });

    if (!metadataResult.success) {
      logger.warn('Metadata save failed, continuing with video generation', { 
        requestId, 
        error: metadataResult.error,
        sessionId: sessionMetadata.sessionId
      });
    }

    logger.info('Files uploaded successfully, generating video with D-ID', { 
      requestId, 
      audioFileUrl: audioUploadResult.data?.fileUrl,
      imageFileUrl: imageUploadResult.data?.fileUrl,
      sessionId: sessionMetadata.sessionId
    });

    // Step 4: Generate video using D-ID service with uploaded files
    const result = await didService.generateVideo({
      audioUrl: audioUploadResult.data?.fileUrl || '',
      presenterId: imageUploadResult.data?.fileUrl || undefined,
    });

    if (result.success && result.data) {
      logger.info('Video generation successful', { 
        requestId,
        taskId: result.data.taskId, 
        duration: result.data.duration, 
        videoUrl: result.data.videoUrl 
      });

      const response: GenerateVideoResponse = {
        success: true,
        data: {
          videoUrl: result.data.videoUrl || '',
          videoId: result.data.taskId,
          status: 'completed',
          progress: 100,
          estimatedTimeRemaining: 0,
          personaId,
          audioUrl: audioUploadResult.data?.fileUrl || '',
          imageUrl: imageUploadResult.data?.fileUrl || '',
        },
        timestamp: new Date().toISOString(),
      };

      // Log successful video generation with session info
      logger.info('Video generation completed successfully', { 
        requestId,
        taskId: result.data.taskId, 
        duration: result.data.duration, 
        videoUrl: result.data.videoUrl,
        sessionId: sessionMetadata.sessionId,
        audioFileUrl: audioUploadResult.data?.fileUrl,
        imageFileUrl: imageUploadResult.data?.fileUrl
      });

      res.json(response);
      return;
    } else {
      logger.error('Video generation failed', { 
        requestId, 
        error: result.error 
      });

      const statusCode = result.error?.code?.includes('401') ? 401 : 
                        result.error?.code?.includes('402') ? 402 : 
                        result.error?.code?.includes('429') ? 429 : 500;

      res.status(statusCode).json({
        success: false,
        error: result.error?.message || 'Video generation failed',
        timestamp: new Date().toISOString(),
      });
      return;
    }

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('Video generation failed', { 
      requestId, 
      error: error instanceof Error ? error.message : 'Unknown error',
      duration 
    });

    res.status(500).json({
      success: false,
      error: 'Video generation failed. Please try again.',
      timestamp: new Date().toISOString(),
    });
    return;
  }
});



export default router; 
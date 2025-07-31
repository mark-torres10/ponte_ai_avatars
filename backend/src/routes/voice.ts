import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger';
import { VoiceService } from '../services/voiceService';
import { GenerateVoiceRequest, GenerateVoiceResponse } from '../types/voice';

const router = Router();

// Initialize Voice Service
let voiceService: VoiceService;
try {
  voiceService = new VoiceService();
  logger.info('Voice Service initialized successfully');
} catch (error) {
  logger.error('Failed to initialize Voice Service:', error instanceof Error ? error.message : 'Unknown error');
  logger.error('Make sure ELEVENLABS_API_KEY is set in your environment variables');
}

router.post('/generate', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const requestId = req.headers['x-request-id'] as string;

  try {
    const { text, personaId }: GenerateVoiceRequest = req.body;

    // Validate input
    if (!text || typeof text !== 'string') {
      logger.warn('Invalid text input for voice generation', { requestId, text });
      return res.status(400).json({
        success: false,
        error: 'Text input is required and must be a string',
        timestamp: new Date().toISOString(),
      });
    }

    if (!personaId || typeof personaId !== 'string') {
      logger.warn('Invalid persona ID for voice generation', { requestId, personaId });
      return res.status(400).json({
        success: false,
        error: 'Persona ID is required and must be a string',
        timestamp: new Date().toISOString(),
      });
    }

    // Check if Voice service is available
    if (!voiceService) {
      logger.error('Voice service not available - check ELEVENLABS_API_KEY environment variable', { requestId });
      return res.status(500).json({
        success: false,
        error: 'Voice generation service not configured. Please check ELEVENLABS_API_KEY environment variable.',
        timestamp: new Date().toISOString(),
      });
    }

    // Validate persona exists and has voice configured
    if (!voiceService.isVoiceConfigured(personaId)) {
      logger.warn('Invalid persona ID or voice not configured for voice generation', { requestId, personaId });
      return res.status(400).json({
        success: false,
        error: 'Invalid persona ID or voice not configured for this persona',
        timestamp: new Date().toISOString(),
      });
    }

    // Check text length limit (ElevenLabs has limits)
    if (text.length > 5000) {
      logger.warn('Text too long for voice generation', { requestId, textLength: text.length });
      return res.status(400).json({
        success: false,
        error: 'Text must be 5000 characters or less for voice generation',
        timestamp: new Date().toISOString(),
      });
    }

    // Get voice ID for persona
    const voiceId = voiceService.getVoiceIdForPersona(personaId);
    if (!voiceId) {
      logger.error('Voice ID not found for persona', { requestId, personaId });
      return res.status(500).json({
        success: false,
        error: 'Voice configuration error for this persona',
        timestamp: new Date().toISOString(),
      });
    }

    logger.info('Generating voice with ElevenLabs', { 
      requestId, 
      personaId, 
      voiceId,
      textLength: text.length 
    });

    // Generate voice using VoiceService
    const result = await voiceService.generateVoice({
      text,
      voiceId,
      stability: 0.5,
      similarityBoost: 0.75,
      style: 0.0,
      useSpeakerBoost: true
    });

    if (result.success && result.data) {
      const response: GenerateVoiceResponse = {
        success: true,
        data: {
          audioUrl: result.data.audioUrl,
          audioData: result.data.audioData,
          personaId,
          text,
        },
        timestamp: new Date().toISOString(),
      };

      const duration = Date.now() - startTime;
      logger.info('Voice generation completed successfully', { 
        requestId, 
        personaId, 
        voiceId,
        duration,
        textLength: text.length,
        audioSize: result.data.audioData?.length || 0
      });

      res.json(response);
      return;
    } else {
      logger.error('Voice generation failed', { 
        requestId, 
        error: result.error 
      });

      const statusCode = result.error?.code?.includes('401') ? 401 : 
                        result.error?.code?.includes('402') ? 402 : 
                        result.error?.code?.includes('429') ? 429 : 500;

      res.status(statusCode).json({
        success: false,
        error: result.error?.message || 'Voice generation failed',
        timestamp: new Date().toISOString(),
      });
      return;
    }

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('Voice generation failed', { 
      requestId, 
      error: error instanceof Error ? error.message : 'Unknown error',
      duration 
    });

    res.status(500).json({
      success: false,
      error: 'Voice generation failed. Please try again.',
      timestamp: new Date().toISOString(),
    });
    return;
  }
});

// Get available voices endpoint
router.get('/voices', async (req: Request, res: Response) => {
  try {
    if (!voiceService) {
      return res.status(500).json({
        success: false,
        error: 'Voice service not available',
        timestamp: new Date().toISOString(),
      });
    }

    const voices = await voiceService.getVoices();
    const configuredPersonas = voiceService.getConfiguredPersonas();

    res.json({
      success: true,
      data: {
        voices,
        configuredPersonas,
        availableVoices: voiceService.getAvailableVoices()
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Failed to get voices', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch available voices',
      timestamp: new Date().toISOString(),
    });
  }
});

// Get voice info for a specific persona
router.get('/voices/:personaId', async (req: Request, res: Response) => {
  try {
    const { personaId } = req.params;

    if (!voiceService) {
      return res.status(500).json({
        success: false,
        error: 'Voice service not available',
        timestamp: new Date().toISOString(),
      });
    }

    const voiceId = voiceService.getVoiceIdForPersona(personaId);
    if (!voiceId) {
      return res.status(404).json({
        success: false,
        error: 'Voice not configured for this persona',
        timestamp: new Date().toISOString(),
      });
    }

    const voiceInfo = await voiceService.getVoice(voiceId);
    res.json({
      success: true,
      data: {
        personaId,
        voiceId,
        voiceInfo
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Failed to get voice info', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch voice information',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router; 
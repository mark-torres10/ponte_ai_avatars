import { Router, Request, Response } from 'express';
import { config } from '../utils/config';
import { logger } from '../utils/logger';

const router = Router();

interface GenerateVoiceRequest {
  text: string;
  personaId: string;
}

interface GenerateVoiceResponse {
  success: boolean;
  data?: {
    audioUrl: string;
    audioData?: string; // Base64 encoded audio for immediate playback
    personaId: string;
    text: string;
  };
  error?: string;
  timestamp: string;
}

// ElevenLabs voice IDs for each persona
const PERSONA_VOICE_IDS = {
  'terry-crews': 'pNInz6obpgDQGcFmaJgB', // Terry Crews voice ID
  'will-howard': 'VR6AewLTigWG4xSOukaG', // Will Howard voice ID
};

// ElevenLabs API configuration
const ELEVENLABS_API_BASE = 'https://api.elevenlabs.io/v1';

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

    // Validate persona exists
    const voiceId = PERSONA_VOICE_IDS[personaId as keyof typeof PERSONA_VOICE_IDS];
    if (!voiceId) {
      logger.warn('Invalid persona ID provided for voice generation', { requestId, personaId });
      return res.status(400).json({
        success: false,
        error: 'Invalid persona ID provided',
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

    // Check if ElevenLabs API key is configured
    if (!config.ELEVENLABS_API_KEY) {
      logger.error('ElevenLabs API key not configured', { requestId });
      return res.status(500).json({
        success: false,
        error: 'Voice generation service not configured',
        timestamp: new Date().toISOString(),
      });
    }

    logger.info('Generating voice with ElevenLabs', { 
      requestId, 
      personaId, 
      voiceId,
      textLength: text.length 
    });

    // Call ElevenLabs API
    const elevenLabsResponse = await fetch(`${ELEVENLABS_API_BASE}/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': config.ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    });

    if (!elevenLabsResponse.ok) {
      const errorText = await elevenLabsResponse.text();
      logger.error('ElevenLabs API error', { 
        requestId, 
        status: elevenLabsResponse.status,
        error: errorText 
      });

      if (elevenLabsResponse.status === 401) {
        return res.status(500).json({
          success: false,
          error: 'Voice generation service authentication failed',
          timestamp: new Date().toISOString(),
        });
      }

      if (elevenLabsResponse.status === 429) {
        return res.status(429).json({
          success: false,
          error: 'Voice generation rate limit exceeded. Please try again later.',
          timestamp: new Date().toISOString(),
        });
      }

      return res.status(500).json({
        success: false,
        error: 'Voice generation failed at ElevenLabs',
        timestamp: new Date().toISOString(),
      });
    }

    // Get audio data
    const audioBuffer = await elevenLabsResponse.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');

    const response: GenerateVoiceResponse = {
      success: true,
      data: {
        audioUrl: `data:audio/mpeg;base64,${audioBase64}`,
        audioData: audioBase64,
        personaId,
        text,
      },
      timestamp: new Date().toISOString(),
    };

    const duration = Date.now() - startTime;
    logger.info('Voice generation completed', { 
      requestId, 
      personaId, 
      duration,
      textLength: text.length,
      audioSize: audioBuffer.byteLength
    });

    res.json(response);
    return;

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

export default router; 
import { Router, Request, Response } from 'express';
import OpenAI from 'openai';
import { config } from '../utils/config';
import { logger } from '../utils/logger';

const router = Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});

interface PersonalizeTextRequest {
  text: string;
  personaId: string;
}

interface PersonalizeTextResponse {
  success: boolean;
  data?: {
    originalText: string;
    personalizedText: string;
    personaId: string;
  };
  error?: string;
  timestamp: string;
}

// Persona prompts for text personalization
const PERSONA_PROMPTS = {
  'terry-crews': {
    name: 'Terry Crews',
    style: 'energetic, enthusiastic, motivational, and charismatic with a strong, confident voice. Uses phrases like "Listen up!", "You got this!", and "Let\'s do this!". Maintains a positive, encouraging tone.',
  },
  'will-howard': {
    name: 'Will Howard',
    style: 'professional, articulate, and authoritative with a calm, measured tone. Uses clear, concise language and maintains a confident, leadership-focused approach.',
  },
};

router.post('/personalize', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const requestId = req.headers['x-request-id'] as string;

  try {
    const { text, personaId }: PersonalizeTextRequest = req.body;

    // Validate input
    if (!text || typeof text !== 'string') {
      logger.warn('Invalid text input', { requestId, text });
      return res.status(400).json({
        success: false,
        error: 'Text input is required and must be a string',
        timestamp: new Date().toISOString(),
      });
    }

    if (!personaId || typeof personaId !== 'string') {
      logger.warn('Invalid persona ID', { requestId, personaId });
      return res.status(400).json({
        success: false,
        error: 'Persona ID is required and must be a string',
        timestamp: new Date().toISOString(),
      });
    }

    // Validate persona exists
    const persona = PERSONA_PROMPTS[personaId as keyof typeof PERSONA_PROMPTS];
    if (!persona) {
      logger.warn('Invalid persona ID provided', { requestId, personaId });
      return res.status(400).json({
        success: false,
        error: 'Invalid persona ID provided',
        timestamp: new Date().toISOString(),
      });
    }

    // Check text length limit
    if (text.length > 1000) {
      logger.warn('Text too long', { requestId, textLength: text.length });
      return res.status(400).json({
        success: false,
        error: 'Text must be 1000 characters or less',
        timestamp: new Date().toISOString(),
      });
    }

    logger.info('Personalizing text with OpenAI', { 
      requestId, 
      personaId, 
      textLength: text.length 
    });

    // Create OpenAI prompt
    const prompt = `You are ${persona.name}. Rewrite the following text in your unique style: ${persona.style}

Original text: "${text}"

Please rewrite this text in your voice and style, maintaining the core message but adapting it to your personality. Keep it concise and engaging.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are ${persona.name}. You speak in a ${persona.style}`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const personalizedText = completion.choices[0]?.message?.content?.trim();

    if (!personalizedText) {
      throw new Error('No response received from OpenAI');
    }

    const response: PersonalizeTextResponse = {
      success: true,
      data: {
        originalText: text,
        personalizedText,
        personaId,
      },
      timestamp: new Date().toISOString(),
    };

    const duration = Date.now() - startTime;
    logger.info('Text personalization completed', { 
      requestId, 
      personaId, 
      duration,
      originalLength: text.length,
      personalizedLength: personalizedText.length
    });

    res.json(response);
    return;

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('Text personalization failed', { 
      requestId, 
      error: error instanceof Error ? error.message : 'Unknown error',
      duration 
    });

    // Handle OpenAI-specific errors
    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        return res.status(500).json({
          success: false,
          error: 'OpenAI API key is invalid or expired',
          timestamp: new Date().toISOString(),
        });
      }
      if (error.status === 429) {
        return res.status(429).json({
          success: false,
          error: 'OpenAI API rate limit exceeded. Please try again later.',
          timestamp: new Date().toISOString(),
        });
      }
    }

    res.status(500).json({
      success: false,
      error: 'Failed to personalize text. Please try again.',
      timestamp: new Date().toISOString(),
    });
    return;
  }
});

export default router; 
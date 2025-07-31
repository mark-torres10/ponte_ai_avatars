import request from 'supertest';
import app from '../app';

// Mock ElevenLabs API responses
const mockElevenLabsSuccess = {
  ok: true,
  arrayBuffer: () => Promise.resolve(new ArrayBuffer(1024)), // Mock audio data
};

const mockElevenLabsError = {
  ok: false,
  status: 500,
  text: () => Promise.resolve('Internal server error'),
};

// Mock fetch globally
global.fetch = jest.fn();

describe('Voice Generation API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/voice/generate', () => {
    const validRequest = {
      text: 'Hello, this is a test message for voice generation.',
      personaId: 'terry-crews',
    };

    it('should generate voice successfully with valid request', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(mockElevenLabsSuccess);

      const response = await request(app)
        .post('/api/voice/generate')
        .send(validRequest)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.audioUrl).toContain('data:audio/mpeg;base64,');
      expect(response.body.data.personaId).toBe('terry-crews');
      expect(response.body.data.text).toBe(validRequest.text);
      expect(response.body.timestamp).toBeDefined();
    });

    it('should work with different personas', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(mockElevenLabsSuccess);

      const willHowardRequest = {
        text: 'This is Will Howard speaking.',
        personaId: 'will-howard',
      };

      const response = await request(app)
        .post('/api/voice/generate')
        .send(willHowardRequest)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.personaId).toBe('will-howard');
    });

    it('should handle missing text input', async () => {
      const invalidRequest = {
        personaId: 'terry-crews',
      };

      const response = await request(app)
        .post('/api/voice/generate')
        .send(invalidRequest)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Text input is required and must be a string');
    });

    it('should handle missing persona ID', async () => {
      const invalidRequest = {
        text: 'Test message',
      };

      const response = await request(app)
        .post('/api/voice/generate')
        .send(invalidRequest)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Persona ID is required and must be a string');
    });

    it('should handle invalid persona ID', async () => {
      const invalidRequest = {
        text: 'Test message',
        personaId: 'invalid-persona',
      };

      const response = await request(app)
        .post('/api/voice/generate')
        .send(invalidRequest)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid persona ID provided');
    });

    it('should handle text that is too long', async () => {
      const longText = 'A'.repeat(5001); // Exceeds 5000 character limit
      const invalidRequest = {
        text: longText,
        personaId: 'terry-crews',
      };

      const response = await request(app)
        .post('/api/voice/generate')
        .send(invalidRequest)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Text must be 5000 characters or less for voice generation');
    });

    it('should handle ElevenLabs API authentication failure', async () => {
      const authError = {
        ok: false,
        status: 401,
        text: () => Promise.resolve('Unauthorized'),
      };
      (global.fetch as jest.Mock).mockResolvedValue(authError);

      const response = await request(app)
        .post('/api/voice/generate')
        .send(validRequest)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Voice generation service authentication failed');
    });

    it('should handle ElevenLabs API rate limiting', async () => {
      const rateLimitError = {
        ok: false,
        status: 429,
        text: () => Promise.resolve('Rate limit exceeded'),
      };
      (global.fetch as jest.Mock).mockResolvedValue(rateLimitError);

      const response = await request(app)
        .post('/api/voice/generate')
        .send(validRequest)
        .expect(429);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Voice generation rate limit exceeded. Please try again later.');
    });

    it('should handle ElevenLabs API general failure', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(mockElevenLabsError);

      const response = await request(app)
        .post('/api/voice/generate')
        .send(validRequest)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Voice generation failed at ElevenLabs');
    });

    it('should handle network errors gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const response = await request(app)
        .post('/api/voice/generate')
        .send(validRequest)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Voice generation failed. Please try again.');
    });

    it('should handle non-string text input', async () => {
      const invalidRequest = {
        text: 123, // Number instead of string
        personaId: 'terry-crews',
      };

      const response = await request(app)
        .post('/api/voice/generate')
        .send(invalidRequest)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Text input is required and must be a string');
    });

    it('should handle non-string persona ID', async () => {
      const invalidRequest = {
        text: 'Test message',
        personaId: 123, // Number instead of string
      };

      const response = await request(app)
        .post('/api/voice/generate')
        .send(invalidRequest)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Persona ID is required and must be a string');
    });

    it('should handle empty text input', async () => {
      const invalidRequest = {
        text: '',
        personaId: 'terry-crews',
      };

      const response = await request(app)
        .post('/api/voice/generate')
        .send(invalidRequest)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Text input is required and must be a string');
    });

    it('should handle empty persona ID', async () => {
      const invalidRequest = {
        text: 'Test message',
        personaId: '',
      };

      const response = await request(app)
        .post('/api/voice/generate')
        .send(invalidRequest)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Persona ID is required and must be a string');
    });
  });
}); 
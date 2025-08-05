import { config, isDevelopment, isProduction, isTest } from '../utils/config';

describe('Configuration', () => {
  describe('Environment Variables', () => {
    it('should load configuration correctly', () => {
      expect(config.NODE_ENV).toBe('test');
      expect(typeof config.PORT).toBe('number');
      expect(config.PORT).toBeGreaterThan(0);
      expect(config.PORT).toBeLessThan(65536);
      expect(config.CORS_ORIGIN).toBe('http://localhost:3000');
      expect(config.LOG_LEVEL).toBe('error');
    });

    it('should have correct environment flags', () => {
      expect(isTest).toBe(true);
      expect(isDevelopment).toBe(false);
      expect(isProduction).toBe(false);
    });

    it('should have rate limiting configuration', () => {
      expect(config.RATE_LIMIT_WINDOW_MS).toBe(900000);
      expect(config.RATE_LIMIT_MAX_REQUESTS).toBe(100);
    });

    it('should handle optional API keys', () => {
      // These are set to placeholder values in the .env file
      expect(config.OPENAI_API_KEY).toBeTruthy();
      expect(config.ELEVENLABS_API_KEY).toBeTruthy();
      expect(config.DID_API_KEY).toBeTruthy();
    });

    it('should have required configuration values', () => {
      expect(config.SUPABASE_URL).toBeTruthy();
      expect(config.STORAGE_BUCKET).toBeTruthy();
      expect(config.DEFAULT_REQUESTER_ID).toBeTruthy();
    });
  });
}); 
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
  });

  describe('Configuration Validation', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should use default values for optional configuration', () => {
      // Clear module cache to ensure fresh config
      jest.resetModules();
      
      // Ensure we're in test environment
      process.env['NODE_ENV'] = 'test';
      delete process.env['RATE_LIMIT_WINDOW_MS'];
      delete process.env['RATE_LIMIT_MAX_REQUESTS'];
      delete process.env['LOG_LEVEL'];

      // Import the config module fresh
      const configModule = require('../utils/config');
      
      expect(configModule.config.RATE_LIMIT_WINDOW_MS).toBe(900000);
      expect(configModule.config.RATE_LIMIT_MAX_REQUESTS).toBe(100);
      expect(configModule.config.LOG_LEVEL).toBe('error'); // In test environment, defaults to error
    });

    it('should handle test environment configuration', () => {
      // Set NODE_ENV to test to trigger test configuration
      process.env['NODE_ENV'] = 'test';
      
      const { config: testConfig } = jest.requireActual('../utils/config');
      
      expect(testConfig.NODE_ENV).toBe('test');
      expect(testConfig.OPENAI_API_KEY).toBeTruthy();
      expect(testConfig.ELEVENLABS_API_KEY).toBeTruthy();
      expect(testConfig.DID_API_KEY).toBeTruthy();
      expect(testConfig.SUPABASE_URL).toBeTruthy();
      expect(testConfig.STORAGE_BUCKET).toBeTruthy();
      expect(testConfig.DEFAULT_REQUESTER_ID).toBeTruthy();
    });

    it('should handle production environment validation', () => {
      // Set NODE_ENV to production to test strict validation
      process.env['NODE_ENV'] = 'production';
      process.env['PORT'] = '3001';
      process.env['CORS_ORIGIN'] = 'http://localhost:3000';
      process.env['STORAGE_BUCKET'] = 'test-bucket';
      process.env['DEFAULT_REQUESTER_ID'] = 'test-user';
      
      const { config: prodConfig } = jest.requireActual('../utils/config');
      
      expect(prodConfig.NODE_ENV).toBe('production');
      expect(prodConfig.PORT).toBe(3001);
      expect(prodConfig.CORS_ORIGIN).toBe('http://localhost:3000');
      expect(prodConfig.STORAGE_BUCKET).toBe('test-bucket');
      expect(prodConfig.DEFAULT_REQUESTER_ID).toBe('test-user');
    });

    it('should throw error for missing required environment variables in production', () => {
      // Clear module cache to ensure fresh config
      jest.resetModules();
      
      // Set NODE_ENV to production but don't set required vars
      process.env['NODE_ENV'] = 'production';
      delete process.env['PORT'];
      delete process.env['CORS_ORIGIN'];
      delete process.env['STORAGE_BUCKET'];
      delete process.env['DEFAULT_REQUESTER_ID'];
      
      expect(() => {
        jest.requireActual('../utils/config');
      }).toThrow('Missing required environment variables: NODE_ENV, PORT, CORS_ORIGIN');
    });

    it('should throw error for invalid PORT values in production', () => {
      // Set up production environment
      process.env['NODE_ENV'] = 'production';
      process.env['CORS_ORIGIN'] = 'http://localhost:3000';
      process.env['STORAGE_BUCKET'] = 'test-bucket';
      process.env['DEFAULT_REQUESTER_ID'] = 'test-user';
      
      // Test non-numeric PORT
      process.env['PORT'] = 'invalid';
      expect(() => {
        jest.requireActual('../utils/config');
      }).toThrow('Invalid PORT value: invalid. Must be a number between 1 and 65535.');
      
      // Test out-of-range PORT (too low)
      process.env['PORT'] = '0';
      expect(() => {
        jest.requireActual('../utils/config');
      }).toThrow('Invalid PORT value: 0. Must be a number between 1 and 65535.');
      
      // Test out-of-range PORT (too high)
      process.env['PORT'] = '70000';
      expect(() => {
        jest.requireActual('../utils/config');
      }).toThrow('Invalid PORT value: 70000. Must be a number between 1 and 65535.');
    });

    it('should throw error for invalid rate limiting values in production', () => {
      // Set up production environment
      process.env['NODE_ENV'] = 'production';
      process.env['PORT'] = '3001';
      process.env['CORS_ORIGIN'] = 'http://localhost:3000';
      process.env['STORAGE_BUCKET'] = 'test-bucket';
      process.env['DEFAULT_REQUESTER_ID'] = 'test-user';
      
      // Test invalid window MS
      process.env['RATE_LIMIT_WINDOW_MS'] = 'invalid';
      expect(() => {
        jest.requireActual('../utils/config');
      }).toThrow('Invalid RATE_LIMIT_WINDOW_MS value: invalid. Must be a positive number.');
      
      // Test invalid max requests
      process.env['RATE_LIMIT_WINDOW_MS'] = '900000';
      process.env['RATE_LIMIT_MAX_REQUESTS'] = '0';
      expect(() => {
        jest.requireActual('../utils/config');
      }).toThrow('Invalid RATE_LIMIT_MAX_REQUESTS value: 0. Must be a positive number.');
    });
  });
}); 
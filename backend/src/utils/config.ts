import dotenv from 'dotenv';
import { EnvironmentConfig } from '../types';

// Load environment variables
dotenv.config();

const validateConfig = (): EnvironmentConfig => {
  const requiredEnvVars = ['NODE_ENV', 'PORT', 'CORS_ORIGIN'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  // Validate PORT
  const port = parseInt(process.env['PORT']!, 10);
  if (isNaN(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT value: ${process.env['PORT']}. Must be a number between 1 and 65535.`);
  }

  // Validate rate limiting configuration
  const rateLimitWindowMs = parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000', 10);
  if (isNaN(rateLimitWindowMs) || rateLimitWindowMs <= 0) {
    throw new Error(`Invalid RATE_LIMIT_WINDOW_MS value: ${process.env['RATE_LIMIT_WINDOW_MS']}. Must be a positive number.`);
  }

  const rateLimitMaxRequests = parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100', 10);
  if (isNaN(rateLimitMaxRequests) || rateLimitMaxRequests <= 0) {
    throw new Error(`Invalid RATE_LIMIT_MAX_REQUESTS value: ${process.env['RATE_LIMIT_MAX_REQUESTS']}. Must be a positive number.`);
  }

  // Validate storage configuration
  if (!process.env['STORAGE_BUCKET']) {
    throw new Error('STORAGE_BUCKET environment variable is required');
  }

  if (!process.env['DEFAULT_REQUESTER_ID']) {
    throw new Error('DEFAULT_REQUESTER_ID environment variable is required');
  }

  return {
    NODE_ENV: process.env['NODE_ENV']!,
    PORT: port,
    CORS_ORIGIN: process.env['CORS_ORIGIN']!,
    OPENAI_API_KEY: process.env['OPENAI_API_KEY'],
    ELEVENLABS_API_KEY: process.env['ELEVENLABS_API_KEY'],
    DID_API_KEY: process.env['DID_API_KEY'],
    // ElevenLabs voice IDs - TODO: These will eventually be fetched from Supabase database
    ELEVENLABS_TERRY_CREWS_VOICE_ID: process.env['ELEVENLABS_TERRY_CREWS_VOICE_ID'],
    ELEVENLABS_WILL_HOWARD_VOICE_ID: process.env['ELEVENLABS_WILL_HOWARD_VOICE_ID'],
    // Supabase Configuration
    SUPABASE_URL: process.env['SUPABASE_URL'],
    SUPABASE_ANON_KEY: process.env['SUPABASE_ANON_KEY'],
    SUPABASE_SERVICE_ROLE_KEY: process.env['SUPABASE_SERVICE_ROLE_KEY'],
    // Storage Configuration
    STORAGE_BUCKET: process.env['STORAGE_BUCKET']!,
    DEFAULT_REQUESTER_ID: process.env['DEFAULT_REQUESTER_ID']!,
    RATE_LIMIT_WINDOW_MS: rateLimitWindowMs,
    RATE_LIMIT_MAX_REQUESTS: rateLimitMaxRequests,
    LOG_LEVEL: process.env['LOG_LEVEL'] || 'info',
  };
};

export const config = validateConfig();

export const isDevelopment = config.NODE_ENV === 'development';
export const isProduction = config.NODE_ENV === 'production';
export const isTest = config.NODE_ENV === 'test'; 
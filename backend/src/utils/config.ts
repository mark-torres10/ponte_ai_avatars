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

  return {
    NODE_ENV: process.env['NODE_ENV']!,
    PORT: parseInt(process.env['PORT']!, 10),
    CORS_ORIGIN: process.env['CORS_ORIGIN']!,
    OPENAI_API_KEY: process.env['OPENAI_API_KEY'],
    ELEVENLABS_API_KEY: process.env['ELEVENLABS_API_KEY'],
    DID_API_KEY: process.env['DID_API_KEY'],
    RATE_LIMIT_WINDOW_MS: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000', 10),
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100', 10),
    LOG_LEVEL: process.env['LOG_LEVEL'] || 'info',
  };
};

export const config = validateConfig();

export const isDevelopment = config.NODE_ENV === 'development';
export const isProduction = config.NODE_ENV === 'production';
export const isTest = config.NODE_ENV === 'test'; 
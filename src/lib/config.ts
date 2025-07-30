// Environment detection
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';

// Frontend Configuration
export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || (isDevelopment ? 'http://localhost:3001' : 'https://ponteaiavatars-production.up.railway.app'),
    timeout: 30000, // 30 seconds
  },
  
  // App Configuration
  app: {
    name: 'Ponte AI',
    version: '1.0.0',
  },
  
  // Feature Flags
  features: {
    avatarGeneration: true,
    healthChecks: true,
  },
} as const;

// API URL getter with validation
export const getApiUrl = (endpoint: string = '') => {
  const baseUrl = config.api.baseUrl;
  return `${baseUrl}${endpoint}`;
}; 
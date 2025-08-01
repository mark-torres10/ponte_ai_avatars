import { Router, Request, Response } from 'express';
import { HealthCheckResponse, ApiResponse } from '../types';
import { logger } from '../utils/logger';
import { config } from '../utils/config';
import { asyncHandler } from '../middleware/errorHandler';
import { testSupabaseConnection, validateBucket } from '../utils/supabase';

const router = Router();

const getUptime = (): number => {
  return process.uptime();
};

const getSystemInfo = (): HealthCheckResponse => {
  return {
    status: 'healthy',
    uptime: getUptime(),
    timestamp: new Date().toISOString(),
    version: process.env['npm_package_version'] || '1.0.0',
    environment: config.NODE_ENV,
  };
};

/**
 * @route GET /health
 * @desc Health check endpoint
 * @access Public
 */
router.get('/', asyncHandler(async (_req: Request, res: Response) => {
  const startTime = Date.now();
  
  try {
    const healthInfo = getSystemInfo();
    
    const response: ApiResponse<HealthCheckResponse> = {
      success: true,
      data: healthInfo,
      timestamp: new Date().toISOString(),
    };

    const duration = Date.now() - startTime;
    logger.api('Health', 'check', duration, true);

    res.status(200).json(response);
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.api('Health', 'check', duration, false);
    
    const errorResponse: ApiResponse = {
      success: false,
      error: 'Health check failed',
      timestamp: new Date().toISOString(),
    };

    res.status(500).json(errorResponse);
  }
}));

/**
 * @route GET /health/detailed
 * @desc Detailed health check with system information
 * @access Public
 */
router.get('/detailed', asyncHandler(async (_req: Request, res: Response) => {
  const startTime = Date.now();
  
  try {
    const healthInfo = getSystemInfo();
    
    // Add additional system information (only in non-production environments)
    const detailedInfo = {
      ...healthInfo,
      ...(config.NODE_ENV !== 'production' && {
        system: {
          nodeVersion: process.version,
          platform: process.platform,
          arch: process.arch,
          memoryUsage: process.memoryUsage(),
          cpuUsage: process.cpuUsage(),
        },
        config: {
          environment: config.NODE_ENV,
          port: config.PORT,
          corsOrigin: config.CORS_ORIGIN,
          hasOpenAIKey: !!config.OPENAI_API_KEY,
          hasElevenLabsKey: !!config.ELEVENLABS_API_KEY,
          hasDIDKey: !!config.DID_API_KEY,
          hasSupabaseUrl: !!config.SUPABASE_URL,
          hasSupabaseKey: !!config.SUPABASE_ANON_KEY,
        },
      }),
    };

    const response: ApiResponse = {
      success: true,
      data: detailedInfo,
      timestamp: new Date().toISOString(),
    };

    const duration = Date.now() - startTime;
    logger.api('Health', 'detailed', duration, true);

    res.status(200).json(response);
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.api('Health', 'detailed', duration, false);
    
    const errorResponse: ApiResponse = {
      success: false,
      error: 'Detailed health check failed',
      timestamp: new Date().toISOString(),
    };

    res.status(500).json(errorResponse);
  }
}));

/**
 * @route GET /health/storage
 * @desc Storage health check with Supabase connectivity test
 * @access Public
 */
router.get('/storage', asyncHandler(async (_req: Request, res: Response) => {
  const startTime = Date.now();
  
  try {
    const supabaseConnected = await testSupabaseConnection();
    const bucketValid = await validateBucket('test-bucket-ponteai');
    
    const storageHealth = {
      supabase: {
        connected: supabaseConnected,
        configured: !!(config.SUPABASE_URL && config.SUPABASE_ANON_KEY),
      },
      bucket: {
        name: 'test-bucket-ponteai',
        accessible: bucketValid,
      },
      timestamp: new Date().toISOString(),
    };

    const response: ApiResponse = {
      success: true,
      data: storageHealth,
      timestamp: new Date().toISOString(),
    };

    const duration = Date.now() - startTime;
    logger.api('Health', 'storage', duration, true);

    res.status(200).json(response);
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.api('Health', 'storage', duration, false);
    
    const errorResponse: ApiResponse = {
      success: false,
      error: 'Storage health check failed',
      timestamp: new Date().toISOString(),
    };

    res.status(500).json(errorResponse);
  }
}));

export default router; 
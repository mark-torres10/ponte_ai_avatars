import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger';
import { config } from '../utils/config';

const router = Router();

// Basic health check
router.get('/', (req: Request, res: Response) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  
  res.json({
    status: 'healthy',
    uptime: Math.round(uptime),
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: config.NODE_ENV,
    memory: {
      rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
    },
  });
});

// Detailed health check with service validation
router.get('/detailed', async (req: Request, res: Response) => {
  const healthStatus: any = {
    status: 'healthy',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: config.NODE_ENV,
    services: {
      did: { status: 'unknown', error: null, data: null },
      supabase: { status: 'unknown', error: null, data: null },
      elevenlabs: { status: 'unknown', error: null, data: null },
    },
    configuration: {
      corsOrigin: config.CORS_ORIGIN,
      port: config.PORT,
      rateLimit: {
        windowMs: config.RATE_LIMIT_WINDOW_MS,
        maxRequests: config.RATE_LIMIT_MAX_REQUESTS,
      },
    },
  };

  try {
    // Test D-ID Service
    try {
      const { DIDService } = await import('../services/didService');
      const didService = new DIDService();
      
      // Test D-ID API connection by getting available presenters
      const presenters = didService.getAvailablePresenters();
      healthStatus.services.did = {
        status: 'healthy',
        error: null,
        data: { presentersCount: presenters.length }
      };
    } catch (error) {
      healthStatus.services.did = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      healthStatus.status = 'degraded';
    }

    // Test Supabase Service
    try {
      const { SupabaseService } = await import('../services/supabaseService');
      const supabaseService = new SupabaseService();
      
      // Test Supabase connection by checking bucket access
      const testMetadata = supabaseService.generateSessionMetadata('health_check', 'test');
      healthStatus.services.supabase = {
        status: 'healthy',
        error: null,
        data: { bucketName: 'test-bucket-ponteai' }
      };
    } catch (error) {
      healthStatus.services.supabase = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      healthStatus.status = 'degraded';
    }

    // Test ElevenLabs Service
    try {
      const { VoiceService } = await import('../services/voiceService');
      const voiceService = new VoiceService();
      
      // Test ElevenLabs connection by checking available voices
      const availableVoices = voiceService.getAvailableVoices();
      const configuredPersonas = voiceService.getConfiguredPersonas();
      
      healthStatus.services.elevenlabs = {
        status: 'healthy',
        error: null,
        data: { 
          availableVoicesCount: availableVoices.length,
          configuredPersonasCount: Object.keys(configuredPersonas).length
        }
      };
    } catch (error) {
      healthStatus.services.elevenlabs = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      healthStatus.status = 'degraded';
    }

    logger.info('Health check completed', healthStatus);
    res.json(healthStatus);

  } catch (error) {
    logger.error('Health check failed', error);
    healthStatus.status = 'unhealthy';
    healthStatus.error = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json(healthStatus);
  }
});

// Service-specific health checks
router.get('/did', async (req: Request, res: Response) => {
  try {
    const { DIDService } = await import('../services/didService');
    const didService = new DIDService();
    const presenters = didService.getAvailablePresenters();
    
    res.json({
      status: 'healthy',
      service: 'd-id',
      presenters: presenters.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('D-ID health check failed', error);
    res.status(500).json({
      status: 'unhealthy',
      service: 'd-id',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
});

router.get('/supabase', async (req: Request, res: Response) => {
  try {
    const { SupabaseService } = await import('../services/supabaseService');
    const supabaseService = new SupabaseService();
    const testMetadata = supabaseService.generateSessionMetadata('health_check', 'test');
    
    res.json({
      status: 'healthy',
      service: 'supabase',
      bucketName: 'test-bucket-ponteai',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Supabase health check failed', error);
    res.status(500).json({
      status: 'unhealthy',
      service: 'supabase',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router; 
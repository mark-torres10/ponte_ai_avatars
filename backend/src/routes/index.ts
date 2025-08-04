import { Router } from 'express';
import healthRoutes from './health';
import textRoutes from './text';
import voiceRoutes from './voice';
import videoRoutes from './video';
import openaiRoutes from './openai';

const router = Router();

// Health check routes
router.use('/health', healthRoutes);

// API versioning - v1 routes
router.use('/api/v1', (req, _res, next) => {
  // Add API version to request for logging without modifying URL
  (req as any).apiVersion = 'v1';
  next();
});

// Text personalization routes
router.use('/api/text', textRoutes);

// Voice generation routes
router.use('/api/voice', voiceRoutes);

// Video generation routes
router.use('/api/video', videoRoutes);

// OpenAI routes
router.use('/api/openai', openaiRoutes);

// Placeholder for future avatar generation routes
router.use('/api/v1/avatar', (_req, res) => {
  res.status(501).json({
    success: false,
    error: 'Avatar generation endpoints not yet implemented',
    timestamp: new Date().toISOString(),
  });
});

export default router; 
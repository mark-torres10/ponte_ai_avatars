import { Router } from 'express';
import healthRoutes from './health';

const router = Router();

// Health check routes
router.use('/health', healthRoutes);

// API versioning - v1 routes
router.use('/api/v1', (req, _res, next) => {
  // Add API version to request for logging
  req.url = req.url.replace('/api/v1', '');
  next();
});

// Placeholder for future avatar generation routes
router.use('/api/v1/avatar', (_req, res) => {
  res.status(501).json({
    success: false,
    error: 'Avatar generation endpoints not yet implemented',
    timestamp: new Date().toISOString(),
  });
});

export default router; 
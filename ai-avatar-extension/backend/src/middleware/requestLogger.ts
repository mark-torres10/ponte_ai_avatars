import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { LoggedRequest } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  const requestId = (req as unknown as LoggedRequest).requestId || 'unknown';

  // Add start time to request object
  (req as unknown as LoggedRequest).startTime = startTime;

  // Log request start
  logger.info('Request started', {
    requestId,
    method: req.method,
    url: req.originalUrl,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    headers: {
      'content-type': req.get('Content-Type'),
      'accept': req.get('Accept'),
    },
  });

  // Log response when it finishes
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Log request completion
    logger.request(req.method, req.originalUrl, duration, statusCode);

    // Log additional response details for errors
    if (statusCode >= 400) {
      logger.warn('Request failed', {
        requestId,
        statusCode,
        duration,
        url: req.originalUrl,
        method: req.method,
      });
    }
  });

  next();
};

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const requestId = req.get('X-Request-ID') || uuidv4();
  
  // Add request ID to response headers
  res.setHeader('X-Request-ID', requestId);
  
  // Add to request object for logging
  (req as unknown as LoggedRequest).requestId = requestId;
  
  next();
}; 
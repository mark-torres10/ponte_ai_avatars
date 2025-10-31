import app from './app';
import { config } from './utils/config';
import { logger } from './utils/logger';

const server = app.listen(config.PORT, () => {
  logger.info(`🚀 Ponte AI Avatar Backend Server started`, {
    port: config.PORT,
    environment: config.NODE_ENV,
    corsOrigin: config.CORS_ORIGIN,
    timestamp: new Date().toISOString(),
  });

  // Log available endpoints
  const host = process.env['HOST'] || 'localhost';
  logger.info('📋 Available endpoints:', {
    health: `http://${host}:${config.PORT}/health`,
    healthDetailed: `http://${host}:${config.PORT}/health/detailed`,
    apiV1: `http://${host}:${config.PORT}/api/v1`,
  });
});

// Graceful shutdown handling
const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  
  server.close((err) => {
    if (err) {
      logger.error('Error during server shutdown:', { error: err.message, stack: err.stack });
      process.exit(1);
    }
    
    logger.info('Server closed successfully');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Handle different shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', { error: error.message, stack: error.stack });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { promise, reason });
  process.exit(1);
});

export default server; 
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

import { config, isDevelopment } from './utils/config';
import { logger } from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestLogger, requestIdMiddleware } from './middleware/requestLogger';
import routes from './routes';

const app = express();

// CORS configuration - strict environment separation
const corsOptions: cors.CorsOptions = {
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  exposedHeaders: ['X-Request-ID'],
  optionsSuccessStatus: 204, // Some legacy browsers choke on 204
};

if (isDevelopment) {
  // In development, only allow localhost frontend
  corsOptions.origin = 'http://localhost:3000';
} else {
  // In production, only allow Vercel frontend
  corsOptions.origin = config.CORS_ORIGIN;
}

app.use(cors(corsOptions));

// Security middleware (after CORS to avoid interference)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Request ID middleware
app.use(requestIdMiddleware);

// Request logging
app.use(requestLogger);

// HTTP request logging with Morgan
if (isDevelopment) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message: string) => {
        logger.info(message.trim());
      },
    },
  }));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/', routes);

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app; 
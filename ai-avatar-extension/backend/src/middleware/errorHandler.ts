import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { ApiError } from '../types';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const createError = (message: string, statusCode: number): AppError => {
  return new AppError(message, statusCode);
};

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let error = err;

  // If it's not an AppError, convert it to one
  if (!(error instanceof AppError)) {
    const statusCode = 500;
    const message = error.message || 'Internal Server Error';
    error = new AppError(message, statusCode);
  }

  const appError = error as AppError;
  const { statusCode, message } = appError;

  // Log the error
  logger.error('Error occurred', {
    statusCode,
    message,
    url: req.url,
    method: req.method,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    stack: appError.stack,
  });

  // Don't leak error details in production
  const errorResponse: ApiError = {
    code: `HTTP_${statusCode}`,
    message: isDevelopment ? message : 'Internal Server Error',
    timestamp: new Date().toISOString(),
  };

  // Add stack trace in development
  if (isDevelopment && appError.stack) {
    errorResponse.details = appError.stack;
  }

  res.status(statusCode).json({
    success: false,
    error: errorResponse,
    timestamp: new Date().toISOString(),
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  const error = createError(`Route ${req.originalUrl} not found`, 404);
  errorHandler(error, req, res, () => {});
};

// Define a proper function type for async handlers
type AsyncHandlerFunction = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

export const asyncHandler = (fn: AsyncHandlerFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Import isDevelopment from config
import { isDevelopment } from '../utils/config'; 
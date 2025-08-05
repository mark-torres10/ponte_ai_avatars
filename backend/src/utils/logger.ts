import { config } from './config';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

const logLevelMap: Record<string, LogLevel> = {
  error: LogLevel.ERROR,
  warn: LogLevel.WARN,
  info: LogLevel.INFO,
  debug: LogLevel.DEBUG,
};

const currentLogLevel = logLevelMap[config.LOG_LEVEL] || LogLevel.INFO;

const formatMessage = (level: string, message: string, meta?: Record<string, unknown>): string => {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`;
};

const shouldLog = (level: LogLevel): boolean => {
  return level <= currentLogLevel;
};

export const logger = {
  error: (message: string, meta?: Record<string, unknown>): void => {
    if (shouldLog(LogLevel.ERROR)) {
      // eslint-disable-next-line no-console
      console.error(formatMessage('error', message, meta));
    }
  },

  warn: (message: string, meta?: Record<string, unknown>): void => {
    if (shouldLog(LogLevel.WARN)) {
      // eslint-disable-next-line no-console
      console.warn(formatMessage('warn', message, meta));
    }
  },

  info: (message: string, meta?: Record<string, unknown>): void => {
    if (shouldLog(LogLevel.INFO)) {
      // eslint-disable-next-line no-console
      console.info(formatMessage('info', message, meta));
    }
  },

  debug: (message: string, meta?: Record<string, unknown>): void => {
    if (shouldLog(LogLevel.DEBUG)) {
      // eslint-disable-next-line no-console
      console.debug(formatMessage('debug', message, meta));
    }
  },

  // Request-specific logging
  request: (method: string, url: string, duration: number, statusCode: number): void => {
    const level = statusCode >= 400 ? 'warn' : 'info';
    const message = `${method} ${url} - ${statusCode} - ${duration}ms`;
    if (level === 'warn') {
      logger.warn(message);
    } else {
      logger.info(message);
    }
  },

  // API-specific logging
  api: (service: string, operation: string, duration: number, success: boolean): void => {
    const level = success ? 'info' : 'error';
    const message = `${service} ${operation} - ${success ? 'SUCCESS' : 'FAILED'} - ${duration}ms`;
    if (level === 'error') {
      logger.error(message);
    } else {
      logger.info(message);
    }
  },
}; 
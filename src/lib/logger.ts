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

// Get log level from environment variable, default to INFO
const currentLogLevel = logLevelMap[process.env.LOG_LEVEL || 'info'] || LogLevel.INFO;

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
      // Use Next.js console.error for better integration
      console.error(formatMessage('error', message, meta));
    }
  },

  warn: (message: string, meta?: Record<string, unknown>): void => {
    if (shouldLog(LogLevel.WARN)) {
      console.warn(formatMessage('warn', message, meta));
    }
  },

  info: (message: string, meta?: Record<string, unknown>): void => {
    if (shouldLog(LogLevel.INFO)) {
      console.info(formatMessage('info', message, meta));
    }
  },

  debug: (message: string, meta?: Record<string, unknown>): void => {
    if (shouldLog(LogLevel.DEBUG)) {
      console.debug(formatMessage('debug', message, meta));
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

  // Authentication-specific logging
  auth: (method: string, userId: string | null, success: boolean): void => {
    const level = success ? 'info' : 'warn';
    const message = `Authentication ${method} - ${success ? 'SUCCESS' : 'FAILED'}`;
    const meta = { userId: userId ? userId.substring(0, 8) + '...' : null };
    
    if (level === 'warn') {
      logger.warn(message, meta);
    } else {
      logger.info(message, meta);
    }
  },
}; 
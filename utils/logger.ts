/**
 * Structured logging utility
 * Replaces console.log/error/warn with a more robust logging system
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;

  private log(level: LogLevel, message: string, ...args: unknown[]): void {
    // Skip debug logs in production
    if (!this.isDevelopment && level === 'debug') return;

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    const logData = {
      level,
      message,
      timestamp,
      context: args.length > 0 ? args : undefined,
    };

    switch (level) {
      case 'error':
        console.error(prefix, message, ...args);
        // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
        // Example: Sentry.captureException(error, { extra: logData });
        break;
      case 'warn':
        console.warn(prefix, message, ...args);
        break;
      case 'info':
        console.info(prefix, message, ...args);
        break;
      case 'debug':
        console.debug(prefix, message, ...args);
        break;
    }
  }

  /**
   * Log debug information (only in development)
   */
  debug(message: string, ...args: unknown[]): void {
    this.log('debug', message, ...args);
  }

  /**
   * Log informational messages
   */
  info(message: string, ...args: unknown[]): void {
    this.log('info', message, ...args);
  }

  /**
   * Log warning messages
   */
  warn(message: string, ...args: unknown[]): void {
    this.log('warn', message, ...args);
  }

  /**
   * Log error messages with optional error object
   */
  error(message: string, error?: Error | unknown, ...args: unknown[]): void {
    if (error instanceof Error) {
      this.log('error', message, {
        error: error.message,
        stack: error.stack,
        ...args,
      });
    } else if (error !== undefined) {
      this.log('error', message, error, ...args);
    } else {
      this.log('error', message, ...args);
    }
  }
}

export const logger = new Logger();



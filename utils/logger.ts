// Production-ready logging utility
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'info';
  DEBUG: 'debug';
}

export const LogLevel: LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};

class Logger {
  private logToConsole(level: string, message: string, ...args: any[]) {
    if (isDevelopment) {
      switch (level) {
        case LogLevel.ERROR:
          console.error(message, ...args);
          break;
        case LogLevel.WARN:
          console.warn(message, ...args);
          break;
        case LogLevel.INFO:
          console.info(message, ...args);
          break;
        case LogLevel.DEBUG:
          console.debug(message, ...args);
          break;
      }
    }
    
    // In production, you could send logs to a service like Sentry, LogRocket, etc.
    if (isProduction && level === LogLevel.ERROR) {
      // Example: Send error to monitoring service
      // this.sendToMonitoringService(level, message, args);
    }
  }

  error(message: string, ...args: any[]) {
    this.logToConsole(LogLevel.ERROR, message, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.logToConsole(LogLevel.WARN, message, ...args);
  }

  info(message: string, ...args: any[]) {
    this.logToConsole(LogLevel.INFO, message, ...args);
  }

  debug(message: string, ...args: any[]) {
    this.logToConsole(LogLevel.DEBUG, message, ...args);
  }
}

export const logger = new Logger(); 
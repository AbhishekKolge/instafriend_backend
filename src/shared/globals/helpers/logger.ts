import winston, { format, Logform } from 'winston';
import { config } from 'src/config';
import 'winston-daily-rotate-file';

const { combine, timestamp, printf, errors, json, colorize } = format;

const logFormat = printf(
  ({ timestamp: time, level, message, stack }: Logform.TransformableInfo) => {
    return stack ? `${time} [${level}]: ${message}\n${stack}` : `${time} [${level}]: ${message}`;
  },
);

const logLevel: string = config.IS_PRODUCTION ? 'info' : 'debug';

export const logger = winston.createLogger({
  level: logLevel,
  format: combine(timestamp(), errors({ stack: true }), colorize(), logFormat),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
      level: logLevel,
      handleExceptions: true,
    }),
    new winston.transports.DailyRotateFile({
      filename: 'logs/%DATE%-combined.log',
      datePattern: 'YYYY-MM-DD',
      level: logLevel,
      format: json(),
      handleExceptions: true,
      maxFiles: '7d',
      maxSize: '10m',
    }),
    new winston.transports.DailyRotateFile({
      filename: 'logs/%DATE%-errors.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      format: json(),
      handleExceptions: true,
      maxFiles: '7d',
      maxSize: '10m',
    }),
  ],
  exitOnError: false,
});

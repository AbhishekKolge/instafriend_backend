import cors, { type CorsOptions, type CorsOptionsDelegate } from 'cors';
import type { Request, RequestHandler } from 'express';
import { logger } from '@infrastructure/logging';
import { ALLOWED_HEADERS, ALLOWED_METHODS, WHITELIST_ENDPOINTS_SET } from '@shared/utils';

const corsOptionsDelegate: CorsOptionsDelegate<Request> = (req, callback): void => {
  const origin = req.header('Origin') || '';
  let corsOptions: CorsOptions;

  if (WHITELIST_ENDPOINTS_SET.has(origin)) {
    corsOptions = {
      origin,
      credentials: true,
      optionsSuccessStatus: 204,
      methods: ALLOWED_METHODS,
      allowedHeaders: ALLOWED_HEADERS,
    };
  } else {
    corsOptions = { origin: false };
    logger.warn(`🚨 Unauthorized CORS request from origin: ${origin}`);
  }
  callback(null, corsOptions);
};

export const corsSetup: RequestHandler = cors(corsOptionsDelegate);

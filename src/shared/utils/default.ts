import { env } from '@infrastructure/config';

export const WHITELIST_ENDPOINTS_SET = new Set(env.CLIENT_URL);
export const SERVER_PORT = 8000;
export const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
export const ALLOWED_HEADERS = ['Content-Type', 'Authorization', 'X-Requested-With'];

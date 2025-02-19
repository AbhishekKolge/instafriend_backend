import dotenv from 'dotenv';
import { z } from 'zod';
import { ENVIRONMENT } from '@shared/types';

dotenv.config();

const environmentValues = Object.values(ENVIRONMENT) as [string, ...string[]];

const envSchema = z.object({
  MONGO_URI: z
    .string()
    .url({ message: 'MONGO_URI must be a valid URL (e.g., mongodb://localhost:27017/db-name)' }),
  MONGO_RETRY_LIMIT: z
    .string()
    .transform(Number)
    .refine((val) => !isNaN(val) && val >= 0, {
      message: 'MONGO_RETRY_LIMIT must be a valid non-negative number',
    }),
  MONGO_RETRY_DELAY: z
    .string()
    .transform(Number)
    .refine((val) => !isNaN(val) && val > 0, {
      message: 'MONGO_RETRY_DELAY must be a valid positive number (greater than 0)',
    }),
  CLIENT_URL: z.string().url({ message: 'CLIENT_URL must be a valid URL' }),
  REDIS_HOST: z.string().url({ message: 'REDIS_HOST must be a valid URL' }),
  NODE_ENV: z
    .enum(environmentValues, {
      message: `NODE_ENV must be one of: ${environmentValues.join(', ')}`,
    })
    .default(ENVIRONMENT.LOCAL),
});

export const env = envSchema.parse(process.env);
export const isProduction = env.NODE_ENV === 'production';

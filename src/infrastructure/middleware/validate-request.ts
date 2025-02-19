import { Request, Response, NextFunction } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { ZodSchema, ZodError } from 'zod';
import { logger } from '@infrastructure/logging';
import { formatZodErrors } from '@infrastructure/shared/utils';

export const validateRequest =
  <T extends { body?: unknown; query?: unknown; params?: unknown }>(schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = formatZodErrors(error);
        res.status(StatusCodes.BAD_REQUEST).json({
          message: formattedErrors,
          status: ReasonPhrases.BAD_REQUEST,
        });
        logger.warn(
          `🔴 Validation failed for ${req.method} ${req.url} - Errors: ${JSON.stringify(formattedErrors)}`,
        );
      } else {
        next(error);
      }
    }
  };

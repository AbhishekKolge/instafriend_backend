import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { CustomError } from '@infrastructure/error';
import { logger } from '@infrastructure/logging';

export const errorHandler = (
  error: Error | CustomError | mongoose.Error | mongoose.mongo.MongoServerError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const customError = {
    message: error.message || 'Something went wrong, please try again',
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    status: ReasonPhrases.INTERNAL_SERVER_ERROR,
  };

  if (error instanceof CustomError) {
    customError.statusCode = error.statusCode;
    customError.status = error.status;
  }

  res.status(customError.statusCode).json({
    message: customError.message,
    status: customError.status,
  });

  logger.error(error);
};

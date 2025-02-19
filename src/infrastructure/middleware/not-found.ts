import { Request, Response } from 'express';
import { NotFoundError } from '@infrastructure/error';

export const notFound = (req: Request, _res: Response) => {
  throw new NotFoundError(`${req.originalUrl} not available.`);
};

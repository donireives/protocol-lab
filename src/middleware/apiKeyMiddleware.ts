import { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';

const HEADER_NAME = 'x-api-key';

export const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const providedKey = req.header(HEADER_NAME);

  if (!providedKey || providedKey !== env.apiKey) {
    res.status(401).json({
      error: 'Unauthorized',
      message: `Missing or invalid ${HEADER_NAME} header.`
    });
    return;
  }

  next();
};

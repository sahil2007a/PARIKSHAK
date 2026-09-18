import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'An unexpected internal server error occurred';
  let code = 'INTERNAL_SERVER_ERROR';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code;
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource identifier format';
    code = 'INVALID_ID_FORMAT';
  } else if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value violates unique constraint';
    code = 'DUPLICATE_KEY_ERROR';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authorization token';
    code = 'INVALID_JWT';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authorization token has expired';
    code = 'EXPIRED_JWT';
  }

  if (statusCode >= 500) {
    logger.error(`[UnhandledError] ${err.message}`, err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    code
  });
};

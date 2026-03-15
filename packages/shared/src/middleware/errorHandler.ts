import { Request, Response, NextFunction } from 'express'
import { AppError } from '../errors/AppError'
import logger from '../logger'

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message })
    return
  }

  // unexpected error — log it, don't leak internals
  logger.error('Unhandled error', { message: err.message, stack: err.stack })
  res.status(500).json({ message: 'Internal server error' })
}
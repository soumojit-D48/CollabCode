import { Response, NextFunction } from 'express'
import { verifyToken } from '../jwt'
import { AuthRequest } from '../types'

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Missing or invalid authorization header' })
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    req.user = verifyToken(token)
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}
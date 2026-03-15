import { Request, Response, NextFunction } from 'express'
import { AuthRequest, logger } from '@collab/shared'
import { registerSchema, loginSchema } from '../validators/auth.validators'
import { registerUser, loginUser } from '../services/auth.service'

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.flatten().fieldErrors })
    return
  }
  try {
    const result = await registerUser(parsed.data)
    logger.info('User registered', { email: parsed.data.email })
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.flatten().fieldErrors })
    return
  }
  try {
    const result = await loginUser(parsed.data)
    logger.info('User logged in', { email: parsed.data.email })
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
}

export const me = (req: AuthRequest, res: Response): void => {
  res.status(200).json({ user: req.user })
}
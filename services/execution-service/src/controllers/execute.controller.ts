import { Request, Response, NextFunction } from 'express'
import { executeSchema } from '../validators/execute.validator'
import { executeCode } from '../services/judge0.service'
import { logger } from '@collab/shared'

export const execute = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const parsed = executeSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.flatten().fieldErrors })
    return
  }

  try {
    logger.info('Executing code', { language: parsed.data.language })
    const result = await executeCode(parsed.data)
    res.status(200).json(result)
  } catch (err: any) {
    logger.error('Execution error', { err: err.message })
    next(err)
  }
}
import { Response, NextFunction } from 'express'
import { AuthRequest } from '@collab/shared'
import { createFileSchema, updateFileSchema } from '../validators/file.validators'
import {
  getFilesForRoom,
  createFile,
  updateFile,
  deleteFile,
} from '../services/file.service'

export const listFiles = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const files = await getFilesForRoom(req.params.roomId)
    res.status(200).json(files)
  } catch (err) { next(err) }
}

export const create = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const parsed = createFileSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.flatten().fieldErrors })
    return
  }
  try {
    const file = await createFile(req.params.roomId, parsed.data, req.user!.userId)
    res.status(201).json(file)
  } catch (err) { next(err) }
}

export const update = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const parsed = updateFileSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.flatten().fieldErrors })
    return
  }
  try {
    const file = await updateFile(req.params.fileId, parsed.data, req.user!.userId)
    res.status(200).json(file)
  } catch (err) { next(err) }
}

export const remove = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await deleteFile(req.params.fileId, req.user!.userId)
    res.status(204).send()
  } catch (err) { next(err) }
}
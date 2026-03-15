import { Response, NextFunction } from 'express'
import { MemberRole } from '@prisma/client'
import { AuthRequest, logger } from '@collab/shared'
import { createRoomSchema, updateRoomSchema } from '../validators/room.validators'
import {
  createRoom, getRoomById, getRoomsForUser, getPublicRooms,
  updateRoom, deleteRoom, joinRoom, leaveRoom, updateMemberRole,
} from '../services/room.service'

export const create = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const parsed = createRoomSchema.safeParse(req.body)
  if (!parsed.success) { res.status(400).json({ errors: parsed.error.flatten().fieldErrors }); return }
  try {
    const room = await createRoom(parsed.data, req.user!.userId)
    logger.info('Room created', { roomId: room.id })
    res.status(201).json(room)
  } catch (err) { next(err) }
}

export const getOne = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const room = await getRoomById(req.params.roomId)
    if (!room) { res.status(404).json({ message: 'Room not found' }); return }
    const isMember = room.members.some((m) => m.userId === req.user!.userId)
    if (!room.isPublic && !isMember) { res.status(403).json({ message: 'Access denied' }); return }
    res.status(200).json(room)
  } catch (err) { next(err) }
}

export const getMyRooms = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try { res.status(200).json(await getRoomsForUser(req.user!.userId)) }
  catch (err) { next(err) }
}

export const listPublic = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try { res.status(200).json(await getPublicRooms()) }
  catch (err) { next(err) }
}

export const update = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const parsed = updateRoomSchema.safeParse(req.body)
  if (!parsed.success) { res.status(400).json({ errors: parsed.error.flatten().fieldErrors }); return }
  try { res.status(200).json(await updateRoom(req.params.roomId, parsed.data, req.user!.userId)) }
  catch (err) { next(err) }
}

export const remove = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try { await deleteRoom(req.params.roomId, req.user!.userId); res.status(204).send() }
  catch (err) { next(err) }
}

export const join = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const member = await joinRoom(req.params.roomId, req.user!.userId)
    logger.info('User joined room', { roomId: req.params.roomId, userId: req.user!.userId })
    res.status(201).json(member)
  } catch (err) { next(err) }
}

export const leave = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try { await leaveRoom(req.params.roomId, req.user!.userId); res.status(204).send() }
  catch (err) { next(err) }
}

export const changeRole = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const { userId, role } = req.body
  if (!userId || !role || !Object.values(MemberRole).includes(role)) {
    res.status(400).json({ message: 'Invalid userId or role' }); return
  }
  try {
    res.status(200).json(
      await updateMemberRole(req.params.roomId, userId, role as MemberRole, req.user!.userId)
    )
  } catch (err) { next(err) }
}
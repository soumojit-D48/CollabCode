import { MemberRole } from '@prisma/client'
import { NotFoundError, ForbiddenError, ConflictError } from '@collab/shared'
import prisma from '../prisma'
import { CreateRoomInput, UpdateRoomInput } from '../validators/room.validators'

export const createRoom = async (data: CreateRoomInput, ownerId: string) => {
  return prisma.room.create({
    data: {
      ...data,
      ownerId,
      members: { create: { userId: ownerId, role: MemberRole.OWNER } },
    },
    include: { members: true },
  })
}

export const getRoomById = async (roomId: string) => {
  return prisma.room.findUnique({
    where: { id: roomId },
    include: { members: true },
  })
}

export const getRoomsForUser = async (userId: string) => {
  return prisma.room.findMany({
    where: { members: { some: { userId } } },
    include: { members: true },
    orderBy: { createdAt: 'desc' },
  })
}

export const getPublicRooms = async () => {
  return prisma.room.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: 'desc' },
  })
}

export const updateRoom = async (
  roomId: string,
  data: UpdateRoomInput,
  userId: string
) => {
  const room = await prisma.room.findUnique({ where: { id: roomId } })
  if (!room) throw new NotFoundError('Room')
  if (room.ownerId !== userId) throw new ForbiddenError('Only the owner can update this room')
  return prisma.room.update({ where: { id: roomId }, data })
}

export const deleteRoom = async (roomId: string, userId: string) => {
  const room = await prisma.room.findUnique({ where: { id: roomId } })
  if (!room) throw new NotFoundError('Room')
  if (room.ownerId !== userId) throw new ForbiddenError('Only the owner can delete this room')
  await prisma.room.delete({ where: { id: roomId } })
}

export const joinRoom = async (roomId: string, userId: string) => {
  const room = await prisma.room.findUnique({ where: { id: roomId } })
  if (!room) throw new NotFoundError('Room')
  if (!room.isPublic) throw new ForbiddenError('Room is private')

  const existing = await prisma.roomMember.findUnique({
    where: { roomId_userId: { roomId, userId } },
  })
  if (existing) throw new ConflictError('Already a member')

  return prisma.roomMember.create({
    data: { roomId, userId, role: MemberRole.VIEWER },
  })
}

export const leaveRoom = async (roomId: string, userId: string) => {
  const room = await prisma.room.findUnique({ where: { id: roomId } })
  if (!room) throw new NotFoundError('Room')
  if (room.ownerId === userId)
    throw new ForbiddenError('Owner cannot leave — delete the room instead')

  const member = await prisma.roomMember.findUnique({
    where: { roomId_userId: { roomId, userId } },
  })
  if (!member) throw new NotFoundError('Membership')

  await prisma.roomMember.delete({
    where: { roomId_userId: { roomId, userId } },
  })
}

export const updateMemberRole = async (
  roomId: string,
  targetUserId: string,
  role: MemberRole,
  requestingUserId: string
) => {
  const room = await prisma.room.findUnique({ where: { id: roomId } })
  if (!room) throw new NotFoundError('Room')
  if (room.ownerId !== requestingUserId)
    throw new ForbiddenError('Only the owner can change roles')
  if (targetUserId === requestingUserId)
    throw new ForbiddenError('Cannot change your own role')

  return prisma.roomMember.update({
    where: { roomId_userId: { roomId, userId: targetUserId } },
    data: { role },
  })
}
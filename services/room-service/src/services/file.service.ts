import { NotFoundError, ForbiddenError, ConflictError } from '@collab/shared'
import prisma from '../prisma'
import { CreateFileInput, UpdateFileInput } from '../validators/file.validators'

export const getFilesForRoom = async (roomId: string) => {
  return prisma.file.findMany({
    where: { roomId },
    orderBy: { path: 'asc' },
  })
}

export const getFileById = async (fileId: string) => {
  return prisma.file.findUnique({ where: { id: fileId } })
}

export const createFile = async (
  roomId:  string,
  data:    CreateFileInput,
  userId:  string
) => {
  const member = await prisma.roomMember.findUnique({
    where: { roomId_userId: { roomId, userId } },
  })
  if (!member) throw new ForbiddenError('Not a member of this room')
  if (member.role === 'VIEWER') throw new ForbiddenError('Viewers cannot create files')

  const existing = await prisma.file.findUnique({
    where: { roomId_path: { roomId, path: data.path } },
  })
  if (existing) throw new ConflictError('A file at this path already exists')

  return prisma.file.create({
    data: { roomId, ...data },
  })
}

export const updateFile = async (
  fileId:  string,
  data:    UpdateFileInput,
  userId:  string
) => {
  const file = await prisma.file.findUnique({ where: { id: fileId } })
  if (!file) throw new NotFoundError('File')

  const member = await prisma.roomMember.findUnique({
    where: { roomId_userId: { roomId: file.roomId, userId } },
  })
  if (!member) throw new ForbiddenError('Not a member of this room')
  if (member.role === 'VIEWER') throw new ForbiddenError('Viewers cannot edit files')

  return prisma.file.update({ where: { id: fileId }, data })
}

export const deleteFile = async (fileId: string, userId: string) => {
  const file = await prisma.file.findUnique({ where: { id: fileId } })
  if (!file) throw new NotFoundError('File')

  const member = await prisma.roomMember.findUnique({
    where: { roomId_userId: { roomId: file.roomId, userId } },
  })
  if (!member) throw new ForbiddenError('Not a member of this room')
  if (member.role === 'VIEWER') throw new ForbiddenError('Viewers cannot delete files')

  await prisma.file.delete({ where: { id: fileId } })
}
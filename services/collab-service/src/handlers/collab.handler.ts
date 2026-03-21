import { Server, Socket } from 'socket.io'
import { logger } from '@collab/shared'
import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from '../types/socket.types'
import {
  getRoomContent,   setRoomContent,
  addActiveUser,    removeActiveUser,  getActiveUsers,
  setCursor,        removeCursor,
  getFileContent,   setFileContent,
} from '../rooms/room.state'

const COLORS = [
  '#F87171','#FB923C','#FBBF24','#34D399',
  '#60A5FA','#A78BFA','#F472B6','#2DD4BF',
]
let colorIdx = 0
export const nextColor = () => COLORS[colorIdx++ % COLORS.length]

type IO  = Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>
type Soc = Socket<ClientToServerEvents, ServerToClientEvents, {}, SocketData>

const leaveRoom = async (socket: Soc, roomId: string, userId: string) => {
  await Promise.all([
    socket.leave(roomId),
    removeActiveUser(roomId, userId),
    removeCursor(roomId, userId),
  ])
  socket.to(roomId).emit('room:user-left', userId)
  logger.info('User left room', { userId, roomId })
}

export const registerHandlers = (io: IO, socket: Soc) => {
  const { userId, username, color } = socket.data

  socket.on('room:join', async (roomId) => {
    try {
      await socket.join(roomId)
      const [content, users] = await Promise.all([
        getRoomContent(roomId),
        getActiveUsers(roomId),
        addActiveUser(roomId, { userId, username, color }),
      ])
      socket.emit('room:joined', { roomId, content, users })
      socket.to(roomId).emit('room:user-joined', { userId, username, color })
      logger.info('User joined room', { userId, roomId })
    } catch (err) {
      logger.error('room:join error', { err })
      socket.emit('error', 'Failed to join room')
    }
  })

  socket.on('room:leave', async (roomId) => {
    await leaveRoom(socket, roomId, userId)
  })

  socket.on('code:change', async ({ roomId, content }) => {
    try {
      await setRoomContent(roomId, content)
      socket.to(roomId).emit('code:updated', { content, senderId: userId })
    } catch (err) {
      logger.error('code:change error', { err })
    }
  })

  socket.on('file:open', async ({ roomId, fileId }) => {
    try {
      const content = await getFileContent(roomId, fileId)
      socket.emit('file:opened', { fileId, content })
    } catch (err) {
      logger.error('file:open error', { err })
      socket.emit('error', 'Failed to open file')
    }
  })

  socket.on('file:change', async ({ roomId, fileId, content }) => {
    try {
      await setFileContent(roomId, fileId, content)
      socket.to(roomId).emit('file:updated', { fileId, content, senderId: userId })
    } catch (err) {
      logger.error('file:change error', { err })
    }
  })

  socket.on('file:create', ({ roomId, file }) => {
    socket.to(roomId).emit('file:created', { file })
  })

  socket.on('file:delete', ({ roomId, fileId }) => {
    socket.to(roomId).emit('file:deleted', { fileId })
  })

  socket.on('file:rename', ({ roomId, fileId, name, path }) => {
    socket.to(roomId).emit('file:renamed', { fileId, name, path })
  })

  socket.on('cursor:move', async ({ roomId, line, column }) => {
    try {
      await setCursor(roomId, userId, { line, column })
      socket.to(roomId).emit('cursor:updated', { userId, username, line, column, color })
    } catch (err) {
      logger.error('cursor:move error', { err })
    }
  })

  socket.on('disconnect', async () => {
    const rooms = Array.from(socket.rooms).filter((r) => r !== socket.id)
    await Promise.all(rooms.map((roomId) => leaveRoom(socket, roomId, userId)))
  })
}
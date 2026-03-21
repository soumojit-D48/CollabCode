import { Server, Socket } from 'socket.io'
import { logger } from '@collab/shared'
import { Message } from '../models/message.model'

interface SocketData {
  userId:   string
  username: string
}

interface ClientToServerEvents {
  'room:join':    (roomId: string) => void
  'room:leave':   (roomId: string) => void
  'message:send': (payload: { roomId: string; content: string }) => void
  'history:get':  (payload: { roomId: string; limit?: number }) => void
}

interface ServerToClientEvents {
  'room:joined':    (payload: { roomId: string }) => void
  'message:new':    (msg: {
    id:        string
    userId:    string
    username:  string
    content:   string
    createdAt: Date
  }) => void
  'history:loaded': (messages: {
    id:        string
    userId:    string
    username:  string
    content:   string
    createdAt: Date
  }[]) => void
  'error': (message: string) => void
}

type IO  = Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>
type Soc = Socket<ClientToServerEvents, ServerToClientEvents, {}, SocketData>

export const registerChatHandlers = (_io: IO, socket: Soc) => {
  const { userId, username } = socket.data
  logger.debug('Chat socket connected', { socketId: socket.id, userId })

  socket.on('room:join', async (roomId) => {
    try {
      await socket.join(roomId)
      socket.emit('room:joined', { roomId })
      logger.info('User joined chat room', { userId, roomId })
    } catch (err) {
      logger.error('room:join error', { err })
      socket.emit('error', 'Failed to join room')
    }
  })

  socket.on('room:leave', async (roomId) => {
    await socket.leave(roomId)
    logger.info('User left chat room', { userId, roomId })
  })

  socket.on('message:send', async ({ roomId, content }) => {
    try {
      if (!content.trim()) return

      const msg = await Message.create({
        roomId,
        userId,
        username,
        content: content.trim(),
      })

      const payload = {
        id:        (msg._id as any).toString(),
        userId:    msg.userId,
        username:  msg.username,
        content:   msg.content,
        createdAt: msg.createdAt,
      }

      socket.to(roomId).emit('message:new', payload)
      socket.emit('message:new', payload)
    } catch (err) {
      logger.error('message:send error', { err, userId, roomId })
      socket.emit('error', 'Failed to send message')
    }
  })

  socket.on('history:get', async ({ roomId, limit = 50 }) => {
    try {
      const messages = await Message.find({ roomId })
        .sort({ createdAt: -1 })
        .limit(Math.min(limit, 100))
        .lean()

      socket.emit(
        'history:loaded',
        messages.reverse().map((m) => ({
          id:        m._id.toString(),
          userId:    m.userId,
          username:  m.username,
          content:   m.content,
          createdAt: m.createdAt,
        }))
      )
    } catch (err) {
      logger.error('history:get error', { err, userId, roomId })
      socket.emit('error', 'Failed to load history')
    }
  })

  socket.on('disconnect', () => {
    logger.debug('Chat socket disconnected', { socketId: socket.id, userId })
  })
}
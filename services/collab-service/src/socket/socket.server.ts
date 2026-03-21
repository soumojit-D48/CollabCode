import { Server } from 'socket.io'
import { createAdapter } from '@socket.io/redis-adapter'
import http from 'http'
import jwt from 'jsonwebtoken'
import { logger } from '@collab/shared'
import { pubClient, subClient } from '../utils/redis'
import { registerHandlers, nextColor } from '../handlers/collab.handler'
import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from '../types/socket.types'

export const createSocketServer = (httpServer: http.Server) => {
  const io = new Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>(
    httpServer,
    {
      cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    }
  )

  io.adapter(createAdapter(pubClient, subClient))
  logger.info('Socket.IO Redis adapter attached')

  io.use((socket, next) => {
    const raw =
      socket.handshake.auth?.token ??
      socket.handshake.headers?.authorization

    if (!raw) return next(new Error('Authentication required'))

    const token = raw.startsWith('Bearer ') ? raw.split(' ')[1] : raw

    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as { userId: string; username: string }

      socket.data.userId = payload.userId
      socket.data.username = payload.username
      socket.data.color = nextColor()
      next()
    } catch {
      next(new Error('Invalid or expired token'))
    }
  })

  io.on('connection', (socket) => registerHandlers(io, socket))

  return io
}
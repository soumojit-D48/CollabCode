import { io, Socket } from 'socket.io-client'

const COLLAB_URL =
  process.env.NEXT_PUBLIC_COLLAB_URL ?? 'http://localhost:3003'

let socket: Socket | null = null

export const getCollabSocket = (token: string): Socket => {
  // if socket exists and is connected, return it
  if (socket && socket.connected) return socket

  // if socket exists but disconnected, clean it up
  if (socket) {
    socket.removeAllListeners()
    socket.disconnect()
  }

  socket = io(COLLAB_URL, {
    auth: { token },
    autoConnect: false,
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  })

  return socket
}

export const disconnectCollabSocket = () => {
  if (socket) {
    socket.removeAllListeners()
    socket.disconnect()
    socket = null
  }
}
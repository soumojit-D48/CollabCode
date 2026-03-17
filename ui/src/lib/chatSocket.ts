import { io, Socket } from 'socket.io-client'

const CHAT_URL =
  process.env.NEXT_PUBLIC_CHAT_URL ?? 'http://localhost:3004'

let socket: Socket | null = null

export const getChatSocket = (token: string): Socket => {
  if (socket && socket.connected) return socket

  if (socket) {
    socket.removeAllListeners()
    socket.disconnect()
  }

  socket = io(CHAT_URL, {
    auth: { token },
    autoConnect: false,
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  })

  return socket
}

export const disconnectChatSocket = () => {
  if (socket) {
    socket.removeAllListeners()
    socket.disconnect()
    socket = null
  }
}
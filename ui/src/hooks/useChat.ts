import { useEffect, useRef } from 'react'
import { Socket } from 'socket.io-client'
import { getChatSocket, disconnectChatSocket } from '@/lib/chatSocket'
import { useChatStore } from '@/store/chat.store'
import { useAuthStore } from '@/store/auth.store'
import { Message } from '@/types'

export const useChat = (roomId: string) => {
  const socketRef = useRef<Socket | null>(null)
  const token     = useAuthStore((s) => s.token)

  const {
    setMessages,
    addMessage,
    setLoading,
    setConnected,
    reset,
  } = useChatStore()

  useEffect(() => {
    if (!token || !roomId) return

    const socket = getChatSocket(token)
    socketRef.current = socket

    socket.connect()

    socket.on('connect', () => {
      setConnected(true)
      socket.emit('room:join', roomId)
      setLoading(true)
      socket.emit('history:get', { roomId, limit: 100 })
    })

    socket.on('disconnect', () => {
      setConnected(false)
    })

    socket.on('room:joined', () => {
    })

    socket.on('history:loaded', (messages: Message[]) => {
      setMessages(messages)
      setLoading(false)
    })

    socket.on('message:new', (message: Message) => {
      addMessage(message)
    })

    socket.on('error', (msg: string) => {
      console.error('Chat socket error:', msg)
      setLoading(false)
    })

    return () => {
      socket.emit('room:leave', roomId)
      socket.removeAllListeners()
      disconnectChatSocket()
      reset()
    }
  }, [roomId, token])

  const sendMessage = (content: string) => {
    if (!content.trim()) return
    socketRef.current?.emit('message:send', { roomId, content })
  }

  return { sendMessage }
}
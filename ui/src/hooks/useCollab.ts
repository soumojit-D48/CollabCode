import { useEffect, useRef } from 'react'
import { Socket } from 'socket.io-client'
import { getCollabSocket, disconnectCollabSocket } from '@/lib/collabSocket'
import { useEditorStore } from '@/store/editor.store'
import { useAuthStore } from '@/store/auth.store'
import { ActiveUser, Cursor } from '@/types'

export const useCollab = (roomId: string) => {
  const socketRef = useRef<Socket | null>(null)
  const token     = useAuthStore((s) => s.token)

  const {
    setContent,
    setActiveUsers,
    addUser,
    removeUser,
    setCursor,
    setConnected,
    setReconnecting,
    reset,
  } = useEditorStore()

  useEffect(() => {
    if (!token || !roomId) return

    const socket = getCollabSocket(token)
    socketRef.current = socket

    // ── Connect ───────────────────────────────────────────
    socket.connect()

    socket.on('connect', () => {
      setConnected(true)
      setReconnecting(false)
      socket.emit('room:join', roomId)
    })

    socket.on('disconnect', () => {
      setConnected(false)
    })

    socket.on('connect_error', () => {
      setReconnecting(true)
    })

    // ── Room events ───────────────────────────────────────
    socket.on('room:joined', (payload: {
      roomId:  string
      content: string
      users:   ActiveUser[]
    }) => {
      setContent(payload.content)
      setActiveUsers(payload.users)
    })

    socket.on('room:user-joined', (user: ActiveUser) => {
      addUser(user)
    })

    socket.on('room:user-left', (userId: string) => {
      removeUser(userId)
    })

    // ── Code sync ─────────────────────────────────────────
    socket.on('code:updated', (payload: {
      content:  string
      senderId: string
    }) => {
      // update content — CodeEditor must NOT re-emit this back
      setContent(payload.content)
    })

    // ── Cursor sync ───────────────────────────────────────
    socket.on('cursor:updated', (cursor: Cursor) => {
      setCursor(cursor)
    })

    // ── Cleanup ───────────────────────────────────────────
    return () => {
      socket.emit('room:leave', roomId)
      socket.removeAllListeners()
      disconnectCollabSocket()
      reset()
    }
  }, [roomId, token])

  // ── Emit helpers ──────────────────────────────────────
  const sendCodeChange = (content: string) => {
    socketRef.current?.emit('code:change', { roomId, content })
  }

  const sendCursorMove = (line: number, column: number) => {
    socketRef.current?.emit('cursor:move', { roomId, line, column })
  }

  return { sendCodeChange, sendCursorMove }
}
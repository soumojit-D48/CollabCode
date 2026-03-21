import { useEffect, useRef } from 'react'
import { Socket } from 'socket.io-client'
import { getCollabSocket, disconnectCollabSocket } from '@/lib/collabSocket'
import { useEditorStore } from '@/store/editor.store'
import { useAuthStore } from '@/store/auth.store'
import { ActiveUser, Cursor, RoomFile } from '@/types'

export const useCollab = (roomId: string) => {
  const socketRef = useRef<Socket | null>(null)
  const token     = useAuthStore((s) => s.token)

  const {
    setActiveUsers,
    addUser,
    removeUser,
    setCursor,
    setConnected,
    setReconnecting,
    updateFile,
    addFile,
    removeFile,
    reset,
  } = useEditorStore()

  useEffect(() => {
    if (!token || !roomId) return

    const socket = getCollabSocket(token)
    socketRef.current = socket

    socket.connect()

    socket.on('connect', () => {
      setConnected(true)
      setReconnecting(false)
      socket.emit('room:join', roomId)
    })

    socket.on('disconnect', () => setConnected(false))

    socket.on('connect_error', () => setReconnecting(true))

    socket.on('room:joined', (payload: {
      roomId: string
      content: string
      users: ActiveUser[]
    }) => {
      setActiveUsers(payload.users)
    })

    socket.on('room:user-joined', (user: ActiveUser) => addUser(user))
    socket.on('room:user-left',   (userId: string)   => removeUser(userId))

    socket.on('file:updated', (payload: {
      fileId:   string
      content:  string
      senderId: string
    }) => {
      updateFile(payload.fileId, { content: payload.content })
    })

    socket.on('file:opened', (payload: { fileId: string; content: string }) => {
      updateFile(payload.fileId, { content: payload.content })
    })

    socket.on('file:created', ({ file }: { file: RoomFile }) => {
      addFile(file)
    })

    socket.on('file:deleted', ({ fileId }: { fileId: string }) => {
      removeFile(fileId)
    })

    socket.on('file:renamed', (payload: {
      fileId: string
      name:   string
      path:   string
    }) => {
      updateFile(payload.fileId, { name: payload.name, path: payload.path })
    })

    socket.on('cursor:updated', (cursor: Cursor) => setCursor(cursor))

    return () => {
      socket.emit('room:leave', roomId)
      socket.removeAllListeners()
      disconnectCollabSocket()
      reset()
    }
  }, [roomId, token])

  const sendFileChange = (fileId: string, content: string) => {
    socketRef.current?.emit('file:change', { roomId, fileId, content })
  }

  const sendFileOpen = (fileId: string) => {
    socketRef.current?.emit('file:open', { roomId, fileId })
  }

  const sendFileCreate = (file: RoomFile) => {
    socketRef.current?.emit('file:create', { roomId, file })
  }

  const sendFileDelete = (fileId: string) => {
    socketRef.current?.emit('file:delete', { roomId, fileId })
  }

  const sendFileRename = (fileId: string, name: string, path: string) => {
    socketRef.current?.emit('file:rename', { roomId, fileId, name, path })
  }

  const sendCursorMove = (line: number, column: number) => {
    socketRef.current?.emit('cursor:move', { roomId, line, column })
  }

  return {
    sendFileChange,
    sendFileOpen,
    sendFileCreate,
    sendFileDelete,
    sendFileRename,
    sendCursorMove,
  }
}
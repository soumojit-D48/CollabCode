'use client'

import { useEffect, useCallback, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft, Wifi, WifiOff,
  RefreshCw, Crown, Globe, Lock,
} from 'lucide-react'
import CodeEditor    from '@/components/editor/CodeEditor'
import ActiveUsers   from '@/components/editor/ActiveUsers'
import FileTabs      from '@/components/editor/FileTab'
import FileTree      from '@/components/editor/FileTree'
import NewFileModal  from '@/components/editor/NewFileModal'
import OutputPanel   from '@/components/editor/OutputPanel'
import RunButton     from '@/components/editor/RunButton'
import ChatPanel     from '@/components/chat/ChatPanel'
import { useCollab } from '@/hooks/useCollab'
import { useChat }   from '@/hooks/useChat'
import { useAuthStore }      from '@/store/auth.store'
import { useRoomStore }      from '@/store/room.store'
import { useEditorStore }    from '@/store/editor.store'
import { useExecutionStore } from '@/store/execution.store'
import { getLanguageColor }  from '@/lib/utils'
import { RoomFile }          from '@/types'
import { roomApi } from '@/lib/axios'
import axios from 'axios'

const EXECUTION_URL =
  process.env.NEXT_PUBLIC_EXECUTION_URL ?? 'http://localhost:3005'

function useDebounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  return useCallback((...args: Parameters<T>) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => fn(...args), delay)
  }, [fn, delay]) as T
}

export default function RoomPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.id as string

  const { hydrate, user }      = useAuthStore()
  const { fetchRoomById, currentRoom, leaveRoom } = useRoomStore()
  const {
    files,
    activeFileId,
    openFileIds,
    language,
    activeUsers,
    isConnected,
    isReconnecting,
    setFiles,
    addFile,
    removeFile,
    openFile,
    closeFile,
    setActiveFile,
    updateFile,
  } = useEditorStore()

  const { setResult, setLoading, setError, reset: resetExecution } = useExecutionStore()

  const [showNewFileModal, setShowNewFileModal] = useState(false)

  const {
    sendFileChange,
    sendFileOpen,
    sendFileCreate,
    sendFileDelete,
    sendFileRename,
    sendCursorMove,
  } = useCollab(roomId)

  const { sendMessage } = useChat(roomId)

  useEffect(() => { hydrate() }, [])

  useEffect(() => {
    if (!user) { router.replace('/login'); return }
    fetchRoomById(roomId)

    roomApi.get(`/rooms/${roomId}/files`).then((res) => {
      setFiles(res.data)
      if (res.data.length > 0) {
        const first = res.data[0]
        openFile(first.id)
        sendFileOpen(first.id)
      }
    })
  }, [user, roomId])

  const activeFile = files.find((f) => f.id === activeFileId) ?? null

  const handleFileClick = (file: RoomFile) => {
    openFile(file.id)
    sendFileOpen(file.id)
  }

  const handleCreateFile = async (name: string, path: string) => {
    try {
      const res = await roomApi.post(`/rooms/${roomId}/files`, {
        name,
        path,
        content: '',
      })
      const newFile: RoomFile = res.data
      addFile(newFile)
      sendFileCreate(newFile)
    } catch (err: any) {
      alert(err.response?.data?.message ?? 'Failed to create file')
    }
  }

  const handleDeleteFile = async (file: RoomFile) => {
    if (!confirm(`Delete ${file.name}?`)) return
    try {
      await roomApi.delete(`/rooms/${roomId}/files/${file.id}`)
      removeFile(file.id)
      sendFileDelete(file.id)
    } catch (err: any) {
      alert(err.response?.data?.message ?? 'Failed to delete file')
    }
  }

  const handleCodeChange = useDebounce((content: string) => {
    if (!activeFileId) return
    updateFile(activeFileId, { content })
    sendFileChange(activeFileId, content)
  }, 100)

  const handleRun = async () => {
    if (!activeFile) return
    resetExecution()
    setLoading(true)
    try {
      const res = await axios.post(`${EXECUTION_URL}/execute`, {
        code:     activeFile.content,
        language: language,
      })
      setResult(res.data)
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to connect to execution service')
    } finally {
      setLoading(false)
    }
  }

  const handleLeave = async () => {
    const isOwner = currentRoom?.ownerId === user?.id
    if (!isOwner) {
      try { await leaveRoom(roomId) } catch {}
    }
    router.push('/rooms')
  }

  const langColor = getLanguageColor(language)
  const isOwner   = currentRoom?.ownerId === user?.id

  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg)',
        height:          '100vh',
        display:         'flex',
        flexDirection:   'column',
        overflow:        'hidden',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderBottom:    '1px solid var(--color-border)',
          height:          '48px',
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'space-between',
          paddingLeft:     '12px',
          paddingRight:    '16px',
          flexShrink:      0,
          gap:             12,
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={handleLeave}
            style={{ color: 'var(--color-text-muted)' }}
            className="hover:text-[var(--color-text)] transition-colors flex-shrink-0 p-1"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex items-center gap-2 min-w-0">
            {isOwner && (
              <Crown size={13} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />
            )}
            <span
              style={{
                color:      'var(--color-text)',
                fontWeight: 600,
                fontSize:   '14px',
                fontFamily: 'var(--font-mono)',
              }}
              className="truncate"
            >
              {currentRoom?.name ?? roomId}
            </span>
          </div>

          <div style={{ width: 1, height: 18, backgroundColor: 'var(--color-border)', flexShrink: 0 }} />

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: langColor, display: 'inline-block' }} />
            <span style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
              {language}
            </span>
          </div>

          {currentRoom && (
            <div
              className="flex items-center gap-1 flex-shrink-0"
              style={{ color: currentRoom.isPublic ? 'var(--color-success)' : 'var(--color-text-muted)', fontSize: '11px' }}
            >
              {currentRoom.isPublic ? <Globe size={12} /> : <Lock size={12} />}
            </div>
          )}

          <RunButton onClick={handleRun} />
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          {user && activeUsers.length > 0 && (
            <ActiveUsers users={activeUsers} currentUserId={user.id} />
          )}

          <div className="flex items-center gap-1.5">
            {isReconnecting ? (
              <>
                <RefreshCw size={13} className="animate-spin" style={{ color: 'var(--color-warning)' }} />
                <span style={{ color: 'var(--color-warning)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>Reconnecting...</span>
              </>
            ) : isConnected ? (
              <>
                <Wifi size={13} style={{ color: 'var(--color-success)' }} />
                <span style={{ color: 'var(--color-success)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>Live</span>
              </>
            ) : (
              <>
                <WifiOff size={13} style={{ color: 'var(--color-danger)' }} />
                <span style={{ color: 'var(--color-danger)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>Disconnected</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <FileTree
          files={files}
          activeFileId={activeFileId}
          onFileClick={handleFileClick}
          onFileDelete={handleDeleteFile}
          onNewFile={() => setShowNewFileModal(true)}
        />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <FileTabs
            files={files}
            openFileIds={openFileIds}
            activeFileId={activeFileId}
            onTabClick={(fileId) => {
              setActiveFile(fileId)
              sendFileOpen(fileId)
            }}
            onTabClose={closeFile}
          />

          {activeFile ? (
            <CodeEditor
              key={activeFileId}
              roomId={roomId}
              content={activeFile?.content ?? ''}
              onCodeChange={handleCodeChange}
              onCursorChange={sendCursorMove}
            />
          ) : (
            <div
              style={{
                flex:            1,
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
                backgroundColor: '#1e1e1e',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
                  No file open
                </p>
                <button
                  onClick={() => setShowNewFileModal(true)}
                  style={{
                    color:      'var(--color-brand)',
                    fontSize:   '13px',
                    marginTop:  '8px',
                    background: 'none',
                    border:     'none',
                    cursor:     'pointer',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  + Create a file
                </button>
              </div>
            </div>
          )}

          <OutputPanel />
        </div>

        <ChatPanel roomId={roomId} onSend={sendMessage} />
      </div>

      {showNewFileModal && (
        <NewFileModal
          onClose={() => setShowNewFileModal(false)}
          onCreate={handleCreateFile}
        />
      )}
    </div>
  )
}

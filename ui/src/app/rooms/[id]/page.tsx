'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft, Wifi, WifiOff,
  RefreshCw, Crown, Globe, Lock,
} from 'lucide-react'
import CodeEditor from '@/components/editor/CodeEditor'
import ActiveUsers from '@/components/editor/ActiveUsers'
import ChatPanel from '@/components/chat/ChatPanel'
import { useCollab } from '@/hooks/useCollab'
import { useChat } from '@/hooks/useChat'
import { useAuthStore } from '@/store/auth.store'
import { useRoomStore } from '@/store/room.store'
import { useEditorStore } from '@/store/editor.store'
import { getLanguageColor } from '@/lib/utils'

// debounce helper
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
    language,
    activeUsers,
    isConnected,
    isReconnecting,
  } = useEditorStore()

  // initialise socket hooks
  const { sendCodeChange, sendCursorMove } = useCollab(roomId)
  const { sendMessage }                    = useChat(roomId)

  useEffect(() => {
    hydrate()
  }, [])

  useEffect(() => {
    if (!user) { router.replace('/login'); return }
    fetchRoomById(roomId)
  }, [user, roomId])

  // ── Debounced code emit (100ms) ──────────────────────────
  const debouncedCodeChange = useDebounce((content: string) => {
    sendCodeChange(content)
  }, 100)

  // ── Leave room ───────────────────────────────────────────
  const handleLeave = async () => {
    const isOwner = currentRoom?.ownerId === user?.id
    if (isOwner) {
      router.push('/rooms')
      return
    }
    try {
      await leaveRoom(roomId)
    } catch {
      // ignore — just navigate away
    }
    router.push('/rooms')
  }

  const langColor = getLanguageColor(language)
  const isOwner   = currentRoom?.ownerId === user?.id

  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg)',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >

      {/* ── Top bar ───────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: '12px',
          paddingRight: '16px',
          flexShrink: 0,
          gap: 12,
        }}
      >
        {/* Left — back + room info */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={handleLeave}
            style={{ color: 'var(--color-text-muted)' }}
            className="hover:text-[var(--color-text)] transition-colors flex-shrink-0 p-1"
          >
            <ArrowLeft size={18} />
          </button>

          {/* Room name */}
          <div className="flex items-center gap-2 min-w-0">
            {isOwner && (
              <Crown
                size={13}
                style={{ color: 'var(--color-warning)', flexShrink: 0 }}
              />
            )}
            <span
              style={{
                color: 'var(--color-text)',
                fontWeight: 600,
                fontSize: '14px',
                fontFamily: 'var(--font-mono)',
              }}
              className="truncate"
            >
              {currentRoom?.name ?? roomId}
            </span>
          </div>

          {/* Divider */}
          <div
            style={{
              width: 1,
              height: 18,
              backgroundColor: 'var(--color-border)',
              flexShrink: 0,
            }}
          />

          {/* Language badge */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: langColor,
                display: 'inline-block',
              }}
            />
            <span
              style={{
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
              }}
            >
              {language}
            </span>
          </div>

          {/* Public/private */}
          {currentRoom && (
            <div
              className="flex items-center gap-1 flex-shrink-0"
              style={{
                color: currentRoom.isPublic
                  ? 'var(--color-success)'
                  : 'var(--color-text-muted)',
                fontSize: '11px',
              }}
            >
              {currentRoom.isPublic
                ? <Globe size={12} />
                : <Lock size={12} />
              }
            </div>
          )}
        </div>

        {/* Right — users + connection status */}
        <div className="flex items-center gap-4 flex-shrink-0">

          {/* Active users */}
          {user && activeUsers.length > 0 && (
            <ActiveUsers
              users={activeUsers}
              currentUserId={user.id}
            />
          )}

          {/* Connection status */}
          <div className="flex items-center gap-1.5">
            {isReconnecting ? (
              <>
                <RefreshCw
                  size={13}
                  className="animate-spin"
                  style={{ color: 'var(--color-warning)' }}
                />
                <span
                  style={{
                    color: 'var(--color-warning)',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  Reconnecting...
                </span>
              </>
            ) : isConnected ? (
              <>
                <Wifi
                  size={13}
                  style={{ color: 'var(--color-success)' }}
                />
                <span
                  style={{
                    color: 'var(--color-success)',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  Live
                </span>
              </>
            ) : (
              <>
                <WifiOff
                  size={13}
                  style={{ color: 'var(--color-danger)' }}
                />
                <span
                  style={{
                    color: 'var(--color-danger)',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  Disconnected
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Main area ─────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        {/* Editor */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <CodeEditor
            roomId={roomId}
            onCodeChange={debouncedCodeChange}
            onCursorChange={sendCursorMove}
          />
        </div>

        {/* Chat */}
        <ChatPanel
          roomId={roomId}
          onSend={sendMessage}
        />
      </div>
    </div>
  )
}
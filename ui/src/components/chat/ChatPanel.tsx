'use client'

import { useEffect, useRef } from 'react'
import { MessageSquare, Wifi, WifiOff } from 'lucide-react'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import { useChatStore } from '@/store/chat.store'
import { useEditorStore } from '@/store/editor.store'
import { useAuthStore } from '@/store/auth.store'

interface ChatPanelProps {
  roomId:   string
  onSend:   (content: string) => void
}

export default function ChatPanel({ roomId, onSend }: ChatPanelProps) {
  const bottomRef  = useRef<HTMLDivElement>(null)
  const user       = useAuthStore((s) => s.user)
  const { messages, loading, isConnected } = useChatStore()
  const activeUsers = useEditorStore((s) => s.activeUsers)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getUserColor = (userId: string) => {
    return activeUsers.find((u) => u.userId === userId)?.color ?? '#60A5FA'
  }

  return (
    <div
      style={{
        width: '300px',
        flexShrink: 0,
        borderLeft: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <div
        style={{
          borderBottom: '1px solid var(--color-border)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div className="flex items-center gap-2">
          <MessageSquare
            size={15}
            style={{ color: 'var(--color-text-muted)' }}
          />
          <span
            style={{
              color: 'var(--color-text)',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            Chat
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {isConnected
            ? <Wifi size={13} style={{ color: 'var(--color-success)' }} />
            : <WifiOff size={13} style={{ color: 'var(--color-danger)' }} />
          }
          <span
            style={{
              fontSize: '11px',
              color: isConnected
                ? 'var(--color-success)'
                : 'var(--color-danger)',
            }}
          >
            {isConnected ? 'Live' : 'Offline'}
          </span>
        </div>
      </div>

      <div
        style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }}
        className="flex flex-col gap-3"
      >
        {loading && messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p
              style={{
                color: 'var(--color-text-muted)',
                fontSize: '13px',
              }}
            >
              Loading history...
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <MessageSquare
              size={28}
              style={{ color: 'var(--color-border-light)' }}
            />
            <p
              style={{
                color: 'var(--color-text-muted)',
                fontSize: '13px',
                textAlign: 'center',
              }}
            >
              No messages yet.
              <br />Say hello!
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              isOwn={msg.userId === user?.id}
              userColor={getUserColor(msg.userId)}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput
        onSend={onSend}
        disabled={!isConnected}
      />
    </div>
  )
}
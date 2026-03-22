'use client'

import { useEffect, useRef, useState } from 'react'
import { MessageSquare, ChevronDown } from 'lucide-react'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import { useChatStore } from '@/store/chat.store'
import { useEditorStore } from '@/store/editor.store'
import { useAuthStore } from '@/store/auth.store'

interface ChatPanelProps {
  roomId: string
  onSend: (content: string) => void
}

export default function ChatPanel({ roomId, onSend }: ChatPanelProps) {
  const bottomRef   = useRef<HTMLDivElement>(null)
  const scrollRef   = useRef<HTMLDivElement>(null)
  const [showScrollBtn, setShowScrollBtn] = useState(false)

  const user        = useAuthStore(s => s.user)
  const { messages, loading, isConnected } = useChatStore()
  const activeUsers = useEditorStore(s => s.activeUsers)

  const getUserColor = (userId: string) =>
    activeUsers.find(u => u.userId === userId)?.color ?? '#60A5FA'

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    // Only auto-scroll if user is near the bottom
    const el = scrollRef.current
    if (!el) return
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120
    if (nearBottom) scrollToBottom()
  }, [messages])

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80
    setShowScrollBtn(!nearBottom)
  }

  return (
    <div style={{
      width: '300px', flexShrink: 0,
      borderLeft: '1px solid var(--color-border)',
      backgroundColor: 'var(--color-surface)',
      display: 'flex', flexDirection: 'column', height: '100%', position: 'relative',
    }}>
      {/* Header */}
      <div style={{
        borderBottom: '1px solid var(--color-border)',
        padding: '10px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <MessageSquare size={13} style={{ color: 'var(--color-text-muted)' }} />
          <span style={{ color: 'var(--color-text-dim)', fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
            CHAT
          </span>
          {messages.length > 0 && (
            <span style={{
              fontSize: '10px', fontFamily: 'var(--font-mono)',
              color: 'var(--color-text-muted)',
              backgroundColor: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              borderRadius: '10px', padding: '1px 6px',
            }}>
              {messages.length}
            </span>
          )}
        </div>

        {/* Connection indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            backgroundColor: isConnected ? 'var(--color-success)' : 'var(--color-danger)',
            boxShadow: isConnected ? '0 0 6px var(--color-success)' : 'none',
          }} />
          <span style={{
            fontSize: '11px',
            color: isConnected ? 'var(--color-success)' : 'var(--color-danger)',
            fontFamily: 'var(--font-mono)',
          }}>
            {isConnected ? 'Live' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{ flex: 1, overflowY: 'auto', padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 10 }}
      >
        {loading && messages.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              border: '2px solid var(--color-border)',
              borderTopColor: 'var(--color-brand)',
              animation: 'spin 0.8s linear infinite',
            }} />
            <p style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>Loading chat...</p>
          </div>
        ) : messages.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, textAlign: 'center' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'float 3s ease-in-out infinite',
            }}>
              <MessageSquare size={20} style={{ color: 'var(--color-border-light)' }} />
            </div>
            <div>
              <p style={{ color: 'var(--color-text)', fontSize: '13px', fontWeight: 600, marginBottom: 3 }}>No messages yet</p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>Say hello! 👋</p>
            </div>
          </div>
        ) : (
          messages.map(msg => (
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

      {/* Scroll to bottom button */}
      {showScrollBtn && (
        <button
          onClick={scrollToBottom}
          style={{
            position: 'absolute', bottom: 72, right: 12,
            width: 28, height: 28, borderRadius: '50%',
            backgroundColor: 'var(--color-brand)',
            color: 'white', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59,130,246,0.4)',
            animation: 'fadeIn 0.2s ease',
            transition: 'opacity 0.15s, transform 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform = ''}
        >
          <ChevronDown size={14} />
        </button>
      )}

      <ChatInput onSend={onSend} disabled={!isConnected} />
    </div>
  )
}
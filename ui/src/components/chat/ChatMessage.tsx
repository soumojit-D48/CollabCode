'use client'

import { Message } from '@/types'
import { getInitials } from '@/lib/utils'

interface ChatMessageProps {
  message:    Message
  isOwn:      boolean
  userColor?: string
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function ChatMessage({ message, isOwn, userColor = '#60A5FA' }: ChatMessageProps) {
  return (
    <div
      style={{
        display: 'flex', gap: 8,
        flexDirection: isOwn ? 'row-reverse' : 'row',
        animation: 'message-in 0.2s ease both',
      }}
    >
      {/* Avatar — only for others */}
      {!isOwn && (
        <div
          title={message.username}
          style={{
            width: 26, height: 26, borderRadius: '50%',
            backgroundColor: userColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px', fontWeight: 700, color: 'white',
            fontFamily: 'var(--font-mono)', flexShrink: 0, marginTop: 2,
          }}
        >
          {getInitials(message.username)}
        </div>
      )}

      <div style={{
        display: 'flex', flexDirection: 'column', gap: 3, maxWidth: '80%',
        alignItems: isOwn ? 'flex-end' : 'flex-start',
      }}>
        {/* Name + time — others only */}
        {!isOwn && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '11px',
              fontWeight: 700, color: userColor,
            }}>
              {message.username}
            </span>
            <span
              title={formatTime(message.createdAt)}
              style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}
            >
              {timeAgo(message.createdAt)}
            </span>
          </div>
        )}

        {/* Bubble */}
        <div style={{
          backgroundColor: isOwn ? 'var(--color-brand)' : 'var(--color-surface-2)',
          borderRadius: isOwn ? '12px 4px 12px 12px' : '4px 12px 12px 12px',
          border: isOwn ? 'none' : '1px solid var(--color-border)',
          padding: '7px 11px',
          fontSize: '13px', color: 'var(--color-text)',
          wordBreak: 'break-word', lineHeight: 1.55,
          boxShadow: isOwn ? '0 2px 8px rgba(59,130,246,0.2)' : 'none',
        }}>
          {message.content}
        </div>

        {/* Time — own messages */}
        {isOwn && (
          <span
            title={formatTime(message.createdAt)}
            style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}
          >
            {timeAgo(message.createdAt)}
          </span>
        )}
      </div>
    </div>
  )
}
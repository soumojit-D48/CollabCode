'use client'

import { Message } from '@/types'
import { timeAgo, getInitials } from '@/lib/utils'

interface ChatMessageProps {
  message:       Message
  isOwn:         boolean
  userColor?:    string
}

export default function ChatMessage({
  message,
  isOwn,
  userColor = '#60A5FA',
}: ChatMessageProps) {
  return (
    <div
      className={`flex gap-2.5 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {!isOwn && (
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            backgroundColor: userColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 700,
            color: 'white',
            fontFamily: 'var(--font-mono)',
            flexShrink: 0,
            marginTop: 2,
          }}
        >
          {getInitials(message.username)}
        </div>
      )}

      <div
        style={{ maxWidth: '75%' }}
        className={`flex flex-col gap-1 ${isOwn ? 'items-end' : 'items-start'}`}
      >
        {!isOwn && (
          <div className="flex items-center gap-1.5">
            <span
              style={{
                color: userColor,
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              {message.username}
            </span>
            <span
              style={{
                color: 'var(--color-text-muted)',
                fontSize: '10px',
              }}
            >
              {timeAgo(message.createdAt)}
          </span>
        </div>
      )}

      <div
          style={{
            backgroundColor: isOwn
              ? 'var(--color-brand)'
              : 'var(--color-surface-2)',
            borderRadius: isOwn
              ? '12px 12px 4px 12px'
              : '12px 12px 12px 4px',
            padding: '8px 12px',
            fontSize: '13px',
            color: 'var(--color-text)',
            wordBreak: 'break-word',
            lineHeight: '1.5',
          }}
        >
          {message.content}
        </div>

        {/* Own message timestamp */}
        {isOwn && (
          <span
            style={{
              color: 'var(--color-text-muted)',
              fontSize: '10px',
            }}
          >
            {timeAgo(message.createdAt)}
          </span>
        )}
      </div>
    </div>
  )
}
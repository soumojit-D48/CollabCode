'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSend:    (content: string) => void
  disabled?: boolean
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('')
  const MAX_CHARS = 2000

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const remaining = MAX_CHARS - value.length
  const isNearLimit = remaining < 200
  const canSend = value.trim().length > 0 && !disabled

  return (
    <div style={{
      borderTop: '1px solid var(--color-border)',
      padding: '10px',
      backgroundColor: 'var(--color-surface)',
      flexShrink: 0,
    }}>
      <div style={{
        backgroundColor: 'var(--color-surface-2)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        display: 'flex', alignItems: 'flex-end', gap: 6,
        padding: '8px 8px 8px 12px',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
        onFocusCapture={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = 'rgba(99,102,241,0.5)'
          el.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.08)'
        }}
        onBlurCapture={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = 'var(--color-border)'
          el.style.boxShadow = 'none'
        }}
      >
        <textarea
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Connecting...' : 'Message... (Enter to send)'}
          disabled={disabled}
          rows={1}
          maxLength={MAX_CHARS}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: 'var(--color-text)', fontSize: '13px',
            fontFamily: 'var(--font-sans)', resize: 'none', lineHeight: '1.5',
            maxHeight: '80px', overflowY: 'auto',
          }}
        />
        <button
          onClick={handleSend}
          disabled={!canSend}
          style={{
            backgroundColor: canSend ? 'var(--color-brand)' : 'var(--color-surface-3)',
            borderRadius: 'var(--radius-sm)', padding: '5px 6px',
            color: canSend ? 'white' : 'var(--color-text-muted)',
            border: 'none', cursor: canSend ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s', flexShrink: 0,
            boxShadow: canSend ? '0 0 10px rgba(59,130,246,0.3)' : 'none',
          }}
          onMouseEnter={e => { if (canSend) e.currentTarget.style.opacity = '0.85' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
        >
          <Send size={13} />
        </button>
      </div>

      {/* Footer hints */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, padding: '0 2px' }}>
        <span style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>
          Shift+Enter for new line
        </span>
        {isNearLimit && (
          <span style={{
            fontSize: '10px', fontFamily: 'var(--font-mono)',
            color: remaining < 50 ? 'var(--color-danger)' : 'var(--color-warning)',
          }}>
            {remaining}
          </span>
        )}
      </div>
    </div>
  )
}
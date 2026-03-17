'use client'

import { useState, KeyboardEvent } from 'react'
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSend:      (content: string) => void
  disabled?:   boolean
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('')

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

  return (
    <div
      style={{
        borderTop: '1px solid var(--color-border)',
        padding: '12px',
        backgroundColor: 'var(--color-surface)',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--color-surface-2)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'flex-end',
          gap: 8,
          padding: '8px 10px',
        }}
      >
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message... (Enter to send)"
          disabled={disabled}
          rows={1}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--color-text)',
            fontSize: '13px',
            fontFamily: 'var(--font-sans)',
            resize: 'none',
            lineHeight: '1.5',
            maxHeight: '80px',
            overflowY: 'auto',
          }}
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          style={{
            backgroundColor: value.trim() && !disabled
              ? 'var(--color-brand)'
              : 'var(--color-surface-3)',
            borderRadius: 'var(--radius-sm)',
            padding: '5px',
            color: value.trim() && !disabled
              ? 'white'
              : 'var(--color-text-muted)',
            transition: 'all 0.15s',
            flexShrink: 0,
          }}
        >
          <Send size={14} />
        </button>
      </div>
      <p
        style={{
          color: 'var(--color-text-muted)',
          fontSize: '10px',
          marginTop: '4px',
          paddingLeft: '2px',
        }}
      >
        Shift+Enter for new line
      </p>
    </div>
  )
}
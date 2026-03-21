'use client'

import { useState } from 'react'
import { X, FilePlus } from 'lucide-react'

interface NewFileModalProps {
  onClose:  () => void
  onCreate: (name: string, path: string) => void
}

export default function NewFileModal({ onClose, onCreate }: NewFileModalProps) {
  const [name,  setName]  = useState('')
  const [error, setError] = useState('')

  const handleCreate = () => {
    const trimmed = name.trim()
    if (!trimmed) { setError('File name is required'); return }
    if (!/^[\w\-. /]+$/.test(trimmed)) {
      setError('Invalid characters in file name')
      return
    }

    const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
    const fileName = trimmed.split('/').pop() ?? trimmed

    onCreate(fileName, path)
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreate()
    if (e.key === 'Escape') onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          border:          '1px solid var(--color-border)',
          borderRadius:    'var(--radius-lg)',
          width:           '100%',
          maxWidth:        '400px',
        }}
      >
        {/* Header */}
        <div
          style={{ borderBottom: '1px solid var(--color-border)' }}
          className="flex items-center justify-between px-5 py-3.5"
        >
          <div className="flex items-center gap-2">
            <FilePlus size={15} style={{ color: 'var(--color-brand)' }} />
            <h2 style={{ color: 'var(--color-text)', fontSize: '14px', fontWeight: 600 }}>
              New File
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ color: 'var(--color-text-muted)' }}
            className="hover:text-[var(--color-text)]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <label
            style={{ color: 'var(--color-text-dim)', fontSize: '13px', fontWeight: 500 }}
            className="block mb-1.5"
          >
            File name or path
          </label>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError('') }}
            onKeyDown={handleKeyDown}
            placeholder="index.ts or src/utils/helper.ts"
            style={{
              backgroundColor: 'var(--color-surface-2)',
              border:          `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
              borderRadius:    'var(--radius-md)',
              color:           'var(--color-text)',
              fontFamily:      'var(--font-mono)',
              fontSize:        '13px',
              width:           '100%',
              padding:         '8px 12px',
              outline:         'none',
            }}
          />
          {error && (
            <p style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: 4 }}>
              {error}
            </p>
          )}
          <p style={{ color: 'var(--color-text-muted)', fontSize: '11px', marginTop: 6 }}>
            Use / for folders — e.g. src/components/Button.tsx
          </p>

          <div className="flex gap-3 mt-4">
            <button
              onClick={onClose}
              style={{
                flex:            1,
                backgroundColor: 'var(--color-surface-2)',
                border:          '1px solid var(--color-border)',
                borderRadius:    'var(--radius-md)',
                color:           'var(--color-text-dim)',
                padding:         '8px',
                fontSize:        '13px',
                cursor:          'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              style={{
                flex:            1,
                backgroundColor: 'var(--color-brand)',
                borderRadius:    'var(--radius-md)',
                color:           'white',
                padding:         '8px',
                fontSize:        '13px',
                fontWeight:      600,
                cursor:          'pointer',
                border:          'none',
              }}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
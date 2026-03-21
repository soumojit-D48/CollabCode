'use client'

import { Play, Loader2 } from 'lucide-react'
import { useExecutionStore } from '@/store/execution.store'

interface RunButtonProps {
  onClick: () => void
}

export default function RunButton({ onClick }: RunButtonProps) {
  const loading = useExecutionStore((s) => s.loading)

  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        backgroundColor: loading ? 'var(--color-surface-3)' : '#16a34a',
        borderRadius: 'var(--radius-md)',
        color: 'white',
        border: 'none',
        padding: '4px 12px',
        fontSize: '12px',
        fontWeight: 600,
        fontFamily: 'var(--font-mono)',
        cursor: loading ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'opacity 0.15s',
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading
        ? <Loader2 size={13} className="animate-spin" />
        : <Play size={13} />
      }
      {loading ? 'Running...' : 'Run'}
    </button>
  )
}
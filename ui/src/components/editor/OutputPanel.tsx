'use client'

import { X, CheckCircle, XCircle, Clock, Cpu } from 'lucide-react'
import { useExecutionStore } from '@/store/execution.store'

export default function OutputPanel() {
  const { result, error, loading, isOpen, close } = useExecutionStore()

  if (!isOpen) return null

  const isSuccess = result?.exitCode === 0
  const hasOutput = result?.stdout || result?.stderr

  return (
    <div
      style={{
        borderTop: '1px solid var(--color-border)',
        backgroundColor: '#0d1117',
        display: 'flex',
        flexDirection: 'column',
        height: '220px',
        flexShrink: 0,
      }}
    >
      {/* Panel header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 12px',
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
        }}
      >
        <div className="flex items-center gap-3">
          <span
            style={{
              color: 'var(--color-text-dim)',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
            }}
          >
            Output
          </span>

          {/* Status badge */}
          {result && !loading && (
            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-1"
                style={{
                  color: isSuccess
                    ? 'var(--color-success)'
                    : 'var(--color-danger)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {isSuccess
                  ? <CheckCircle size={12} />
                  : <XCircle size={12} />
                }
                {result.status}
              </div>

              {/* Time */}
              <div
                className="flex items-center gap-1"
                style={{
                  color: 'var(--color-text-muted)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <Clock size={11} />
                {result.time}s
              </div>

              {/* Memory */}
              <div
                className="flex items-center gap-1"
                style={{
                  color: 'var(--color-text-muted)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <Cpu size={11} />
                {result.memory} KB
              </div>
            </div>
          )}
        </div>

        {/* Close */}
        <button
          onClick={close}
          style={{ color: 'var(--color-text-muted)' }}
          className="hover:text-[var(--color-text)] transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Output content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px 14px',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          lineHeight: '1.6',
        }}
      >
        {/* Loading */}
        {loading && (
          <span style={{ color: 'var(--color-text-muted)' }}>
            Running code...
          </span>
        )}

        {/* API / network error */}
        {!loading && error && (
          <span style={{ color: 'var(--color-danger)' }}>
            Error: {error}
          </span>
        )}

        {/* stdout */}
        {!loading && result?.stdout && (
          <pre style={{ color: '#d1fae5', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {result.stdout}
          </pre>
        )}

        {/* stderr */}
        {!loading && result?.stderr && (
          <pre style={{ color: '#fca5a5', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {result.stderr}
          </pre>
        )}

        {/* No output */}
        {!loading && !error && result && !result.stdout && !result.stderr && (
          <span style={{ color: 'var(--color-text-muted)' }}>
            No output
          </span>
        )}
      </div>
    </div>
  )
}
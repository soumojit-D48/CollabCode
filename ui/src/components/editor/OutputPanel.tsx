'use client'

import { X, CheckCircle, XCircle, Clock, Cpu, Terminal } from 'lucide-react'
import { useExecutionStore } from '@/store/execution.store'

export default function OutputPanel() {
  const { result, error, loading, isOpen, close } = useExecutionStore()

  if (!isOpen) return null

  const isSuccess = result?.exitCode === 0

  return (
    <div style={{
      borderTop: '1px solid var(--color-border)',
      backgroundColor: '#0d1117',
      display: 'flex', flexDirection: 'column',
      height: '200px', flexShrink: 0,
      animation: 'fadeInUp 0.2s ease both',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 12px', borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)', flexShrink: 0,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Animated loading bar */}
        {loading && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
            backgroundColor: 'var(--color-surface-3)', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', height: '100%',
              background: 'linear-gradient(90deg, transparent, var(--color-brand), transparent)',
              animation: 'loading-bar 1.2s ease-in-out infinite',
            }} />
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              color: 'var(--color-text-dim)', fontSize: '13px',
              fontFamily: 'var(--font-mono)', fontWeight: 700,
            }}>
              &gt;_ OUTPUT
            </span>
          </div>

          {/* Status pills */}
          {result && !loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 4,
                backgroundColor: isSuccess ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                border: `1px solid ${isSuccess ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                borderRadius: '10px', padding: '2px 8px',
                color: isSuccess ? 'var(--color-success)' : 'var(--color-danger)',
                fontSize: '11px', fontFamily: 'var(--font-mono)',
              }}>
                {isSuccess
                  ? <CheckCircle size={10} />
                  : <XCircle size={10} />
                }
                {result.status ?? (isSuccess ? 'Success' : 'Error')}
              </div>

              {result.time !== undefined && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 3,
                  color: 'var(--color-text-muted)', fontSize: '11px', fontFamily: 'var(--font-mono)',
                }}>
                  <Clock size={10} />
                  {result.time}s
                </div>
              )}
              {result.memory !== undefined && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 3,
                  color: 'var(--color-text-muted)', fontSize: '11px', fontFamily: 'var(--font-mono)',
                }}>
                  <Cpu size={10} />
                  {result.memory} KB
                </div>
              )}
            </div>
          )}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                border: '1.5px solid var(--color-border)',
                borderTopColor: 'var(--color-brand)',
                animation: 'spin 0.7s linear infinite',
              }} />
              <span style={{ color: 'var(--color-text-muted)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                Running...
              </span>
            </div>
          )}
        </div>

        <button
          onClick={close}
          style={{
            color: 'var(--color-text-muted)', background: 'none', border: 'none',
            cursor: 'pointer', padding: '3px', borderRadius: 'var(--radius-sm)',
            display: 'flex', alignItems: 'center',
            transition: 'color 0.15s, background 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'var(--color-text)'
            e.currentTarget.style.backgroundColor = 'var(--color-surface-2)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--color-text-muted)'
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <X size={13} />
        </button>
      </div>

      {/* Content */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '10px 14px',
        fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.6,
      }}>
        {!loading && error && (
          <span style={{ color: 'var(--color-danger)' }}>Error: {error}</span>
        )}
        {!loading && result?.stdout && (
          <pre style={{ color: '#d1fae5', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {result.stdout}
          </pre>
        )}
        {!loading && result?.stderr && (
          <pre style={{ color: '#fca5a5', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginTop: result?.stdout ? '8px' : 0 }}>
            {result.stderr}
          </pre>
        )}
        {!loading && !error && result && !result.stdout && !result.stderr && (
          <span style={{ color: 'var(--color-text-muted)' }}>No output</span>
        )}
      </div>
    </div>
  )
}
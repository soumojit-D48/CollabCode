'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', backgroundColor: 'var(--color-bg)',
      padding: '24px', position: 'relative', overflow: 'hidden',
    }}>
      {/* BG orb */}
      <div style={{
        position: 'absolute', top: '25%', left: '30%',
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
        animation: 'orb-1 14s ease-in-out infinite',
      }} />

      <div style={{ textAlign: 'center', animation: 'fadeInUp 0.5s ease both', position: 'relative' }}>
        {/* Glitch 404 */}
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 'clamp(80px, 15vw, 140px)',
          fontWeight: 900, lineHeight: 1,
          background: 'linear-gradient(135deg, #3B82F6, #6366F1, #8B5CF6)',
          backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent',
          marginBottom: 16,
          animation: 'glitch 4s ease-in-out infinite',
        }}>
          404
        </div>

        <h1 style={{
          color: 'var(--color-text)', fontSize: '20px', fontWeight: 700, marginBottom: 8,
        }}>
          Page not found
        </h1>
        <p style={{
          color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: 32, lineHeight: 1.6,
        }}>
          Looks like this room doesn&apos;t exist — or maybe it was deleted.
        </p>

        <Link href="/rooms" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-text)', textDecoration: 'none',
          padding: '10px 20px', fontSize: '14px', fontWeight: 500,
          transition: 'border-color 0.15s, background 0.15s',
        }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--color-brand)'
            e.currentTarget.style.backgroundColor = 'var(--color-surface-2)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--color-border)'
            e.currentTarget.style.backgroundColor = 'var(--color-surface)'
          }}
        >
          <ArrowLeft size={15} />
          Back to Rooms
        </Link>
      </div>
    </div>
  )
}

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Code2, Zap, Globe, MessageSquare, ArrowRight, Github, Users, Play } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'

const FEATURES = [
  {
    icon: Zap,
    title: 'Real-Time Sync',
    desc: 'Every keystroke synced instantly across all collaborators. No lag, no conflicts — powered by Socket.IO and Redis.',
    color: '#F59E0B',
    glow: 'rgba(245,158,11,0.15)',
  },
  {
    icon: Globe,
    title: 'Multi-Language',
    desc: 'Write in TypeScript, Python, Go, Rust, Java, C++ and more. Each room has its own language and execution environment.',
    color: '#3B82F6',
    glow: 'rgba(59,130,246,0.15)',
  },
  {
    icon: MessageSquare,
    title: 'Room Chat',
    desc: 'Built-in real-time chat in every room. History persists so you never miss context when you reconnect.',
    color: '#22C55E',
    glow: 'rgba(34,197,94,0.15)',
  },
]

const STATS = [
  { value: '8', label: 'Languages' },
  { value: '<10ms', label: 'Sync latency' },
  { value: '∞', label: 'Rooms' },
]

const CODE_SNIPPET = `// CollabCode — real-time magic ✨
import { socket } from './collab'

socket.on('file:updated', ({ fileId, content }) => {
  editor.updateFile(fileId, content)
  cursors.sync()
})

socket.emit('code:change', {
  roomId, fileId, content
})`

export default function LandingPage() {
  const router = useRouter()
  const { hydrate, user } = useAuthStore()

  useEffect(() => {
    hydrate()
  }, [])



  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ─── NAVBAR ─── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        backgroundColor: 'rgba(10,10,15,0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border)',
        height: '60px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
            borderRadius: 'var(--radius-md)', padding: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(99,102,241,0.4)',
          }}>
            <Code2 size={18} color="white" />
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)', color: 'var(--color-text)',
            fontSize: '16px', fontWeight: 700,
          }}>
            CollabCode
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {!user && (
            <>
              <Link href="/login" style={{
                color: 'var(--color-text-muted)', fontSize: '14px',
                textDecoration: 'none', padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                transition: 'color 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
              >
                Log in
              </Link>
              <Link href="/register" style={{
                background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                color: 'white', fontSize: '14px', fontWeight: 600,
                textDecoration: 'none', padding: '8px 20px',
                borderRadius: 'var(--radius-md)',
                transition: 'opacity 0.15s',
                boxShadow: '0 0 16px rgba(99,102,241,0.3)',
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Get Started
              </Link>
            </>
          )}
          {user && (
            <Link href="/rooms" style={{
              background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
              color: 'white', fontSize: '14px', fontWeight: 600,
              textDecoration: 'none', padding: '8px 20px',
              borderRadius: 'var(--radius-md)',
              transition: 'opacity 0.15s',
              boxShadow: '0 0 16px rgba(99,102,241,0.3)',
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Go to Rooms
            </Link>
          )}
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', position: 'relative',
        padding: '120px 24px 80px',
        overflow: 'hidden',
      }}>
        {/* Background orbs */}
        <div style={{
          position: 'absolute', top: '15%', left: '10%',
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
          animation: 'orb-1 12s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '8%',
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
          animation: 'orb-2 15s ease-in-out infinite',
        }} />
        {/* Subtle grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(var(--color-border) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-border) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          opacity: 0.3,
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)',
        }} />

        <div style={{
          maxWidth: 1100, width: '100%', margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 64, alignItems: 'center',
        }}>
          {/* Left: Text */}
          <div style={{ animation: 'fadeInUp 0.6s ease both' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              border: '1px solid rgba(99,102,241,0.4)',
              backgroundColor: 'rgba(99,102,241,0.08)',
              borderRadius: '20px', padding: '6px 14px',
              marginBottom: 24,
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                backgroundColor: '#22C55E',
                boxShadow: '0 0 6px #22C55E',
                animation: 'pulse-glow 2s ease-in-out infinite',
              }} />
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '12px',
                color: '#818CF8',
              }}>
                Open source · Self-hostable
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(36px, 5vw, 62px)', fontWeight: 800,
              lineHeight: 1.1, marginBottom: 20, color: 'transparent',
              backgroundImage: 'linear-gradient(135deg, #E2E8F0 0%, #94A3B8 50%, #E2E8F0 100%)',
              backgroundClip: 'text', WebkitBackgroundClip: 'text',
              backgroundSize: '200% auto',
              animation: 'gradient-x 4s linear infinite',
            }}>
              Code Together.<br />
              <span style={{
                backgroundImage: 'linear-gradient(135deg, #3B82F6, #6366F1, #8B5CF6)',
                backgroundClip: 'text', WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}>
                In Real Time.
              </span>
            </h1>

            <p style={{
              color: 'var(--color-text-muted)', fontSize: '17px',
              lineHeight: 1.7, marginBottom: 36, maxWidth: 480,
            }}>
              Create a room, share the link. See every keystroke, every cursor, every message — instantly.
              No installations. No complex setup. Just code.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/register" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                color: 'white', textDecoration: 'none',
                padding: '13px 28px', borderRadius: 'var(--radius-md)',
                fontSize: '15px', fontWeight: 600,
                boxShadow: '0 0 24px rgba(99,102,241,0.4)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 0 32px rgba(99,102,241,0.55)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = ''
                  e.currentTarget.style.boxShadow = '0 0 24px rgba(99,102,241,0.4)'
                }}
              >
                Start for free
                <ArrowRight size={16} />
              </Link>
              <Link href="/login" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)', textDecoration: 'none',
                padding: '13px 24px', borderRadius: 'var(--radius-md)',
                fontSize: '15px', fontWeight: 500,
                transition: 'border-color 0.15s, background 0.15s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--color-border-light)'
                  e.currentTarget.style.backgroundColor = 'var(--color-surface-2)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--color-border)'
                  e.currentTarget.style.backgroundColor = 'var(--color-surface)'
                }}
              >
                Sign in
              </Link>
            </div>
          </div>

          {/* Right: Code card */}
          <div style={{ animation: 'fadeInUp 0.6s ease 0.15s both' }}>
            <div style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)',
              animation: 'float-slow 8s ease-in-out infinite',
            }}>
              {/* Window chrome */}
              <div style={{
                backgroundColor: 'var(--color-surface-2)',
                borderBottom: '1px solid var(--color-border)',
                padding: '10px 16px',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['#EF4444','#F59E0B','#22C55E'].map(c => (
                    <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: c }} />
                  ))}
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '12px',
                  color: 'var(--color-text-muted)', flex: 1, textAlign: 'center',
                }}>
                  collab.ts
                </span>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontSize: '11px', color: '#22C55E',
                  fontFamily: 'var(--font-mono)',
                }}>
                  <div style={{
                    width: 5, height: 5, borderRadius: '50%', backgroundColor: '#22C55E',
                    boxShadow: '0 0 5px #22C55E',
                  }} />
                  3 users online
                </div>
              </div>
              {/* Code */}
              <pre style={{
                margin: 0, padding: '20px 20px',
                fontFamily: 'var(--font-mono)', fontSize: '13px',
                lineHeight: 1.7, color: '#CBD5E1',
                overflowX: 'auto',
              }}>
                <code>{CODE_SNIPPET.split('\n').map((line, i) => {
                  if (line.startsWith('//')) return <span key={i} style={{ color: '#475569' }}>{line}{'\n'}</span>
                  if (line.includes('socket.on') || line.includes('socket.emit')) return <span key={i}><span style={{ color: '#6366F1' }}>socket</span><span style={{ color: '#64748B' }}>.</span><span style={{ color: '#3B82F6' }}>{line.includes('.on(') ? 'on' : 'emit'}</span>{line.slice(line.indexOf('('))}{'\n'}</span>
                  if (line.includes('import')) return <span key={i}><span style={{ color: '#8B5CF6' }}>import</span>{line.slice(6)}{'\n'}</span>
                  if (line.includes('=>')) return <span key={i} style={{ color: '#94A3B8' }}>{line}{'\n'}</span>
                  return <span key={i} style={{ color: '#CBD5E1' }}>{line}{'\n'}</span>
                })}</code>
              </pre>
              {/* Live cursors overlay */}
              <div style={{
                borderTop: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface-2)',
                padding: '10px 16px',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                {[
                  { name: 'alice', color: '#F87171' },
                  { name: 'bob', color: '#34D399' },
                  { name: 'carol', color: '#60A5FA' },
                ].map(u => (
                  <div key={u.name} style={{
                    display: 'flex', alignItems: 'center', gap: 5, fontSize: '11px',
                    fontFamily: 'var(--font-mono)', color: u.color,
                  }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      backgroundColor: u.color, opacity: 0.85,
                    }} />
                    {u.name}
                  </div>
                ))}
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginLeft: 'auto', fontFamily: 'var(--font-mono)' }}>
                  editing live
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section style={{
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        padding: '28px 24px',
      }}>
        <div style={{
          maxWidth: 800, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 32, textAlign: 'center',
        }}>
          {STATS.map(s => (
            <div key={s.label}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '32px', fontWeight: 800,
                background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent',
                marginBottom: 4,
              }}>
                {s.value}
              </div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{
              fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 800,
              color: 'var(--color-text)', marginBottom: 12,
            }}>
              Everything you need to code together
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '16px', maxWidth: 480, margin: '0 auto' }}>
              A complete real-time collaboration stack — no plugins, no extensions, just open the browser.
            </p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
          }}>
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} feature={f} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA STRIP ─── */}
      <section style={{
        padding: '80px 24px',
        borderTop: '1px solid var(--color-border)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(99,102,241,0.07) 0%, transparent 70%)',
        }} />
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <h2 style={{
            fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 800,
            color: 'var(--color-text)', marginBottom: 12,
          }}>
            Start coding in seconds
          </h2>
          <p style={{
            color: 'var(--color-text-muted)', fontSize: '16px', marginBottom: 32,
          }}>
            Create a free account, open a room, and share the link. No setup required.
          </p>
          <Link href="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
            color: 'white', textDecoration: 'none',
            padding: '14px 36px', borderRadius: 'var(--radius-md)',
            fontSize: '16px', fontWeight: 700,
            boxShadow: '0 0 32px rgba(99,102,241,0.4)',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 0 48px rgba(99,102,241,0.55)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = ''
              e.currentTarget.style.boxShadow = '0 0 32px rgba(99,102,241,0.4)'
            }}
          >
            Create free account
            <ArrowRight size={18} />
          </Link>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: 16 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--color-brand)', textDecoration: 'none', fontWeight: 500 }}>
              Sign in
            </Link>
          </p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        borderTop: '1px solid var(--color-border)',
        padding: '20px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
            borderRadius: 'var(--radius-sm)', padding: '4px',
          }}>
            <Code2 size={12} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-text-muted)' }}>
            CollabCode
          </span>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)' }}>
          Real-time collaboration, redefined.
        </span>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}

function FeatureCard({ feature, delay }: { feature: typeof FEATURES[0]; delay: number }) {
  const Icon = feature.icon
  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 24px',
        position: 'relative', overflow: 'hidden',
        cursor: 'default',
        transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
        animation: `fadeInUp 0.6s ease ${delay}s both`,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = feature.color + '60'
        el.style.transform = 'translateY(-3px)'
        el.style.boxShadow = `0 16px 40px ${feature.glow}`
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'var(--color-border)'
        el.style.transform = ''
        el.style.boxShadow = ''
      }}
    >
      {/* Glow spot */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: `linear-gradient(90deg, transparent, ${feature.color}60, transparent)`,
      }} />

      <div style={{
        width: 44, height: 44, borderRadius: 'var(--radius-md)',
        backgroundColor: feature.glow,
        border: `1px solid ${feature.color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 16,
      }}>
        <Icon size={20} style={{ color: feature.color }} />
      </div>

      <h3 style={{
        color: 'var(--color-text)', fontSize: '16px', fontWeight: 700,
        marginBottom: 8,
      }}>
        {feature.title}
      </h3>
      <p style={{
        color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: 1.65,
      }}>
        {feature.desc}
      </p>
    </div>
  )
}
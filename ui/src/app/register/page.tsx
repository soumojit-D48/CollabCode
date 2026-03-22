'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Loader2, Eye, EyeOff, Code2, ArrowRight, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'

const registerSchema = z.object({
  email:    z.string().email('Invalid email'),
  username: z.string()
    .min(3, 'At least 3 characters')
    .max(30, 'Max 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers and underscores only'),
  password: z.string().min(8, 'At least 8 characters'),
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const { register: registerUser, loading, error, clearError, hydrate, user } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => { hydrate() }, [])
  useEffect(() => { if (user) router.replace('/rooms') }, [user])

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    clearError()
    try {
      await registerUser(data.email, data.username, data.password)
      router.push('/rooms')
    } catch {}
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', backgroundColor: 'var(--color-bg)',
      padding: '24px', position: 'relative', overflow: 'hidden',
    }}>
      {/* BG orbs */}
      <div style={{
        position: 'absolute', top: '10%', right: '15%',
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
        animation: 'orb-2 14s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', left: '8%',
        width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
        animation: 'orb-1 18s ease-in-out infinite',
      }} />

      <div style={{ width: '100%', maxWidth: 420, animation: 'fadeInUp 0.5s ease both', position: 'relative' }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{
            background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
            borderRadius: 'var(--radius-md)', padding: '8px',
            boxShadow: '0 0 16px rgba(99,102,241,0.4)',
          }}>
            <Code2 size={20} color="white" />
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)', color: 'var(--color-text)',
            fontSize: '18px', fontWeight: 700,
          }}>
            CollabCode
          </span>
        </Link>

        {/* Card */}
        <div style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px',
          boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
        }}>
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ color: 'var(--color-text)', fontSize: '22px', fontWeight: 700, marginBottom: 4 }}>
              Create account
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
              Start coding together in seconds
            </p>
          </div>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              backgroundColor: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 12px', marginBottom: 16,
              animation: 'fadeIn 0.2s ease',
            }}>
              <AlertCircle size={14} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />
              <span style={{ color: 'var(--color-danger)', fontSize: '13px' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <FormField label="Email" error={errors.email?.message}>
              <input
                {...register('email')} type="email"
                placeholder="you@example.com" autoComplete="email"
                style={inputStyle(!!errors.email)}
                onFocus={e => applyFocusStyle(e.currentTarget, !!errors.email)}
                onBlur={e => removeFocusStyle(e.currentTarget, !!errors.email)}
              />
            </FormField>

            <FormField label="Username" error={errors.username?.message}>
              <input
                {...register('username')} type="text"
                placeholder="dev_username" autoComplete="username"
                style={inputStyle(!!errors.username)}
                onFocus={e => applyFocusStyle(e.currentTarget, !!errors.username)}
                onBlur={e => removeFocusStyle(e.currentTarget, !!errors.username)}
              />
              <p style={{ color: 'var(--color-text-muted)', fontSize: '11px', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                3–30 chars, letters · numbers · underscores
              </p>
            </FormField>

            <FormField label="Password" error={errors.password?.message}>
              <div style={{ position: 'relative' }}>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="min 8 characters" autoComplete="new-password"
                  style={{ ...inputStyle(!!errors.password), paddingRight: '42px' }}
                  onFocus={e => applyFocusStyle(e.currentTarget, !!errors.password)}
                  onBlur={e => removeFocusStyle(e.currentTarget, !!errors.password)}
                />
                <button
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--color-text-muted)', background: 'none', border: 'none',
                    cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </FormField>

            <button
              type="submit" disabled={loading}
              style={{
                marginTop: 4,
                background: loading ? 'var(--color-brand-dim)' : 'linear-gradient(135deg, #3B82F6, #6366F1)',
                borderRadius: 'var(--radius-md)', color: 'white',
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                padding: '11px 0', fontSize: '14px', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'opacity 0.15s',
                boxShadow: loading ? 'none' : '0 0 16px rgba(99,102,241,0.35)',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.9' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >
              {loading && <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />}
              {loading ? 'Creating account...' : (<>Create account <ArrowRight size={14} /></>)}
            </button>
          </form>
        </div>

        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', textAlign: 'center', marginTop: 20 }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--color-brand)', fontWeight: 500, textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ color: 'var(--color-text-dim)', fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      {children}
      {error && (
        <p style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: 4 }}>{error}</p>
      )}
    </div>
  )
}

function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    width: '100%', boxSizing: 'border-box',
    backgroundColor: 'var(--color-surface-2)',
    border: `1px solid ${hasError ? 'rgba(239,68,68,0.6)' : 'var(--color-border)'}`,
    borderRadius: 'var(--radius-md)',
    color: 'var(--color-text)', fontFamily: 'var(--font-mono)',
    fontSize: '14px', padding: '10px 12px', outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  }
}

function applyFocusStyle(el: HTMLInputElement, hasError: boolean) {
  el.style.borderColor = hasError ? 'var(--color-danger)' : 'rgba(99,102,241,0.7)'
  el.style.boxShadow = hasError ? '0 0 0 3px rgba(239,68,68,0.1)' : '0 0 0 3px rgba(99,102,241,0.12)'
}

function removeFocusStyle(el: HTMLInputElement, hasError: boolean) {
  el.style.borderColor = hasError ? 'rgba(239,68,68,0.6)' : 'var(--color-border)'
  el.style.boxShadow = 'none'
}
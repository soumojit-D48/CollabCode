'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Loader2, Eye, EyeOff, Code2 } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'

const registerSchema = z.object({
  email:    z.string().email('Invalid email'),
  username: z
    .string()
    .min(3, 'At least 3 characters')
    .max(30, 'Max 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers and underscores only'),
  password: z.string().min(8, 'At least 8 characters'),
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router   = useRouter()
  const { register: registerUser, loading, error, clearError, hydrate, user } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    hydrate()
  }, [])

  useEffect(() => {
    if (user) router.replace('/rooms')
  }, [user])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (data: RegisterForm) => {
    clearError()
    try {
      await registerUser(data.email, data.username, data.password)
      router.push('/rooms')
    } catch {
      // error set in store
    }
  }

  return (
    <div
      style={{ backgroundColor: 'var(--color-bg)' }}
      className="min-h-screen flex items-center justify-center px-4"
    >
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div
            style={{
              backgroundColor: 'var(--color-brand)',
              borderRadius: 'var(--radius-md)',
            }}
            className="p-2"
          >
            <Code2 size={22} color="white" />
          </div>
          <span
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }}
            className="text-xl font-bold"
          >
            CollabCode
          </span>
        </div>

        {/* Card */}
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
          }}
          className="p-8"
        >
          <h1
            style={{ color: 'var(--color-text)' }}
            className="text-2xl font-bold mb-1"
          >
            Create account
          </h1>
          <p
            style={{ color: 'var(--color-text-muted)' }}
            className="text-sm mb-6"
          >
            Start coding together in seconds
          </p>

          {/* Global error */}
          {error && (
            <div
              style={{
                backgroundColor: '#2D1B1B',
                border: '1px solid var(--color-danger)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-danger)',
              }}
              className="p-3 text-sm mb-4"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Email */}
            <div>
              <label
                style={{ color: 'var(--color-text-dim)' }}
                className="block text-sm font-medium mb-1.5"
              >
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                style={{
                  backgroundColor: 'var(--color-surface-2)',
                  border: `1px solid ${errors.email ? 'var(--color-danger)' : 'var(--color-border)'}`,
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text)',
                  fontFamily: 'var(--font-mono)',
                }}
                className="w-full px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-brand)]"
              />
              {errors.email && (
                <p style={{ color: 'var(--color-danger)' }} className="text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Username */}
            <div>
              <label
                style={{ color: 'var(--color-text-dim)' }}
                className="block text-sm font-medium mb-1.5"
              >
                Username
              </label>
              <input
                {...register('username')}
                type="text"
                placeholder="dev_username"
                autoComplete="username"
                style={{
                  backgroundColor: 'var(--color-surface-2)',
                  border: `1px solid ${errors.username ? 'var(--color-danger)' : 'var(--color-border)'}`,
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text)',
                  fontFamily: 'var(--font-mono)',
                }}
                className="w-full px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-brand)]"
              />
              {errors.username && (
                <p style={{ color: 'var(--color-danger)' }} className="text-xs mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                style={{ color: 'var(--color-text-dim)' }}
                className="block text-sm font-medium mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="min 8 characters"
                  autoComplete="new-password"
                  style={{
                    backgroundColor: 'var(--color-surface-2)',
                    border: `1px solid ${errors.password ? 'var(--color-danger)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text)',
                    fontFamily: 'var(--font-mono)',
                  }}
                  className="w-full px-3 py-2.5 pr-10 text-sm outline-none transition-colors focus:border-[var(--color-brand)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ color: 'var(--color-text-muted)' }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-[var(--color-text)]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p style={{ color: 'var(--color-danger)' }} className="text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: loading ? 'var(--color-brand-dim)' : 'var(--color-brand)',
                borderRadius: 'var(--radius-md)',
                color: 'white',
              }}
              className="w-full py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p
          style={{ color: 'var(--color-text-muted)' }}
          className="text-sm text-center mt-4"
        >
          Already have an account?{' '}
          <Link
            href="/login"
            style={{ color: 'var(--color-brand)' }}
            className="font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
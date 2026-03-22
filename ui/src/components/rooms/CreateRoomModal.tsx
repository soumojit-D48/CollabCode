'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Loader2 } from 'lucide-react'
import { useRoomStore } from '@/store/room.store'
import { useRouter } from 'next/navigation'
import { Language } from '@/types'

const LANGUAGES: Language[] = [
  'javascript','typescript','python',
  'go','rust','java','cpp','c',
]

const createRoomSchema = z.object({
  name:     z.string().min(3, 'At least 3 characters').max(50, 'Max 50 characters'),
  language: z.enum(['javascript','typescript','python','go','rust','java','cpp','c']),
  isPublic: z.boolean(),
})

type CreateRoomForm = z.infer<typeof createRoomSchema>

interface CreateRoomModalProps {
  onClose: () => void
}

export default function CreateRoomModal({ onClose }: CreateRoomModalProps) {
  const router = useRouter()
  const { createRoom, loading } = useRoomStore()
  const [visibility, setVisibility] = useState<'private' | 'public'>('private')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateRoomForm>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: { language: 'typescript', isPublic: false },
  })

  const onSubmit = async (data: CreateRoomForm) => {
    try {
      const room = await createRoom({ ...data, isPublic: visibility === 'public' })
      onClose()
      router.push(`/room/${room.id}`)
    } catch {}
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          border:          '1px solid var(--color-border)',
          borderRadius:    'var(--radius-lg)',
          width:           '100%',
          maxWidth:        '460px',
          boxShadow:       '0 24px 48px rgba(0,0,0,0.4)',
        }}
      >
        {/* Header */}
        <div
          style={{ borderBottom: '1px solid var(--color-border)' }}
          className="flex items-center justify-between px-6 py-4"
        >
          <h2 style={{ color: 'var(--color-text)', fontSize: '15px', fontWeight: 700 }}>
            Create a new room
          </h2>
          <button
            onClick={onClose}
            style={{ color: 'var(--color-text-muted)' }}
            className="hover:text-[var(--color-text)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">

          {/* Room name */}
          <div>
            <label
              style={{ color: 'var(--color-text-dim)', fontSize: '13px', fontWeight: 500 }}
              className="block mb-2"
            >
              Room name
            </label>
            <input
              {...register('name')}
              type="text"
              placeholder="my-awesome-project"
              style={{
                backgroundColor: 'var(--color-surface-2)',
                border:          `1px solid ${errors.name ? 'var(--color-danger)' : 'var(--color-border)'}`,
                borderRadius:    'var(--radius-md)',
                color:           'var(--color-text)',
                fontFamily:      'var(--font-mono)',
                fontSize:        '13px',
                width:           '100%',
                padding:         '10px 12px',
                outline:         'none',
              }}
              onFocus={(e)  => e.target.style.borderColor = 'var(--color-brand)'}
              onBlur={(e)   => e.target.style.borderColor = errors.name ? 'var(--color-danger)' : 'var(--color-border)'}
            />
            {errors.name && (
              <p style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: 4 }}>
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Language */}
          <div>
            <label
              style={{ color: 'var(--color-text-dim)', fontSize: '13px', fontWeight: 500 }}
              className="block mb-2"
            >
              Language
            </label>
            <select
              {...register('language')}
              style={{
                backgroundColor: 'var(--color-surface-2)',
                border:          '1px solid var(--color-border)',
                borderRadius:    'var(--radius-md)',
                color:           'var(--color-text)',
                fontFamily:      'var(--font-mono)',
                fontSize:        '13px',
                width:           '100%',
                padding:         '10px 12px',
                outline:         'none',
                cursor:          'pointer',
              }}
              onFocus={(e)  => e.target.style.borderColor = 'var(--color-brand)'}
              onBlur={(e)   => e.target.style.borderColor = 'var(--color-border)'}
            >
              {LANGUAGES.map((lang) => (
                <option
                  key={lang}
                  value={lang}
                  style={{ backgroundColor: 'var(--color-surface-2)' }}
                >
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Visibility toggle buttons */}
          <div>
            <label
              style={{ color: 'var(--color-text-dim)', fontSize: '13px', fontWeight: 500 }}
              className="block mb-2"
            >
              Visibility
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 8,
              }}
            >
              {(['private', 'public'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVisibility(v)}
                  style={{
                    padding:         '10px',
                    borderRadius:    'var(--radius-md)',
                    fontSize:        '13px',
                    fontWeight:      600,
                    cursor:          'pointer',
                    transition:      'all 0.15s',
                    border: visibility === v
                      ? '2px solid var(--color-brand)'
                      : '2px solid var(--color-border)',
                    backgroundColor: visibility === v
                      ? 'var(--color-brand-dim)'
                      : 'var(--color-surface-2)',
                    color: visibility === v
                      ? 'var(--color-brand)'
                      : 'var(--color-text-muted)',
                  }}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width:           '100%',
              backgroundColor: 'var(--color-brand)',
              borderRadius:    'var(--radius-md)',
              color:           'white',
              border:          'none',
              padding:         '11px',
              fontSize:        '14px',
              fontWeight:      600,
              cursor:          loading ? 'not-allowed' : 'pointer',
              opacity:         loading ? 0.7 : 1,
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              gap:             8,
              marginTop:       4,
            }}
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {loading ? 'Creating...' : 'Create room'}
          </button>
        </form>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Loader2, Plus } from 'lucide-react'
import { useRoomStore } from '@/store/room.store'
import { useRouter } from 'next/navigation'
import { Language } from '@/types'

const LANGUAGES: Language[] = [
  'javascript', 'typescript', 'python',
  'go', 'rust', 'java', 'cpp', 'c',
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

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateRoomForm>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      language: 'typescript',
      isPublic: false,
    },
  })

  const isPublic = watch('isPublic')

  const onSubmit = async (data: CreateRoomForm) => {
    try {
      const room = await createRoom(data)
      onClose()
      router.push(`/rooms/${room.id}`)
    } catch {
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Modal */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '440px',
        }}
      >
        {/* Header */}
        <div
          style={{ borderBottom: '1px solid var(--color-border)' }}
          className="flex items-center justify-between px-6 py-4"
        >
          <h2 style={{ color: 'var(--color-text)' }} className="font-semibold text-base">
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

        {/* Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">

          {/* Room name */}
          <div>
            <label
              style={{ color: 'var(--color-text-dim)' }}
              className="block text-sm font-medium mb-1.5"
            >
              Room name
            </label>
            <input
              {...register('name')}
              type="text"
              placeholder="my-awesome-project"
              style={{
                backgroundColor: 'var(--color-surface-2)',
                border: `1px solid ${errors.name ? 'var(--color-danger)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text)',
                fontFamily: 'var(--font-mono)',
              }}
              className="w-full px-3 py-2.5 text-sm outline-none focus:border-[var(--color-brand)]"
            />
            {errors.name && (
              <p style={{ color: 'var(--color-danger)' }} className="text-xs mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Language */}
          <div>
            <label
              style={{ color: 'var(--color-text-dim)' }}
              className="block text-sm font-medium mb-1.5"
            >
              Language
            </label>
            <select
              {...register('language')}
              style={{
                backgroundColor: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text)',
                fontFamily: 'var(--font-mono)',
              }}
              className="w-full px-3 py-2.5 text-sm outline-none focus:border-[var(--color-brand)]"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}
                  style={{ backgroundColor: 'var(--color-surface-2)' }}
                >
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Public toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: 'var(--color-text)' }} className="text-sm font-medium">
                Public room
              </p>
              <p style={{ color: 'var(--color-text-muted)' }} className="text-xs mt-0.5">
                Anyone can discover and join
              </p>
            </div>
            <button
              type="button"
              onClick={() => setValue('isPublic', !isPublic)}
              style={{
                backgroundColor: isPublic ? 'var(--color-brand)' : 'var(--color-surface-3)',
                border: '1px solid var(--color-border)',
                borderRadius: '20px',
                width: '44px',
                height: '24px',
                position: 'relative',
                transition: 'background-color 0.2s',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '3px',
                  left: isPublic ? '22px' : '3px',
                  width: '16px',
                  height: '16px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  transition: 'left 0.2s',
                }}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-dim)',
              }}
              className="flex-1 py-2.5 text-sm font-medium hover:border-[var(--color-border-light)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: 'var(--color-brand)',
                borderRadius: 'var(--radius-md)',
                color: 'white',
              }}
              className="flex-1 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {loading
                ? <Loader2 size={15} className="animate-spin" />
                : <Plus size={15} />
              }
              {loading ? 'Creating...' : 'Create room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
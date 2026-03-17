'use client'

import { useRouter } from 'next/navigation'
import { Users, Crown, Globe, Lock, Trash2 } from 'lucide-react'
import { Room } from '@/types'
import { getLanguageColor } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'
import { useRoomStore } from '@/store/room.store'

interface RoomCardProps {
  room:    Room
  onDelete?: (roomId: string) => void
}

export default function RoomCard({ room, onDelete }: RoomCardProps) {
  const router  = useRouter()
  const user    = useAuthStore((s) => s.user)
  const isOwner = room.ownerId === user?.id

  const langColor = getLanguageColor(room.language)

  const handleClick = () => {
    router.push(`/rooms/${room.id}`)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(room.id)
  }

  return (
    <div
      onClick={handleClick}
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        cursor: 'pointer',
        transition: 'border-color 0.15s, background-color 0.15s',
      }}
      className="p-4 group hover:border-[var(--color-brand)] hover:bg-[var(--color-surface-2)]"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {/* Owner crown */}
            {isOwner && (
              <Crown
                size={13}
                style={{ color: 'var(--color-warning)', flexShrink: 0 }}
              />
            )}
            <h3
              style={{ color: 'var(--color-text)' }}
              className="font-semibold text-sm truncate"
            >
              {room.name}
            </h3>
          </div>

          {/* Language badge */}
          <div className="flex items-center gap-1.5">
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: langColor,
                flexShrink: 0,
                display: 'inline-block',
              }}
            />
            <span
              style={{
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
              }}
            >
              {room.language}
            </span>
          </div>
        </div>

        {/* Delete button — owner only */}
        {isOwner && onDelete && (
          <button
            onClick={handleDelete}
            style={{ color: 'var(--color-text-muted)' }}
            className="opacity-0 group-hover:opacity-100 hover:text-[var(--color-danger)] transition-all p-1 ml-2"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between">
        {/* Member count */}
        <div
          className="flex items-center gap-1.5"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <Users size={13} />
          <span style={{ fontSize: '12px' }}>
            {room.members?.length}{' '}
            {room.members?.length === 1 ? 'member' : 'members'}
          </span>
        </div>

        {/* Public / Private badge */}
        <div
          className="flex items-center gap-1"
          style={{
            color: room.isPublic
              ? 'var(--color-success)'
              : 'var(--color-text-muted)',
            fontSize: '11px',
          }}
        >
          {room.isPublic ? <Globe size={12} /> : <Lock size={12} />}
          <span>{room.isPublic ? 'Public' : 'Private'}</span>
        </div>
      </div>
    </div>
  )
}
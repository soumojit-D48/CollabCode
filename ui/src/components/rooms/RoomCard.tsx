'use client'

import { useRouter } from 'next/navigation'
import { Users, Globe, Lock } from 'lucide-react'
import { Room } from '@/types'
import { getLanguageColor } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'

interface RoomCardProps {
  room: Room
}

export default function RoomCard({ room }: RoomCardProps) {
  const router  = useRouter()
  const user    = useAuthStore((s) => s.user)

  const langColor = getLanguageColor(room.language)

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day:   'numeric',
      year:  'numeric',
    })
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        border:          '1px solid var(--color-border)',
        borderRadius:    'var(--radius-lg)',
        padding:         '20px',
        display:         'flex',
        flexDirection:   'column',
        gap:             12,
        transition:      'border-color 0.15s, box-shadow 0.15s',
        cursor:          'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border-light)'
        e.currentTarget.style.boxShadow   = '0 0 0 1px var(--color-border-light)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border)'
        e.currentTarget.style.boxShadow   = 'none'
      }}
    >
      {/* Top row — language + visibility */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            style={{
              width:           8,
              height:          8,
              borderRadius:    '50%',
              backgroundColor: langColor,
              display:         'inline-block',
              flexShrink:      0,
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize:   '12px',
              color:      'var(--color-text-muted)',
            }}
          >
            {room.language}
          </span>
        </div>

        {room.isPublic
          ? <Globe size={14} style={{ color: 'var(--color-success)' }} />
          : <Lock  size={14} style={{ color: 'var(--color-text-muted)' }} />
        }
      </div>

      {/* Room name + date */}
      <div>
        <h3
          style={{
            fontFamily:  'var(--font-mono)',
            fontSize:    '15px',
            fontWeight:  700,
            color:       'var(--color-text)',
            marginBottom: 4,
          }}
        >
          {room.name}
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
          Created {formatDate(room.createdAt)}
        </p>
      </div>

      {/* Bottom row — members + open button */}
      <div className="flex items-center justify-between" style={{ marginTop: 4 }}>
        <div
          className="flex items-center gap-1.5"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <Users size={13} />
          <span style={{ fontSize: '13px' }}>
            {room.members?.length ?? 0}
          </span>
        </div>

        <button
          onClick={() => router.push(`/rooms/${room.id}`)}
          style={{
            backgroundColor: 'var(--color-brand)',
            borderRadius:    'var(--radius-md)',
            color:           'white',
            border:          'none',
            padding:         '6px 18px',
            fontSize:        '13px',
            fontWeight:      600,
            cursor:          'pointer',
            transition:      'opacity 0.15s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          Open
        </button>
      </div>
    </div>
  )
}
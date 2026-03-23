'use client'

import { useRouter } from 'next/navigation'
import { Users, Globe, Lock, Clock, Copy, MoreHorizontal } from 'lucide-react'
import { Room } from '@/types'
import { getLanguageColor } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'
import { useState } from 'react'

interface RoomCardProps {
  room: Room
}

export default function RoomCard({ room }: RoomCardProps) {
  const router  = useRouter()
  const user    = useAuthStore((s) => s.user)
  const [showMenu, setShowMenu] = useState(false)

  const langColor = getLanguageColor(room.language)
  const memberCount = room.members?.length ?? 0

  const formatDate = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const copyInviteLink = (e: React.MouseEvent) => {
    e.stopPropagation()
    const link = `${window.location.origin}/rooms/${room.id}`
    navigator.clipboard.writeText(link)
    setShowMenu(false)
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
        gap:             14,
        transition:      'border-color 0.15s, box-shadow 0.15s',
        cursor:          'pointer',
        position:        'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border-light)'
        e.currentTarget.style.boxShadow   = '0 4px 12px rgba(0,0,0,0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border)'
        e.currentTarget.style.boxShadow   = 'none'
        setShowMenu(false)
      }}
    >
      {/* Menu button */}
      <button
        onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu) }}
        style={{
          position:       'absolute',
          top:             12,
          right:           12,
          background:      'transparent',
          border:          'none',
          cursor:          'pointer',
          color:           'var(--color-text-muted)',
          padding:         4,
          borderRadius:    'var(--radius-sm)',
          display:         'flex',
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
      >
        <MoreHorizontal size={16} />
      </button>

      {showMenu && (
        <div
          style={{
            position:       'absolute',
            top:             40,
            right:           12,
            backgroundColor: 'var(--color-surface-2)',
            border:          '1px solid var(--color-border)',
            borderRadius:    'var(--radius-md)',
            padding:         '6px 0',
            minWidth:        140,
            zIndex:          10,
            boxShadow:       '0 8px 24px rgba(0,0,0,0.3)',
          }}
        >
          <button
            onClick={copyInviteLink}
            style={{
              display:         'flex',
              alignItems:      'center',
              gap:             8,
              width:           '100%',
              padding:         '8px 12px',
              background:      'transparent',
              border:          'none',
              color:           'var(--color-text)',
              fontSize:        '13px',
              cursor:          'pointer',
              textAlign:       'left',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-3)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Copy size={14} />
            Copy invite link
          </button>
        </div>
      )}

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
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
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

      {/* Room name */}
      <div>
        <h3
          style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      '15px',
            fontWeight:    700,
            color:         'var(--color-text)',
            marginBottom:  4,
            paddingRight:  24,
          }}
        >
          {room.name}
        </h3>
      </div>

      {/* Meta info */}
      <div className="flex items-center gap-4" style={{ marginTop: 2 }}>
        <div className="flex items-center gap-1.5" style={{ color: 'var(--color-text-muted)' }}>
          <Users size={13} />
          <span style={{ fontSize: '13px' }}>{memberCount}</span>
        </div>
        <div className="flex items-center gap-1.5" style={{ color: 'var(--color-text-muted)' }}>
          <Clock size={13} />
          <span style={{ fontSize: '13px' }}>{formatDate(room.updatedAt)}</span>
        </div>
      </div>

      {/* Bottom row — members preview + open button */}
      <div className="flex items-center justify-between" style={{ marginTop: 4 }}>
        <div className="flex items-center">
          {room.members?.slice(0, 3).map((member, i) => (
            <div
              key={member.id}
              style={{
                width:           24,
                height:          24,
                borderRadius:    '50%',
                backgroundColor: `hsl(${(i * 80 + 200) % 360}, 60%, 50%)`,
                border:          '2px solid var(--color-surface)',
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
                fontSize:        '10px',
                fontWeight:      600,
                color:           'white',
                marginLeft:      i > 0 ? -6 : 0,
                zIndex:          3 - i,
              }}
              title={member.role}
            >
              {member.userId?.slice(0, 2).toUpperCase()}
            </div>
          ))}
          {memberCount > 3 && (
            <div
              style={{
                width:           24,
                height:          24,
                borderRadius:    '50%',
                backgroundColor: 'var(--color-surface-3)',
                border:          '2px solid var(--color-surface)',
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
                fontSize:        '10px',
                fontWeight:      600,
                color:           'var(--color-text-muted)',
                marginLeft:      -6,
              }}
            >
              +{memberCount - 3}
            </div>
          )}
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
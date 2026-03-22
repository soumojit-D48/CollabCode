'use client'

import { ActiveUser } from '@/types'
import { getInitials } from '@/lib/utils'

interface ActiveUsersProps {
  users: ActiveUser[]
  currentUserId: string
}

export default function ActiveUsers({ users, currentUserId }: ActiveUsersProps) {
  const MAX_SHOW = 5
  const visible  = users.slice(0, MAX_SHOW)
  const overflow = users.length - MAX_SHOW

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {visible.map((user, idx) => (
        <div
          key={user.userId}
          title={user.username + (user.userId === currentUserId ? ' (you)' : '')}
          style={{
            width: 28, height: 28, borderRadius: '50%',
            backgroundColor: user.color,
            border: `2px solid var(--color-surface)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px', fontWeight: 700, color: 'white',
            fontFamily: 'var(--font-mono)', cursor: 'default',
            flexShrink: 0, position: 'relative',
            marginLeft: idx === 0 ? 0 : '-8px',
            zIndex: visible.length - idx,
            boxShadow: user.userId === currentUserId
              ? `0 0 0 2px ${user.color}60, 0 0 12px ${user.color}40`
              : '0 0 0 2px var(--color-surface)',
            transition: 'transform 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.15) translateY(-2px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = '')}
        >
          {getInitials(user.username)}
          {/* Pulsing ring for current user */}
          {user.userId === currentUserId && (
            <div style={{
              position: 'absolute', inset: -3,
              borderRadius: '50%',
              border: `1.5px solid ${user.color}`,
              animation: 'pulse-ring 1.8s ease-out infinite',
            }} />
          )}
        </div>
      ))}

      {overflow > 0 && (
        <div
          title={`${overflow} more user${overflow > 1 ? 's' : ''}`}
          style={{
            width: 28, height: 28, borderRadius: '50%',
            backgroundColor: 'var(--color-surface-3)',
            border: '2px solid var(--color-surface)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '9px', color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-mono)', flexShrink: 0,
            marginLeft: '-8px', zIndex: 0,
          }}
        >
          +{overflow}
        </div>
      )}
    </div>
  )
}
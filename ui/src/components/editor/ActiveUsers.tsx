'use client'

import { ActiveUser } from '@/types'
import { getInitials } from '@/lib/utils'

interface ActiveUsersProps {
  users:         ActiveUser[]
  currentUserId: string
}

export default function ActiveUsers({ users, currentUserId }: ActiveUsersProps) {
  const MAX_SHOW = 5
  const visible  = users.slice(0, MAX_SHOW)
  const overflow = users.length - MAX_SHOW

  return (
    <div className="flex items-center gap-1">
      {visible.map((user) => (
        <div
          key={user.userId}
          title={user.username + (user.userId === currentUserId ? ' (you)' : '')}
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            backgroundColor: user.color,
            border: user.userId === currentUserId
              ? '2px solid white'
              : '2px solid var(--color-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 700,
            color: 'white',
            fontFamily: 'var(--font-mono)',
            cursor: 'default',
            flexShrink: 0,
          }}
        >
          {getInitials(user.username)}
        </div>
      ))}

      {overflow > 0 && (
        <div
          title={`${overflow} more user${overflow > 1 ? 's' : ''}`}
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            backgroundColor: 'var(--color-surface-3)',
            border: '2px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-mono)',
            flexShrink: 0,
          }}
        >
          +{overflow}
        </div>
      )}
    </div>
  )
}
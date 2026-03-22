'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'

export default function Navbar() {
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <nav
      style={{
        backgroundColor: 'var(--color-surface)',
        borderBottom:    '1px solid var(--color-border)',
        height:          '52px',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'space-between',
        padding:         '0 24px',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div
          style={{
            backgroundColor: 'var(--color-brand)',
            borderRadius:    '8px',
            width:           32,
            height:          32,
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            fontFamily:      'var(--font-mono)',
            fontWeight:      800,
            fontSize:        '14px',
            color:           'white',
          }}
        >
          {'</>'}
        </div>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize:   '15px',
            color:      'var(--color-text)',
          }}
        >
          CollabCode
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize:   '13px',
            color:      'var(--color-text-muted)',
          }}
        >
          @{user?.username}
        </span>

        <button
          onClick={handleLogout}
          style={{
            display:     'flex',
            alignItems:  'center',
            gap:         6,
            color:       'var(--color-text-muted)',
            background:  'none',
            border:      'none',
            cursor:      'pointer',
            fontSize:    '13px',
            padding:     '6px 10px',
            borderRadius:'var(--radius-md)',
            transition:  'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-surface-2)'
            e.currentTarget.style.color = 'var(--color-text)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = 'var(--color-text-muted)'
          }}
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </nav>
  )
}
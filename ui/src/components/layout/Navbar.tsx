'use client'

import { useRouter } from 'next/navigation'
import { Code2, LogOut, User } from 'lucide-react'
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
        borderBottom: '1px solid var(--color-border)',
      }}
      className="h-14 flex items-center justify-between px-6"
    >
      <div className="flex items-center gap-2.5">
        <div
          style={{
            backgroundColor: 'var(--color-brand)',
            borderRadius: 'var(--radius-md)',
          }}
          className="p-1.5"
        >
          <Code2 size={18} color="white" />
        </div>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-text)',
          }}
          className="text-base font-bold"
        >
          CollabCode
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* User info */}
        <div className="flex items-center gap-2">
          <div
            style={{
              backgroundColor: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              borderRadius: '50%',
            }}
            className="w-8 h-8 flex items-center justify-center"
          >
            <User size={14} style={{ color: 'var(--color-text-muted)' }} />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-text-dim)',
              fontSize: '13px',
            }}
          >
            {user?.username}
          </span>
        </div>

        {/* Divider */}
        <div
          style={{
            width: '1px',
            height: '20px',
            backgroundColor: 'var(--color-border)',
          }}
        />

        <button
          onClick={handleLogout}
          style={{ color: 'var(--color-text-muted)' }}
          className="flex items-center gap-1.5 text-sm hover:text-[var(--color-danger)] transition-colors"
        >
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  )
}
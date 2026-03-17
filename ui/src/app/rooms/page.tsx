'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, RefreshCw, Search } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import RoomCard from '@/components/rooms/RoomCard'
import CreateRoomModal from '@/components/rooms/CreateRoomModal'
import { useAuthStore } from '@/store/auth.store'
import { useRoomStore } from '@/store/room.store'

export default function RoomsPage() {
  const router = useRouter()
  const { hydrate, user } = useAuthStore()
  const {
    myRooms,
    publicRooms,
    loading,
    fetchMyRooms,
    fetchPublicRooms,
    deleteRoom,
  } = useRoomStore()

  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'my' | 'public'>('my')
  const [searchQuery, setSearchQuery] = useState('')

  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    hydrate()
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    if (!user) {
      const token = localStorage.getItem('token')
      if (!token) {
        router.replace('/login')
        return
      }
    }
    fetchMyRooms()
    fetchPublicRooms()
  }, [user, hydrated])

  const handleDelete = async (roomId: string) => {
    if (!confirm('Delete this room? This cannot be undone.')) return
    await deleteRoom(roomId)
  }

  const rooms = activeTab === 'my' ? myRooms : publicRooms
  const filteredRooms = rooms.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div
      style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}
    >
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              style={{ color: 'var(--color-text)' }}
              className="text-2xl font-bold"
            >
              Rooms
            </h1>
            <p
              style={{ color: 'var(--color-text-muted)' }}
              className="text-sm mt-1"
            >
              Create or join a room to start coding together
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            style={{
              backgroundColor: 'var(--color-brand)',
              borderRadius: 'var(--radius-md)',
              color: 'white',
            }}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus size={16} />
            New Room
          </button>
        </div>

        {/* Tabs + Search bar */}
        <div className="flex items-center justify-between mb-6 gap-4">

          {/* Tabs */}
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '3px',
            }}
            className="flex"
          >
            {(['my', 'public'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: activeTab === tab
                    ? 'var(--color-surface-3)'
                    : 'transparent',
                  color: activeTab === tab
                    ? 'var(--color-text)'
                    : 'var(--color-text-muted)',
                  padding: '6px 16px',
                  fontSize: '13px',
                  fontWeight: activeTab === tab ? 600 : 400,
                  transition: 'all 0.15s',
                }}
              >
                {tab === 'my' ? 'My Rooms' : 'Public Rooms'}
                <span
                  style={{
                    marginLeft: '6px',
                    backgroundColor: activeTab === tab
                      ? 'var(--color-brand-dim)'
                      : 'var(--color-surface-2)',
                    color: activeTab === tab
                      ? 'var(--color-brand)'
                      : 'var(--color-text-muted)',
                    borderRadius: '10px',
                    padding: '1px 7px',
                    fontSize: '11px',
                  }}
                >
                  {tab === 'my' ? myRooms.length : publicRooms.length}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
            }}
            className="flex items-center gap-2 px-3 py-2 flex-1 max-w-xs"
          >
            <Search size={14} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--color-text)',
                fontSize: '13px',
                width: '100%',
              }}
            />
          </div>

          {/* Refresh */}
          <button
            onClick={() => { fetchMyRooms(); fetchPublicRooms() }}
            style={{ color: 'var(--color-text-muted)' }}
            className="hover:text-[var(--color-text)] transition-colors p-1"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Room grid */}
        {loading && filteredRooms.length === 0 ? (
          // Loading skeleton
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  height: '100px',
                  animation: 'pulse 2s infinite',
                }}
              />
            ))}
          </div>
        ) : filteredRooms.length === 0 ? (
          // Empty state
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
            }}
            className="flex flex-col items-center justify-center py-16 px-6 text-center"
          >
            <p style={{ color: 'var(--color-text)' }} className="text-base font-medium mb-1">
              {searchQuery ? 'No rooms match your search' : activeTab === 'my' ? 'No rooms yet' : 'No public rooms'}
            </p>
            <p style={{ color: 'var(--color-text-muted)' }} className="text-sm mb-4">
              {activeTab === 'my' && !searchQuery && 'Create your first room to get started'}
            </p>
            {activeTab === 'my' && !searchQuery && (
              <button
                onClick={() => setShowModal(true)}
                style={{
                  backgroundColor: 'var(--color-brand)',
                  borderRadius: 'var(--radius-md)',
                  color: 'white',
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold hover:opacity-90"
              >
                <Plus size={15} />
                Create room
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onDelete={activeTab === 'my' ? handleDelete : undefined}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create room modal */}
      {showModal && <CreateRoomModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
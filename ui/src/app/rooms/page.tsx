'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, RefreshCw, ArrowUpDown, SlidersHorizontal } from 'lucide-react'
import Navbar           from '@/components/layout/Navbar'
import RoomCard         from '@/components/rooms/RoomCard'
import CreateRoomModal  from '@/components/rooms/CreateRoomModal'
import { useAuthStore } from '@/store/auth.store'
import { useRoomStore } from '@/store/room.store'

type SortOption = 'recent' | 'name' | 'members'
type FilterOption = 'all' | 'public' | 'private'

export default function RoomsPage() {
  const router = useRouter()
  const { hydrate, user }  = useAuthStore()
  const {
    myRooms, publicRooms,
    loading,
    fetchMyRooms, fetchPublicRooms,
  } = useRoomStore()

  const [showModal,   setShowModal]   = useState(false)
  const [activeTab,   setActiveTab]   = useState<'my' | 'public'>('my')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [showFilters, setShowFilters] = useState(false)
  const [filterType, setFilterType] = useState<FilterOption>('all')

  useEffect(() => { hydrate() }, [])

  useEffect(() => {
    if (!user) { router.replace('/login'); return }
    fetchMyRooms()
    fetchPublicRooms()
  }, [user])

  const rooms         = activeTab === 'my' ? myRooms : publicRooms
  
  let filteredRooms = rooms.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (filterType !== 'all') {
    filteredRooms = filteredRooms.filter(r => 
      filterType === 'public' ? r.isPublic : !r.isPublic
    )
  }

  if (sortBy === 'name') {
    filteredRooms = [...filteredRooms].sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy === 'members') {
    filteredRooms = [...filteredRooms].sort((a, b) => (b.members?.length ?? 0) - (a.members?.length ?? 0))
  } else {
    filteredRooms = [...filteredRooms].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  }

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      <Navbar />

      <main
        style={{
          maxWidth: '1100px',
          margin:   '0 auto',
          padding:  '40px 24px',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1
              style={{
                fontSize:   '28px',
                fontWeight: 800,
                color:      'var(--color-text)',
                marginBottom: 6,
              }}
            >
              Rooms
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
              Create or join a room to start coding together
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            style={{
              backgroundColor: 'var(--color-brand)',
              borderRadius:    'var(--radius-md)',
              color:           'white',
              border:          'none',
              padding:         '10px 20px',
              fontSize:        '14px',
              fontWeight:      600,
              cursor:          'pointer',
              display:         'flex',
              alignItems:      'center',
              gap:             8,
              transition:      'opacity 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <Plus size={16} />
            New Room
          </button>
        </div>

        {/* Tabs + Search + Filters */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between gap-4">
            {/* Tabs */}
            <div
              style={{
                display:         'flex',
                backgroundColor: 'var(--color-surface)',
                border:          '1px solid var(--color-border)',
                borderRadius:    'var(--radius-lg)',
                padding:         '4px',
                gap:             4,
              }}
            >
              {([
                { key: 'my',     label: `My Rooms (${myRooms.length})` },
                { key: 'public', label: `Public Rooms (${publicRooms.length})` },
              ] as const).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  style={{
                    padding:         '7px 18px',
                    borderRadius:    'var(--radius-md)',
                    fontSize:        '13px',
                    fontWeight:      activeTab === key ? 700 : 400,
                    border:          'none',
                    cursor:          'pointer',
                    transition:      'all 0.15s',
                    backgroundColor: activeTab === key
                      ? 'var(--color-surface-3)'
                      : 'transparent',
                    color: activeTab === key
                      ? 'var(--color-text)'
                      : 'var(--color-text-muted)',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Search + refresh */}
            <div className="flex items-center gap-3">
              <div
                style={{
                  display:         'flex',
                  alignItems:      'center',
                  gap:             8,
                  backgroundColor: 'var(--color-surface)',
                  border:          '1px solid var(--color-border)',
                  borderRadius:    'var(--radius-lg)',
                  padding:         '8px 14px',
                  width:           '260px',
                }}
              >
                <Search size={14} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Search rooms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    background: 'transparent',
                    border:     'none',
                    outline:    'none',
                    color:      'var(--color-text)',
                    fontSize:   '13px',
                    width:      '100%',
                  }}
                />
              </div>

              <button
                onClick={() => { fetchMyRooms(); fetchPublicRooms() }}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border:          '1px solid var(--color-border)',
                  borderRadius:    'var(--radius-lg)',
                  padding:         '8px 10px',
                  cursor:          'pointer',
                  color:           'var(--color-text-muted)',
                  display:         'flex',
                  alignItems:      'center',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
              >
                <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {/* Filters row */}
          {showFilters && (
            <div
              style={{
                display:         'flex',
                alignItems:      'center',
                gap:             12,
                padding:         '10px 14px',
                backgroundColor: 'var(--color-surface)',
                border:          '1px solid var(--color-border)',
                borderRadius:    'var(--radius-lg)',
                width:           'fit-content',
              }}
            >
              <div className="flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
                <SlidersHorizontal size={14} />
                <span style={{ fontSize: '12px', fontWeight: 500 }}>Filter:</span>
              </div>
              {(['all', 'public', 'private'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFilterType(opt)}
                  style={{
                    padding:         '4px 12px',
                    borderRadius:    'var(--radius-sm)',
                    fontSize:        '12px',
                    border:          'none',
                    cursor:          'pointer',
                    backgroundColor: filterType === opt
                      ? 'var(--color-brand)'
                      : 'transparent',
                    color: filterType === opt
                      ? 'white'
                      : 'var(--color-text-muted)',
                    textTransform:   'capitalize',
                  }}
                >
                  {opt}
                </button>
              ))}
              
              <div style={{ width: 1, height: 16, backgroundColor: 'var(--color-border)', margin: '0 4px' }} />

              <div className="flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
                <ArrowUpDown size={14} />
                <span style={{ fontSize: '12px', fontWeight: 500 }}>Sort:</span>
              </div>
              {([
                { key: 'recent', label: 'Recent' },
                { key: 'name', label: 'Name' },
                { key: 'members', label: 'Members' },
              ] as const).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setSortBy(opt.key)}
                  style={{
                    padding:         '4px 12px',
                    borderRadius:    'var(--radius-sm)',
                    fontSize:        '12px',
                    border:          'none',
                    cursor:          'pointer',
                    backgroundColor: sortBy === opt.key
                      ? 'var(--color-brand)'
                      : 'transparent',
                    color: sortBy === opt.key
                      ? 'white'
                      : 'var(--color-text-muted)',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Toggle filters button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              display:        'flex',
              alignItems:     'center',
              gap:            6,
              background:     'transparent',
              border:         'none',
              color:          'var(--color-text-muted)',
              fontSize:       '12px',
              cursor:         'pointer',
              width:          'fit-content',
              padding:        0,
              marginTop:      showFilters ? 0 : -4,
            }}
          >
            <SlidersHorizontal size={12} />
            {showFilters ? 'Hide filters' : 'Show filters'}
          </button>
        </div>

        {/* Room grid */}
        {loading && filteredRooms.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border:          '1px solid var(--color-border)',
                  borderRadius:    'var(--radius-lg)',
                  height:          140,
                  opacity:         1 - i * 0.2,
                }}
              />
            ))}
          </div>
        ) : filteredRooms.length === 0 ? (
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              border:          '1px solid var(--color-border)',
              borderRadius:    'var(--radius-lg)',
              padding:         '60px 24px',
              textAlign:       'center',
            }}
          >
            <p style={{ color: 'var(--color-text)', fontSize: '15px', fontWeight: 600, marginBottom: 6 }}>
              {searchQuery ? 'No rooms match your search' : activeTab === 'my' ? 'No rooms yet' : 'No public rooms'}
            </p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginBottom: 16 }}>
              {activeTab === 'my' && !searchQuery && 'Create your first room to get started'}
            </p>
            {activeTab === 'my' && !searchQuery && (
              <button
                onClick={() => setShowModal(true)}
                style={{
                  backgroundColor: 'var(--color-brand)',
                  borderRadius:    'var(--radius-md)',
                  color:           'white',
                  border:          'none',
                  padding:         '9px 20px',
                  fontSize:        '13px',
                  fontWeight:      600,
                  cursor:          'pointer',
                  display:         'inline-flex',
                  alignItems:      'center',
                  gap:             6,
                }}
              >
                <Plus size={14} />
                Create room
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </main>

      {showModal && <CreateRoomModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
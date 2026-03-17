import { create } from 'zustand'
import { roomApi } from '@/lib/axios'
import { Room, CreateRoomInput } from '@/types'

interface RoomStore {
  myRooms:     Room[]
  publicRooms: Room[]
  currentRoom: Room | null
  loading:     boolean
  error:       string | null

  fetchMyRooms:     () => Promise<void>
  fetchPublicRooms: () => Promise<void>
  fetchRoomById:    (roomId: string) => Promise<Room>
  createRoom:       (data: CreateRoomInput) => Promise<Room>
  deleteRoom:       (roomId: string) => Promise<void>
  joinRoom:         (roomId: string) => Promise<void>
  leaveRoom:        (roomId: string) => Promise<void>
  setCurrentRoom:   (room: Room | null) => void
  clearError:       () => void
}

export const useRoomStore = create<RoomStore>((set, get) => ({
  myRooms:     [],
  publicRooms: [],
  currentRoom: null,
  loading:     false,
  error:       null,

  fetchMyRooms: async () => {
    set({ loading: true, error: null })
    try {
      const res = await roomApi.get('/rooms/me')
      set({ myRooms: res.data, loading: false })
    } catch (err: any) {
      set({ error: err.response?.data?.message ?? 'Failed to fetch rooms', loading: false })
    }
  },

  fetchPublicRooms: async () => {
    set({ loading: true, error: null })
    try {
      const res = await roomApi.get('/rooms/public')
      set({ publicRooms: res.data, loading: false })
    } catch (err: any) {
      set({ error: err.response?.data?.message ?? 'Failed to fetch public rooms', loading: false })
    }
  },

  fetchRoomById: async (roomId) => {
    const res = await roomApi.get(`/rooms/${roomId}`)
    set({ currentRoom: res.data })
    return res.data
  },

  createRoom: async (data) => {
    set({ loading: true, error: null })
    try {
      const res = await roomApi.post('/rooms', data)
      const room: Room = res.data
      // add to myRooms list immediately
      set((state) => ({
        myRooms: [room, ...state.myRooms],
        loading: false,
      }))
      return room
    } catch (err: any) {
      set({ error: err.response?.data?.message ?? 'Failed to create room', loading: false })
      throw err
    }
  },

  deleteRoom: async (roomId) => {
    await roomApi.delete(`/rooms/${roomId}`)
    set((state) => ({
      myRooms: state.myRooms.filter((r) => r.id !== roomId),
    }))
  },

  joinRoom: async (roomId) => {
    await roomApi.post(`/rooms/${roomId}/join`)
    // refresh my rooms
    get().fetchMyRooms()
  },

  leaveRoom: async (roomId) => {
    await roomApi.post(`/rooms/${roomId}/leave`)
    set((state) => ({
      myRooms: state.myRooms.filter((r) => r.id !== roomId),
      currentRoom: null,
    }))
  },

  setCurrentRoom: (room) => set({ currentRoom: room }),

  clearError: () => set({ error: null }),
}))
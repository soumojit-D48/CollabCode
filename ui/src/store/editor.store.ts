import { create } from 'zustand'
import { ActiveUser, Cursor } from '@/types'

interface EditorStore {
  content:     string
  language:    string
  activeUsers: ActiveUser[]
  cursors:     Record<string, Cursor>   // userId → cursor
  isConnected: boolean
  isReconnecting: boolean

  setContent:       (content: string) => void
  setLanguage:      (language: string) => void
  setActiveUsers:   (users: ActiveUser[]) => void
  addUser:          (user: ActiveUser) => void
  removeUser:       (userId: string) => void
  setCursor:        (cursor: Cursor) => void
  removeCursor:     (userId: string) => void
  setConnected:     (connected: boolean) => void
  setReconnecting:  (reconnecting: boolean) => void
  reset:            () => void
}

const initialState = {
  content:        '',
  language:       'javascript',
  activeUsers:    [],
  cursors:        {},
  isConnected:    false,
  isReconnecting: false,
}

export const useEditorStore = create<EditorStore>((set) => ({
  ...initialState,

  setContent: (content) => set({ content }),

  setLanguage: (language) => set({ language }),

  setActiveUsers: (users) => set({ activeUsers: users }),

  addUser: (user) =>
    set((state) => ({
      activeUsers: [
        ...state.activeUsers.filter((u) => u.userId !== user.userId),
        user,
      ],
    })),

  removeUser: (userId) =>
    set((state) => ({
      activeUsers: state.activeUsers.filter((u) => u.userId !== userId),
      cursors: Object.fromEntries(
        Object.entries(state.cursors).filter(([id]) => id !== userId)
      ),
    })),

  setCursor: (cursor) =>
    set((state) => ({
      cursors: { ...state.cursors, [cursor.userId]: cursor },
    })),

  removeCursor: (userId) =>
    set((state) => {
      const cursors = { ...state.cursors }
      delete cursors[userId]
      return { cursors }
    }),

  setConnected: (isConnected) => set({ isConnected }),

  setReconnecting: (isReconnecting) => set({ isReconnecting }),

  reset: () => set(initialState),
}))
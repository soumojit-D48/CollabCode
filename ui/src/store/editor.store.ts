
import { create } from 'zustand'
import { ActiveUser, Cursor, RoomFile } from '@/types'

interface EditorStore {
  files:          RoomFile[]
  activeFileId:   string | null
  openFileIds:    string[]

  language:       string
  activeUsers:    ActiveUser[]
  cursors:        Record<string, Cursor>
  isConnected:    boolean
  isReconnecting: boolean

  setFiles:        (files: RoomFile[]) => void
  addFile:         (file: RoomFile) => void
  updateFile:      (fileId: string, data: Partial<RoomFile>) => void
  removeFile:      (fileId: string) => void
  setActiveFile:   (fileId: string) => void
  openFile:        (fileId: string) => void
  closeFile:       (fileId: string) => void

  setLanguage:     (language: string) => void
  setActiveUsers:  (users: ActiveUser[]) => void
  addUser:         (user: ActiveUser) => void
  removeUser:      (userId: string) => void
  setCursor:       (cursor: Cursor) => void
  removeCursor:    (userId: string) => void
  setConnected:    (connected: boolean) => void
  setReconnecting: (reconnecting: boolean) => void
  reset:           () => void
}

const initialState = {
  files:          [],
  activeFileId:   null,
  openFileIds:    [],
  language:       'javascript',
  activeUsers:    [],
  cursors:        {},
  isConnected:    false,
  isReconnecting: false,
}

export const useEditorStore = create<EditorStore>((set) => ({
  ...initialState,

  setFiles: (files) => set({ files }),

  addFile: (file) =>
    set((s) => ({
      files:       [...s.files, file],
      openFileIds: [...s.openFileIds, file.id],
      activeFileId: file.id,
    })),

  updateFile: (fileId, data) =>
    set((s) => ({
      files: s.files.map((f) =>
        f.id === fileId ? { ...f, ...data } : f
      ),
    })),

  removeFile: (fileId) =>
    set((s) => {
      const openFileIds  = s.openFileIds.filter((id) => id !== fileId)
      const activeFileId = s.activeFileId === fileId
        ? openFileIds[openFileIds.length - 1] ?? null
        : s.activeFileId
      return {
        files: s.files.filter((f) => f.id !== fileId),
        openFileIds,
        activeFileId,
      }
    }),

  setActiveFile: (fileId) => set({ activeFileId: fileId }),

  openFile: (fileId) =>
    set((s) => ({
      openFileIds: s.openFileIds.includes(fileId)
        ? s.openFileIds
        : [...s.openFileIds, fileId],
      activeFileId: fileId,
    })),

  closeFile: (fileId) =>
    set((s) => {
      const openFileIds  = s.openFileIds.filter((id) => id !== fileId)
      const activeFileId = s.activeFileId === fileId
        ? openFileIds[openFileIds.length - 1] ?? null
        : s.activeFileId
      return { openFileIds, activeFileId }
    }),

  setLanguage:     (language)    => set({ language }),
  setActiveUsers:  (activeUsers) => set({ activeUsers }),

  addUser: (user) =>
    set((s) => ({
      activeUsers: [
        ...s.activeUsers.filter((u) => u.userId !== user.userId),
        user,
      ],
    })),

  removeUser: (userId) =>
    set((s) => ({
      activeUsers: s.activeUsers.filter((u) => u.userId !== userId),
      cursors: Object.fromEntries(
        Object.entries(s.cursors).filter(([id]) => id !== userId)
      ),
    })),

  setCursor: (cursor) =>
    set((s) => ({
      cursors: { ...s.cursors, [cursor.userId]: cursor },
    })),

  removeCursor: (userId) =>
    set((s) => {
      const cursors = { ...s.cursors }
      delete cursors[userId]
      return { cursors }
    }),

  setConnected:    (isConnected)    => set({ isConnected }),
  setReconnecting: (isReconnecting) => set({ isReconnecting }),
  reset:           ()               => set(initialState),
}))
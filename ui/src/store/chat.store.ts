import { create } from 'zustand'
import { Message } from '@/types'

interface ChatStore {
  messages:    Message[]
  loading:     boolean
  isConnected: boolean

  setMessages:    (messages: Message[]) => void
  addMessage:     (message: Message) => void
  setLoading:     (loading: boolean) => void
  setConnected:   (connected: boolean) => void
  reset:          () => void
}

export const useChatStore = create<ChatStore>((set) => ({
  messages:    [],
  loading:     false,
  isConnected: false,

  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({
      messages: state.messages.some((m) => m.id === message.id)
        ? state.messages
        : [...state.messages, message],
    })),

  setLoading: (loading) => set({ loading }),

  setConnected: (isConnected) => set({ isConnected }),

  reset: () => set({ messages: [], loading: false, isConnected: false }),
}))

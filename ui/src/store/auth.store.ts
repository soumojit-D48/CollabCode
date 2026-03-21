import { create } from 'zustand'
import { authApi } from '@/lib/axios'
import { User } from '@/types'

interface AuthStore {
  user:     User | null
  token:    string | null
  loading:  boolean
  error:    string | null

  login:    (email: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string) => Promise<void>
  logout:   () => void
  hydrate:  () => void
  clearError: () => void
}

const setTokenEverywhere = (token: string) => {
  localStorage.setItem('token', token)
  document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax; Secure`
}

const clearTokenEverywhere = () => {
  localStorage.removeItem('token')
  document.cookie = 'token=; Max-Age=0; path=/'
}

export const useAuthStore = create<AuthStore>((set) => ({
  user:    null,
  token:   null,
  loading: false,
  error:   null,

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const res = await authApi.post('/auth/login', { email, password })
      const { token, user } = res.data
      setTokenEverywhere(token)
      set({ token, user, loading: false })
    } catch (err: any) {
      const message = err.response?.data?.message ?? 'Login failed'
      set({ error: message, loading: false })
      throw err
    }
  },

  register: async (email, username, password) => {
    set({ loading: true, error: null })
    try {
      const res = await authApi.post('/auth/register', { email, username, password })
      const { token, user } = res.data
      setTokenEverywhere(token)
      set({ token, user, loading: false })
    } catch (err: any) {
      const message = err.response?.data?.message ?? 'Registration failed'
      set({ error: message, loading: false })
      throw err
    }
  },

  logout: () => {
    clearTokenEverywhere()
    set({ user: null, token: null })
  },

  hydrate: () => {
    if (typeof window === 'undefined') return
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      set({
        token,
        user: {
          id:       payload.userId,
          email:    payload.email,
          username: payload.username,
        },
      })
    } catch {
      clearTokenEverywhere()
    }
  },

  clearError: () => set({ error: null }),
}))
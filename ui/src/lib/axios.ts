import axios from 'axios'

const AUTH_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
const ROOM_URL = process.env.NEXT_PUBLIC_ROOM_URL ?? 'http://localhost:3002'

export const authApi = axios.create({
  baseURL: AUTH_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const roomApi = axios.create({
  baseURL: ROOM_URL,
  headers: { 'Content-Type': 'application/json' },
})

const attachToken = (config: any) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

authApi.interceptors.request.use(attachToken)
roomApi.interceptors.request.use(attachToken)

const handleUnauthorized = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
    document.cookie = 'token=; Max-Age=0; path=/'
    window.location.href = '/login'
  }
}

authApi.interceptors.response.use(
  (r) => r,
  (e) => { if (e.response?.status === 401) handleUnauthorized(); return Promise.reject(e) }
)
roomApi.interceptors.response.use(
  (r) => r,
  (e) => { if (e.response?.status === 401) handleUnauthorized(); return Promise.reject(e) }
)

export default { authApi, roomApi }
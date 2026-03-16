export interface Cursor {
  userId:   string
  username: string
  line:     number
  column:   number
  color:    string
}

export interface ActiveUser {
  userId:   string
  username: string
  color:    string
}

export interface ClientToServerEvents {
  'room:join':   (roomId: string) => void
  'room:leave':  (roomId: string) => void
  'code:change': (payload: { roomId: string; content: string }) => void
  'cursor:move': (payload: { roomId: string; line: number; column: number }) => void
}

export interface ServerToClientEvents {
  'room:joined':      (payload: { roomId: string; content: string; users: ActiveUser[] }) => void
  'room:user-joined': (user: ActiveUser) => void
  'room:user-left':   (userId: string) => void
  'code:updated':     (payload: { content: string; senderId: string }) => void
  'cursor:updated':   (cursor: Cursor) => void
  'error':            (message: string) => void
}

export interface SocketData {
  userId:   string
  username: string
  color:    string
}
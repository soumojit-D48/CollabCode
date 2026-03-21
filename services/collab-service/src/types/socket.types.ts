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

export interface RoomFile {
  id:        string
  roomId:    string
  name:      string
  path:      string
  content:   string
  createdAt: string
  updatedAt: string
}

export interface ClientToServerEvents {
  'room:join':    (roomId: string) => void
  'room:leave':   (roomId: string) => void
  'code:change':  (payload: { roomId: string; content: string }) => void
  'cursor:move':  (payload: { roomId: string; line: number; column: number }) => void
  'file:open':    (payload: { roomId: string; fileId: string }) => void
  'file:change':  (payload: { roomId: string; fileId: string; content: string }) => void
  'file:create':  (payload: { roomId: string; file: RoomFile }) => void
  'file:delete':  (payload: { roomId: string; fileId: string }) => void
  'file:rename':  (payload: { roomId: string; fileId: string; name: string; path: string }) => void
}

export interface ServerToClientEvents {
  'room:joined':      (payload: { roomId: string; content: string; users: ActiveUser[] }) => void
  'room:user-joined': (user: ActiveUser) => void
  'room:user-left':   (userId: string) => void
  'code:updated':     (payload: { content: string; senderId: string }) => void
  'cursor:updated':   (cursor: Cursor) => void
  'file:opened':      (payload: { fileId: string; content: string }) => void
  'file:updated':     (payload: { fileId: string; content: string; senderId: string }) => void
  'file:created':     (payload: { file: RoomFile }) => void
  'file:deleted':     (payload: { fileId: string }) => void
  'file:renamed':     (payload: { fileId: string; name: string; path: string }) => void
  'error':            (message: string) => void
}

export interface SocketData {
  userId:   string
  username: string
  color:    string
}
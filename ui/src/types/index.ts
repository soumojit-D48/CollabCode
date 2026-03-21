export interface User {
  id:       string
  email:    string
  username: string
}

export interface Room {
  id:        string
  name:      string
  ownerId:   string
  language:  string
  isPublic:  boolean
  createdAt: string
  updatedAt: string
  members:   RoomMember[]
}

export interface RoomMember {
  id:       string
  roomId:   string
  userId:   string
  role:     'OWNER' | 'EDITOR' | 'VIEWER'
  joinedAt: string
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

export interface ActiveUser {
  userId:   string
  username: string
  color:    string
}

export interface CursorPosition {
  line:   number
  column: number
}

export interface Cursor extends CursorPosition {
  userId:   string
  username: string
  color:    string
}

export interface Message {
  id:        string
  userId:    string
  username:  string
  content:   string
  createdAt: string
}

export interface CreateRoomInput {
  name:     string
  language: string
  isPublic: boolean
}

export type Language =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'go'
  | 'rust'
  | 'java'
  | 'cpp'
  | 'c'

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}
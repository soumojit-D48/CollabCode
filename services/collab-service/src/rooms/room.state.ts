import { redisClient } from '../utils/redis'
import { ActiveUser } from '../types/socket.types'

const DAY  = 60 * 60 * 24
const HOUR = 60 * 60

export const getRoomContent = async (id: string) =>
  (await redisClient.get(`room:${id}:content`)) ?? ''

export const setRoomContent = async (id: string, content: string) =>
  redisClient.set(`room:${id}:content`, content, 'EX', DAY)

export const getFileContent = async (roomId: string, fileId: string) =>
  (await redisClient.get(`room:${roomId}:file:${fileId}`)) ?? ''

export const setFileContent = async (
  roomId:  string,
  fileId:  string,
  content: string
) => redisClient.set(`room:${roomId}:file:${fileId}`, content, 'EX', DAY)

export const getActiveUsers = async (id: string): Promise<ActiveUser[]> => {
  const raw = await redisClient.hgetall(`room:${id}:users`)
  return raw ? Object.values(raw).map((v) => JSON.parse(v)) : []
}

export const addActiveUser = async (id: string, user: ActiveUser) => {
  await redisClient.hset(`room:${id}:users`, user.userId, JSON.stringify(user))
  await redisClient.expire(`room:${id}:users`, HOUR)
}

export const removeActiveUser = async (id: string, userId: string) =>
  redisClient.hdel(`room:${id}:users`, userId)

export const setCursor = async (
  id:     string,
  userId: string,
  data:   { line: number; column: number }
) => {
  await redisClient.hset(`room:${id}:cursors`, userId, JSON.stringify(data))
  await redisClient.expire(`room:${id}:cursors`, HOUR)
}

export const removeCursor = async (id: string, userId: string) =>
  redisClient.hdel(`room:${id}:cursors`, userId)
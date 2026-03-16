import Redis from 'ioredis'
import { logger } from '@collab/shared'

const url = process.env.REDIS_URL

const options = url
  ? { connectTimeout: 10000, tls: {} }
  : {
      host: process.env.REDIS_HOST ?? 'localhost',
      port: Number(process.env.REDIS_PORT ?? 6379),
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times: number) => Math.min(times * 100, 3000),
    }

const createClient = () => url ? new Redis(url, { connectTimeout: 10000, tls: {} }) : new Redis(options as any)

export const pubClient   = createClient()
export const subClient   = pubClient.duplicate()
export const redisClient = pubClient.duplicate()

pubClient.on('error',   (e: Error) => logger.error('Redis pub error',  { err: e.message }))
subClient.on('error',   (e: Error) => logger.error('Redis sub error',  { err: e.message }))
redisClient.on('error', (e: Error) => logger.error('Redis main error', { err: e.message }))
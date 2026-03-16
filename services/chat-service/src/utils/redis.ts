import Redis from 'ioredis'
import { logger } from '@collab/shared'

const url = process.env.REDIS_URL

const createClient = () => {
  const client = url 
    ? new Redis(url, { connectTimeout: 10000, tls: {} })
    : new Redis({
        host: process.env.REDIS_HOST ?? 'localhost',
        port: Number(process.env.REDIS_PORT ?? 6379),
        password: process.env.REDIS_PASSWORD,
        retryStrategy: (t: number) => Math.min(t * 100, 3000),
      })
  client.on('ready', () => logger.info('Redis client ready'))
  return client
}

export const pubClient = createClient()
export const subClient = pubClient.duplicate()

pubClient.on('error', (e: Error) => logger.error('Chat Redis pub error', { err: e.message }))
subClient.on('error', (e: Error) => logger.error('Chat Redis sub error', { err: e.message }))
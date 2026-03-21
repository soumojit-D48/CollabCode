import Redis from 'ioredis'
import { logger } from '@collab/shared'
import { saveSnapshot } from '../storage/snapshot.storage'

const url = process.env.REDIS_URL

const createClient = () => 
  url 
    ? new Redis(url, { connectTimeout: 10000, tls: {} })
    : new Redis({
        host: process.env.REDIS_HOST ?? 'localhost',
        port: Number(process.env.REDIS_PORT ?? 6379),
        retryStrategy: (t: number) => Math.min(t * 100, 3000),
      })

export const startSubscriber = async () => {
  const subClient  = createClient()
  const mainClient = createClient()

  subClient.on('error',  (e: Error) => logger.error('Snapshot sub error',  { err: e.message }))
  mainClient.on('error', (e: Error) => logger.error('Snapshot main error', { err: e.message }))

  const INTERVAL = Number(process.env.SNAPSHOT_INTERVAL_MS ?? 30_000)

  const pollAndSave = async () => {
    try {
      const keys = await mainClient.keys('room:*:content')
      if (!keys.length) return

      await Promise.all(
        keys.map(async (key) => {
          const roomId  = key.split(':')[1]
          const content = await mainClient.get(key)
          if (content !== null) await saveSnapshot(roomId, content)
        })
      )
    } catch (err) {
      logger.error('Snapshot poll error', { err })
    }
  }

  setInterval(pollAndSave, INTERVAL)
  logger.info(`Snapshot polling every ${INTERVAL / 1000}s`)

  await subClient.config('SET', 'notify-keyspace-events', 'KEA')
  await subClient.subscribe('__keyevent@0__:set', (err) => {
    if (err) logger.error('Snapshot subscribe error', { err: err.message })
  })

  subClient.on('message', async (_channel, key) => {
    if (!key.match(/^room:.+:content$/)) return

    const roomId  = key.split(':')[1]
    const content = await mainClient.get(key)
    if (content !== null) await saveSnapshot(roomId, content)
  })

  logger.info('Snapshot subscriber listening for content changes')
}
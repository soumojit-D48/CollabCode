import 'dotenv/config'
import http from 'http'
import app from './app'
import { createSocketServer } from './socket/socket.server'
import { pubClient, subClient, redisClient } from './utils/redis'
import { logger } from '@collab/shared'

const PORT = process.env.PORT ?? 3003

async function main() {
  await Promise.all([
    new Promise<void>((res) => pubClient.on('ready', res)),
    new Promise<void>((res) => subClient.on('ready', res)),
    new Promise<void>((res) => redisClient.on('ready', res)),
  ])
  logger.info('Redis connections ready')

  const httpServer = http.createServer(app)
  createSocketServer(httpServer)
  httpServer.listen(PORT, () => logger.info(`Collab service running on port ${PORT}`))
}

main().catch((err) => {
  logger.error('Failed to start collab service', { err })
  process.exit(1)
})
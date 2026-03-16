import 'dotenv/config'
import http from 'http'
import mongoose from 'mongoose'
import app from './app'
import { createChatSocketServer } from './socket/socket.server'
import { pubClient, subClient } from './utils/redis'
import { logger } from '@collab/shared'

const PORT = process.env.PORT ?? 3004

async function main() {
  await mongoose.connect(process.env.MONGO_URI as string)
  logger.info('Connected to MongoDB')

  const redisReady = new Promise<void>((resolve) => {
    const timeout = setTimeout(() => {
      logger.warn('Redis ready timeout, starting anyway')
      resolve()
    }, 5000)
    pubClient.on('ready', () => {
      clearTimeout(timeout)
      resolve()
    })
  })
  
  await redisReady
  logger.info('Redis connections ready')

  const httpServer = http.createServer(app)
  createChatSocketServer(httpServer)
  httpServer.listen(PORT, () => logger.info(`Chat service running on port ${PORT}`))
}

main().catch((err) => {
  logger.error('Failed to start chat service', { err })
  process.exit(1)
})

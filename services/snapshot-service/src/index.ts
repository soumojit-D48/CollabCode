import 'dotenv/config'
import express from 'express'
import { startSubscriber } from './subscriber/snapshot.subscriber'
import { logger } from '@collab/shared'

const app = express()
const PORT = process.env.PORT ?? 3005

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'snapshot-service' })
})

async function main() {
  logger.info('Starting snapshot service...')
  await startSubscriber()
  
  app.listen(PORT, () => logger.info(`Snapshot service running on port ${PORT}`))
}

main().catch((err) => {
  logger.error('Failed to start snapshot service', { err })
  process.exit(1)
})

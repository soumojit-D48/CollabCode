import 'dotenv/config'
import app from './app'
import prisma from './prisma'
import { logger } from '@collab/shared'

const PORT = process.env.PORT ?? 3002

async function main() {
  try {
    await prisma.$connect()
    logger.info('Connected to PostgreSQL')
    app.listen(PORT, () => logger.info(`Room service running on port ${PORT}`))
  } catch (err) {
    logger.error('Failed to start room service', { err })
    process.exit(1)
  }
}

main()
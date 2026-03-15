import { PrismaClient } from '@prisma/client'
import { logger } from '@collab/shared'

const prisma = new PrismaClient({
  log: [{ emit: 'event', level: 'error' }],
})

prisma.$on('error', (e: any) => {
  logger.error('Prisma error', { message: e.message })
})

export default prisma
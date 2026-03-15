import { PrismaClient } from '@prisma/client'
import { logger } from '@collab/shared'

const prisma = new PrismaClient({
  log: [{ emit: 'event', level: 'error' }],
})

prisma.$on('error', (e) => logger.error('Prisma error', { message: e.message }))

export default prisma
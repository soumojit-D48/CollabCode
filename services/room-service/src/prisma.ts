import { PrismaClient } from '../generated/client'
import { logger } from '@collab/shared'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: [{ emit: 'event', level: 'error' }],
  })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export { prisma }

prisma.$on('error', (e) => logger.error('Prisma error', { message: e.message }))

prisma.$connect()
  .then(() => logger.info('Prisma connected'))
  .catch((e) => logger.error('Prisma connection error', { message: e.message }))

export default prisma
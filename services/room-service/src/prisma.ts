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

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma
}

export { prisma }

prisma.$on('error', (e) => logger.error('Prisma error', { message: e.message }))

prisma.$use(async (params, next) => {
  try {
    return await next(params)
  } catch (error: any) {
    if (error.message?.includes('connection') || error.message?.includes('PrismaClientKnownRequestError')) {
      logger.info('Reconnecting to database...')
      await prisma.$disconnect()
      await prisma.$connect()
      return await next(params)
    }
    throw error
  }
})

async function connectWithRetry() {
  for (let i = 0; i < 5; i++) {
    try {
      await prisma.$connect()
      logger.info('Prisma connected')
      return
    } catch (e) {
      logger.error('Prisma connection failed, retrying...', { attempt: i + 1 })
      await new Promise((r) => setTimeout(r, 2000))
    }
  }
}

connectWithRetry()

export default prisma
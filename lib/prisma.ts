// lib/prisma.ts
import { PrismaClient } from '@/app/generated/prisma/client'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn'], // 'query' can be noisy
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client with build-time safety and Neon-Vercel integration support
function createPrismaClient() {
  // Check for available database URLs in order of preference for Neon-Vercel integration
  const databaseUrl = process.env.POSTGRES_PRISMA_URL || 
                      process.env.DATABASE_URL || 
                      process.env.POSTGRES_URL;

  // During build time, only return null if we're in a true build context (no database URLs at all)
  if (!databaseUrl) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('No database URL available in production environment')
    } else {
      console.warn('No database URL available, skipping Prisma client creation')
    }
    return null
  }

  try {
    const client = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl
        }
      },
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
    
    console.log(`Prisma client created with database URL: ${databaseUrl.substring(0, 20)}...`)
    return client
  } catch (error) {
    console.error('Failed to create Prisma client:', error)
    return null
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma
}
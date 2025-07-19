// Database statistics interface
interface DatabaseStats {
  users: number
  projects: number
  scenarios: number
  sessions: number
  poolSize: number
  connectionTimeout: number
  isConnected: boolean
}

// Build-safe Prisma client - only created when actually needed
let prismaClient: any = null

const getPrismaClient = async (): Promise<any> => {
  if (!prismaClient) {
    // Only import Prisma at runtime, not build time
    const { PrismaClient } = await import('@prisma/client')
    prismaClient = new PrismaClient()
  }
  return prismaClient
}

// Simple database manager
class DatabaseManager {
  private static instance: DatabaseManager
  private isConnected = false

  private constructor() {}

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager()
    }
    return DatabaseManager.instance
  }

  public async getClient(): Promise<any> {
    return getPrismaClient()
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('ℹ️ Database already connected')
      return
    }

    try {
      const client = await getPrismaClient()
      await client.$connect()
      this.isConnected = true
      console.log('✅ Database connected successfully')
    } catch (error) {
      console.error('❌ Database connection failed:', error)
      this.isConnected = false
      throw error
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected || !prismaClient) {
      console.log('ℹ️ Database already disconnected')
      return
    }

    try {
      await prismaClient.$disconnect()
      this.isConnected = false
      prismaClient = null
      console.log('✅ Database disconnected successfully')
    } catch (error) {
      console.error('❌ Database disconnection failed:', error)
      throw error
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      const client = await getPrismaClient()
      await client.$queryRaw`SELECT 1 as health_check`
      return true
    } catch (error) {
      console.error('❌ Database health check failed:', error)
      return false
    }
  }

  public async getStats(): Promise<DatabaseStats> {
    try {
      const client = await getPrismaClient()
      const [userCount, projectCount, scenarioCount, sessionCount] = await Promise.all([
        client.user.count(),
        client.project.count(),
        client.scenario.count(),
        client.userSession.count(),
      ])

      return {
        users: userCount,
        projects: projectCount,
        scenarios: scenarioCount,
        sessions: sessionCount,
        poolSize: 10,
        connectionTimeout: 30000,
        isConnected: this.isConnected,
      }
    } catch (error) {
      console.error('❌ Failed to get database stats:', error)
      throw error
    }
  }
}

// Export singleton instance
const dbManager = DatabaseManager.getInstance()

// Convenience exports for backward compatibility
export const prisma = () => getPrismaClient()
export const connectDatabase = () => dbManager.connect()
export const disconnectDatabase = () => dbManager.disconnect()
export const checkDatabaseHealth = () => dbManager.healthCheck()
export const getDatabaseStats = () => dbManager.getStats()

// Export types for convenience
export type { DatabaseStats } 
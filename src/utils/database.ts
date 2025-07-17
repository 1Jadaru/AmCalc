import { PrismaClient } from '../generated/prisma'

// Environment variable validation with better error messages
const validateEnvironmentVariables = () => {
  const requiredEnvVars = {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_URL_TEST: process.env.DATABASE_URL_TEST,
    DATABASE_POOL_SIZE: process.env.DATABASE_POOL_SIZE,
    DATABASE_CONNECTION_TIMEOUT: process.env.DATABASE_CONNECTION_TIMEOUT,
  }

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }
}

// Parse and validate pool settings with better defaults
const parsePoolSettings = () => {
  const poolSize = parseInt(process.env.DATABASE_POOL_SIZE || '10', 10)
  const connectionTimeout = parseInt(process.env.DATABASE_CONNECTION_TIMEOUT || '30000', 10)

  if (poolSize < 1 || poolSize > 100) {
    throw new Error('DATABASE_POOL_SIZE must be between 1 and 100')
  }

  if (connectionTimeout < 1000 || connectionTimeout > 300000) {
    throw new Error('DATABASE_CONNECTION_TIMEOUT must be between 1000ms and 300000ms')
  }

  return { poolSize, connectionTimeout }
}

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

// Singleton Prisma client with better configuration
class DatabaseManager {
  private static instance: DatabaseManager
  private prisma: PrismaClient
  private isConnected = false
  private readonly poolSettings: { poolSize: number; connectionTimeout: number }

  private constructor() {
    validateEnvironmentVariables()
    this.poolSettings = parsePoolSettings()

    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      log: process.env.NODE_ENV === 'development' 
        ? ['query', 'error', 'warn'] 
        : ['error'],
    })
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager()
    }
    return DatabaseManager.instance
  }

  public getClient(): PrismaClient {
    return this.prisma
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('ℹ️ Database already connected')
      return
    }

    try {
      await this.prisma.$connect()
      this.isConnected = true
      console.log('✅ Database connected successfully')
    } catch (error) {
      console.error('❌ Database connection failed:', error)
      this.isConnected = false
      throw error
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      console.log('ℹ️ Database already disconnected')
      return
    }

    try {
      await this.prisma.$disconnect()
      this.isConnected = false
      console.log('✅ Database disconnected successfully')
    } catch (error) {
      console.error('❌ Database disconnection failed:', error)
      throw error
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1 as health_check`
      return true
    } catch (error) {
      console.error('❌ Database health check failed:', error)
      return false
    }
  }

  public async getStats(): Promise<DatabaseStats> {
    try {
      const [userCount, projectCount, scenarioCount, sessionCount] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.project.count(),
        this.prisma.scenario.count(),
        this.prisma.userSession.count(),
      ])

      return {
        users: userCount,
        projects: projectCount,
        scenarios: scenarioCount,
        sessions: sessionCount,
        poolSize: this.poolSettings.poolSize,
        connectionTimeout: this.poolSettings.connectionTimeout,
        isConnected: this.isConnected,
      }
    } catch (error) {
      console.error('❌ Failed to get database stats:', error)
      throw error
    }
  }

  public getPoolSettings() {
    return { ...this.poolSettings }
  }
}

// Export singleton instance
const dbManager = DatabaseManager.getInstance()

// Convenience exports for backward compatibility
export const prisma = dbManager.getClient()
export const connectDatabase = () => dbManager.connect()
export const disconnectDatabase = () => dbManager.disconnect()
export const checkDatabaseHealth = () => dbManager.healthCheck()
export const getDatabaseStats = () => dbManager.getStats()

// Export types for convenience
export type { User, Project, Scenario, UserSession } from '../generated/prisma'
export type { DatabaseStats } 
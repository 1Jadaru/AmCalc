import { connectDatabase, disconnectDatabase, checkDatabaseHealth, getDatabaseStats, prisma } from './database'

describe('Database Connection', () => {
  beforeAll(async () => {
    await connectDatabase()
  })

  afterAll(async () => {
    await disconnectDatabase()
  })

  describe('Basic Connection Tests', () => {
    it('should connect to database successfully', async () => {
      const result = await prisma.$queryRaw`SELECT 1 as test`
      expect(result).toEqual([{ test: 1 }])
    })

    it('should pass health check', async () => {
      const isHealthy = await checkDatabaseHealth()
      expect(isHealthy).toBe(true)
    })

    it('should return database statistics with correct structure', async () => {
      const stats = await getDatabaseStats()
      
      // Check all required properties exist
      expect(stats).toHaveProperty('users')
      expect(stats).toHaveProperty('projects')
      expect(stats).toHaveProperty('scenarios')
      expect(stats).toHaveProperty('sessions')
      expect(stats).toHaveProperty('poolSize')
      expect(stats).toHaveProperty('connectionTimeout')
      expect(stats).toHaveProperty('isConnected')

      // Check data types
      expect(typeof stats.users).toBe('number')
      expect(typeof stats.projects).toBe('number')
      expect(typeof stats.scenarios).toBe('number')
      expect(typeof stats.sessions).toBe('number')
      expect(typeof stats.poolSize).toBe('number')
      expect(typeof stats.connectionTimeout).toBe('number')
      expect(typeof stats.isConnected).toBe('boolean')

      // Check reasonable values
      expect(stats.poolSize).toBeGreaterThan(0)
      expect(stats.poolSize).toBeLessThanOrEqual(100)
      expect(stats.connectionTimeout).toBeGreaterThan(0)
      expect(stats.connectionTimeout).toBeLessThanOrEqual(300000)
      expect(stats.isConnected).toBe(true)
    })
  })

  describe('Data Integrity Tests', () => {
    it('should have seeded data with reasonable counts', async () => {
      const userCount = await prisma.user.count()
      const projectCount = await prisma.project.count()
      const scenarioCount = await prisma.scenario.count()
      const sessionCount = await prisma.userSession.count()

      expect(userCount).toBeGreaterThan(0)
      expect(projectCount).toBeGreaterThan(0)
      expect(scenarioCount).toBeGreaterThan(0)
      expect(sessionCount).toBeGreaterThan(0)

      // Verify relationships are intact
      expect(scenarioCount).toBeGreaterThanOrEqual(projectCount)
      expect(sessionCount).toBeGreaterThanOrEqual(userCount)
    })

    it('should have valid user data', async () => {
      const users = await prisma.user.findMany()
      expect(users.length).toBeGreaterThan(0)

      const demoUser = users.find(user => user.email === 'demo@amcalc.com')
      expect(demoUser).toBeDefined()
      expect(demoUser?.is_active).toBe(true)
      expect(demoUser?.email_verified).toBe(true)
    })

    it('should have valid project relationships', async () => {
      const projects = await prisma.project.findMany({
        include: {
          user: true,
          scenarios: true,
        },
      })

      expect(projects.length).toBeGreaterThan(0)

      for (const project of projects) {
        expect(project.user).toBeDefined()
        expect(project.user_id).toBe(project.user.id)
        expect(project.scenarios.length).toBeGreaterThan(0)
      }
    })

    it('should have valid scenario data with calculations', async () => {
      const scenarios = await prisma.scenario.findMany({
        include: {
          project: true,
        },
      })

      expect(scenarios.length).toBeGreaterThan(0)

      for (const scenario of scenarios) {
        // Check required fields
        expect(Number(scenario.principal)).toBeGreaterThan(0)
        expect(Number(scenario.interest_rate)).toBeGreaterThan(0)
        expect(Number(scenario.interest_rate)).toBeLessThanOrEqual(1)
        expect(scenario.term_years).toBeGreaterThan(0)
        expect(scenario.term_years).toBeLessThanOrEqual(50)

        // Check calculated fields
        if (scenario.payment_amount) {
          expect(Number(scenario.payment_amount)).toBeGreaterThan(0)
        }
        if (scenario.total_interest) {
          expect(Number(scenario.total_interest)).toBeGreaterThan(0)
        }
        if (scenario.total_payments) {
          expect(Number(scenario.total_payments)).toBeGreaterThan(Number(scenario.principal))
        }

        // Check relationships
        expect(scenario.project).toBeDefined()
        expect(scenario.project_id).toBe(scenario.project.id)
      }
    })
  })

  describe('Database Schema Tests', () => {
    it('should enforce unique email constraint', async () => {
      const existingUser = await prisma.user.findFirst()
      expect(existingUser).toBeDefined()

      if (existingUser) {
        await expect(
          prisma.user.create({
            data: {
              email: existingUser.email,
              password_hash: 'test_hash',
            },
          })
        ).rejects.toThrow()
      }
    })

    it('should enforce foreign key constraints', async () => {
      const invalidUserId = '550e8400-e29b-41d4-a716-999999999999'
      
      await expect(
        prisma.project.create({
          data: {
            user_id: invalidUserId,
            name: 'Test Project',
          },
        })
      ).rejects.toThrow()
    })

    it('should handle UUID generation correctly', async () => {
      const newUser = await prisma.user.create({
        data: {
          email: `test-${Date.now()}@example.com`,
          password_hash: 'test_hash',
        },
      })

      expect(newUser.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
      
      // Cleanup
      await prisma.user.delete({ where: { id: newUser.id } })
    })
  })

  describe('Performance Tests', () => {
    it('should handle concurrent queries efficiently', async () => {
      const startTime = Date.now()
      
      const promises = Array.from({ length: 10 }, () => 
        prisma.user.count()
      )
      
      const results = await Promise.all(promises)
      const endTime = Date.now()
      
      expect(results.length).toBe(10)
      expect(results.every(count => typeof count === 'number')).toBe(true)
      expect(endTime - startTime).toBeLessThan(1000) // Should complete within 1 second
    })

    it('should maintain connection pool under load', async () => {
      const stats = await getDatabaseStats()
      expect(stats.isConnected).toBe(true)
      
      // Perform multiple operations
      for (let i = 0; i < 5; i++) {
        await prisma.user.count()
        await prisma.project.count()
        await prisma.scenario.count()
      }
      
      const statsAfter = await getDatabaseStats()
      expect(statsAfter.isConnected).toBe(true)
    })
  })
}) 
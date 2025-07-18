// Alternative seed script using raw SQL to avoid Prisma query engine issues
import { Client } from 'pg'

async function main() {
  console.log('🚀 Starting database seeding with SQL...')

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    await client.connect()
    console.log('✅ Database connection established')

    // Validate environment
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required')
    }

    // Create sample user
    const userResult = await client.query(`
      INSERT INTO "User" (id, email, password_hash, first_name, last_name, is_active, email_verified, created_at, updated_at)
      VALUES (
        gen_random_uuid(),
        'demo@amcalc.com',
        '$2b$10$example.hash.for.demo.user',
        'Demo',
        'User',
        true,
        true,
        NOW(),
        NOW()
      )
      ON CONFLICT (email) DO NOTHING
      RETURNING id, email
    `)

    const user = userResult.rows[0]
    console.log('✅ Created demo user:', user?.email || 'already exists')

    // Get user ID (either newly created or existing)
    const userQuery = await client.query(`
      SELECT id FROM "User" WHERE email = 'demo@amcalc.com'
    `)
    const userId = userQuery.rows[0]?.id

    if (!userId) {
      throw new Error('Failed to get user ID')
    }

    // Create sample project
    const projectResult = await client.query(`
      INSERT INTO "Project" (id, user_id, name, description, is_archived, created_at, updated_at)
      VALUES (
        '550e8400-e29b-41d4-a716-446655440000',
        $1,
        'My First Mortgage',
        'A sample mortgage calculation project for demonstration purposes',
        false,
        NOW(),
        NOW()
      )
      ON CONFLICT (id) DO NOTHING
      RETURNING id, name
    `, [userId])

    const project = projectResult.rows[0]
    console.log('✅ Created sample project:', project?.name || 'already exists')

    // Create sample scenarios
    const scenarios = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: '30-Year Fixed Rate',
        principal: 300000.00,
        interest_rate: 0.0450,
        term_years: 30,
        payment_frequency: 'monthly',
        payment_amount: 1520.06,
        total_interest: 247221.60,
        total_payments: 547221.60,
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: '15-Year Fixed Rate',
        principal: 300000.00,
        interest_rate: 0.0400,
        term_years: 15,
        payment_frequency: 'monthly',
        payment_amount: 2219.06,
        total_interest: 99430.80,
        total_payments: 399430.80,
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Jumbo Loan',
        principal: 750000.00,
        interest_rate: 0.0525,
        term_years: 30,
        payment_frequency: 'monthly',
        payment_amount: 4147.31,
        total_interest: 743031.60,
        total_payments: 1493031.60,
      },
    ]

    for (const scenario of scenarios) {
      const amortizationSchedule = {
        payments: [
          {
            payment: 1,
            principal: Math.round(scenario.payment_amount * 0.3 * 100) / 100,
            interest: Math.round(scenario.payment_amount * 0.7 * 100) / 100,
            balance: Math.round(scenario.principal * 0.99 * 100) / 100,
          },
          {
            payment: 2,
            principal: Math.round(scenario.payment_amount * 0.31 * 100) / 100,
            interest: Math.round(scenario.payment_amount * 0.69 * 100) / 100,
            balance: Math.round(scenario.principal * 0.98 * 100) / 100,
          },
          {
            payment: 3,
            principal: Math.round(scenario.payment_amount * 0.32 * 100) / 100,
            interest: Math.round(scenario.payment_amount * 0.68 * 100) / 100,
            balance: Math.round(scenario.principal * 0.97 * 100) / 100,
          },
        ]
      }

      await client.query(`
        INSERT INTO "Scenario" (
          id, project_id, name, principal, interest_rate, term_years, 
          payment_frequency, start_date, payment_amount, total_interest, 
          total_payments, amortization_schedule, metadata, created_at, updated_at
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW()
        )
        ON CONFLICT (id) DO NOTHING
      `, [
        scenario.id,
        '550e8400-e29b-41d4-a716-446655440000',
        scenario.name,
        scenario.principal,
        scenario.interest_rate,
        scenario.term_years,
        scenario.payment_frequency,
        new Date('2024-01-01'),
        scenario.payment_amount,
        scenario.total_interest,
        scenario.total_payments,
        JSON.stringify(amortizationSchedule),
        JSON.stringify({
          created_by: 'seed_script',
          version: '1.0',
          calculation_method: 'standard_amortization',
          created_at: new Date().toISOString(),
        }),
      ])

      console.log(`✅ Created scenario: ${scenario.name}`)
    }

    // Create sample user session
    await client.query(`
      INSERT INTO "UserSession" (id, user_id, token_hash, expires_at, created_at, updated_at)
      VALUES (
        '550e8400-e29b-41d4-a716-446655440004',
        $1,
        '$2b$10$example.session.token.hash',
        NOW() + INTERVAL '24 hours',
        NOW(),
        NOW()
      )
      ON CONFLICT (id) DO NOTHING
    `, [userId])

    console.log('✅ Created sample user session')

    console.log('🎉 Database seeding completed successfully!')
    console.log(`📊 Created: 1 user, 1 project, ${scenarios.length} scenarios, 1 session`)

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await client.end()
  }
}

main()
  .catch((e) => {
    console.error('❌ Fatal error during seeding:', e)
    process.exit(1)
  }) 
import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

// Validation helpers
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePrincipal = (principal: number): boolean => {
  return principal > 0 && principal <= 10000000 // Max $10M
}

const validateInterestRate = (rate: number): boolean => {
  return rate >= 0 && rate <= 1 // 0% to 100%
}

const validateTermYears = (years: number): boolean => {
  return years >= 1 && years <= 50
}

// Sample data generators
const generateAmortizationSchedule = (principal: number, rate: number, termYears: number) => {
  const monthlyRate = rate / 12
  const totalPayments = termYears * 12
  const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                        (Math.pow(1 + monthlyRate, totalPayments) - 1)

  const payments = []
  let balance = principal

  for (let i = 1; i <= Math.min(3, totalPayments); i++) {
    const interest = balance * monthlyRate
    const principalPayment = monthlyPayment - interest
    balance -= principalPayment

    payments.push({
      payment: i,
      principal: Math.round(principalPayment * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      balance: Math.round(balance * 100) / 100,
    })
  }

  return { payments }
}

async function main() {
  console.log('🌱 Starting database seeding...')

  try {
    // Validate environment
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required')
    }

    // Create sample user with validation
    const userEmail = 'demo@amcalc.com'
    if (!validateEmail(userEmail)) {
      throw new Error('Invalid email format for demo user')
    }

    const user = await prisma.user.upsert({
      where: { email: userEmail },
      update: {},
      create: {
        email: userEmail,
        password_hash: '$2b$10$example.hash.for.demo.user', // In real app, this would be properly hashed
        first_name: 'Demo',
        last_name: 'User',
        is_active: true,
        email_verified: true,
      },
    })

    console.log('✅ Created demo user:', user.email)

    // Create sample project
    const project = await prisma.project.upsert({
      where: { 
        id: '550e8400-e29b-41d4-a716-446655440000'
      },
      update: {},
      create: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        user_id: user.id,
        name: 'My First Mortgage',
        description: 'A sample mortgage calculation project for demonstration purposes',
        is_archived: false,
      },
    })

    console.log('✅ Created sample project:', project.name)

    // Create sample scenarios with validation
    const scenarioData = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: '30-Year Fixed Rate',
        principal: 300000.00,
        interest_rate: 0.0450, // 4.5%
        term_years: 30,
        payment_frequency: 'monthly' as const,
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: '15-Year Fixed Rate',
        principal: 300000.00,
        interest_rate: 0.0400, // 4.0%
        term_years: 15,
        payment_frequency: 'monthly' as const,
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Jumbo Loan',
        principal: 750000.00,
        interest_rate: 0.0525, // 5.25%
        term_years: 30,
        payment_frequency: 'monthly' as const,
      },
    ]

    // Validate scenario data
    for (const data of scenarioData) {
      if (!validatePrincipal(data.principal)) {
        throw new Error(`Invalid principal amount: ${data.principal}`)
      }
      if (!validateInterestRate(data.interest_rate)) {
        throw new Error(`Invalid interest rate: ${data.interest_rate}`)
      }
      if (!validateTermYears(data.term_years)) {
        throw new Error(`Invalid term years: ${data.term_years}`)
      }
    }

    const scenarios = await Promise.all(
      scenarioData.map(async (data) => {
        const amortizationSchedule = generateAmortizationSchedule(
          data.principal,
          data.interest_rate,
          data.term_years
        )

        const monthlyRate = data.interest_rate / 12
        const totalPayments = data.term_years * 12
        const monthlyPayment = data.principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                              (Math.pow(1 + monthlyRate, totalPayments) - 1)
        const totalPaymentsAmount = monthlyPayment * totalPayments
        const totalInterest = totalPaymentsAmount - data.principal

        return prisma.scenario.upsert({
          where: { id: data.id },
          update: {},
          create: {
            id: data.id,
            project_id: project.id,
            name: data.name,
            principal: data.principal,
            interest_rate: data.interest_rate,
            term_years: data.term_years,
            payment_frequency: data.payment_frequency,
            start_date: new Date('2024-01-01'),
            payment_amount: Math.round(monthlyPayment * 100) / 100,
            total_interest: Math.round(totalInterest * 100) / 100,
            total_payments: Math.round(totalPaymentsAmount * 100) / 100,
            amortization_schedule: amortizationSchedule,
            metadata: {
              created_by: 'seed_script',
              version: '1.0',
              calculation_method: 'standard_amortization',
              created_at: new Date().toISOString(),
            },
          },
        })
      })
    )

    console.log('✅ Created sample scenarios:', scenarios.map(s => s.name))

    // Create sample user session
    const session = await prisma.userSession.upsert({
      where: { 
        id: '550e8400-e29b-41d4-a716-446655440004'
      },
      update: {},
      create: {
        id: '550e8400-e29b-41d4-a716-446655440004',
        user_id: user.id,
        token_hash: '$2b$10$example.session.token.hash',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      },
    })

    console.log('✅ Created sample user session')

    console.log('🎉 Database seeding completed successfully!')
    console.log(`📊 Created: 1 user, 1 project, ${scenarios.length} scenarios, 1 session`)

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error('❌ Fatal error during seeding:', e)
    process.exit(1)
  }) 
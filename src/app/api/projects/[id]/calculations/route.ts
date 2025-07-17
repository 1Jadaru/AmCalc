import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { authMiddleware, getAuthenticatedUser, AuthenticatedRequest } from '@/middleware/auth.middleware';

const prisma = new PrismaClient();

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    console.log('Starting calculation save process...');
    
    // Authenticate
    const authResult = await authMiddleware(request);
    if (authResult) {
      console.log('Authentication failed:', authResult.status);
      return authResult;
    }
    
    const user = getAuthenticatedUser(request as AuthenticatedRequest);
    if (!user) {
      console.log('No authenticated user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('User authenticated:', user.id);

    const { id: projectId } = await params;
    if (!projectId) {
      console.log('No project ID provided');
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }
    
    console.log('Project ID:', projectId);

    // Verify project exists and belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        user_id: user.id,
        is_archived: false
      }
    });
    
    if (!project) {
      console.log('Project not found or access denied');
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    console.log('Project found:', project.name);

    const body = await request.json();
    console.log('Request body received:', JSON.stringify(body, null, 2));
    
    const { schedule, name, principal, interest_rate, term_years, payment_frequency, start_date, payment_amount, total_interest, total_payments, metadata } = body;

    if (!schedule || !Array.isArray(schedule)) {
      console.log('Invalid schedule data');
      return NextResponse.json({ error: 'Schedule is required' }, { status: 400 });
    }

    // Convert interest rate from percentage to decimal (e.g., 5.25% -> 0.0525)
    const interestRateDecimal = interest_rate ? (interest_rate / 100).toString() : '0';

    console.log('Creating scenario with data:', {
      project_id: projectId,
      name: name || `Saved Calculation (${new Date().toLocaleString()})`,
      principal: principal ? principal.toString() : '0',
      interest_rate: interestRateDecimal,
      term_years: term_years || 0,
      payment_frequency: payment_frequency || 'monthly',
      start_date: start_date ? new Date(start_date) : null,
      payment_amount: payment_amount ? payment_amount.toString() : null,
      total_interest: total_interest ? total_interest.toString() : null,
      total_payments: total_payments ? total_payments.toString() : null,
    });

    // Convert numeric values to strings for Prisma Decimal fields
    const scenario = await prisma.scenario.create({
      data: {
        project_id: projectId,
        name: name || `Saved Calculation (${new Date().toLocaleString()})`,
        principal: principal ? principal.toString() : '0',
        interest_rate: interestRateDecimal,
        term_years: term_years || 0,
        payment_frequency: payment_frequency || 'monthly',
        start_date: start_date ? new Date(start_date) : null,
        payment_amount: payment_amount ? payment_amount.toString() : null,
        total_interest: total_interest ? total_interest.toString() : null,
        total_payments: total_payments ? total_payments.toString() : null,
        amortization_schedule: schedule,
        metadata: metadata || {},
      },
    });

    console.log('Scenario created successfully:', scenario.id);
    return NextResponse.json({ success: true, scenario }, { status: 201 });
  } catch (error) {
    console.error('Error saving calculation:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 
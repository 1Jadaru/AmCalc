import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware, AuthenticatedRequest } from '../../../../../middleware/auth.middleware';
import { ScenarioService } from '../../../../../services/scenario.service';
import { validateAuthEnvironment } from '../../../../../utils/env.validation';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Validate environment on first API call
    validateAuthEnvironment();

    // Apply authentication middleware
    const authResult = await authMiddleware(request);
    if (authResult) {
      return authResult; // Return the error response from middleware
    }

    const authenticatedRequest = request as AuthenticatedRequest;
    const user = authenticatedRequest.user!;
    const { id: projectId } = await params;

    const body = await request.json();
    console.log('📝 Received calculation data:', JSON.stringify(body, null, 2));
    
    const {
      name,
      principal,
      interest_rate,
      term_years,
      payment_frequency = 'monthly',
      start_date,
      payment_amount,
      total_interest,
      total_payments,
      schedule,
      metadata
    } = body;

    console.log('📝 Extracted fields:', {
      name,
      principal,
      interest_rate,
      term_years,
      payment_frequency,
      start_date,
      payment_amount,
      total_interest,
      total_payments,
      scheduleLength: schedule?.length,
      metadata
    });

    // Validate input
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Calculation name is required' },
        { status: 400 }
      );
    }

    if (!principal || typeof principal !== 'number' || principal <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid principal amount is required' },
        { status: 400 }
      );
    }

    if (!interest_rate || typeof interest_rate !== 'number' || interest_rate < 0) {
      return NextResponse.json(
        { success: false, error: 'Valid interest rate is required' },
        { status: 400 }
      );
    }

    if (!term_years || typeof term_years !== 'number' || term_years <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid term in years is required' },
        { status: 400 }
      );
    }

    console.log('Creating scenario for project:', projectId, 'user:', user.id);

    // Convert interest rate from percentage to decimal if needed
    const interestRateDecimal = interest_rate > 1 ? interest_rate / 100 : interest_rate;

    // Create the scenario
    const scenario = await ScenarioService.createScenario(projectId, user.id, {
      name: name.trim(),
      principal,
      interestRate: interestRateDecimal,
      termYears: term_years,
      paymentFrequency: payment_frequency,
      startDate: start_date ? new Date(start_date) : undefined,
      paymentAmount: payment_amount,
      totalInterest: total_interest,
      totalPayments: total_payments,
      amortizationSchedule: schedule,
      metadata
    });

    console.log('Scenario created successfully:', scenario.id);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Calculation saved successfully',
        data: { scenario }
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('💥 Save calculation error:', error);
    console.error('💥 Error message:', error.message);
    console.error('💥 Error stack:', error.stack);
    console.error('💥 Error code:', error.code);
    console.error('💥 Error detail:', error.detail);
    console.error('💥 Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    
    if (error.message === 'Project not found or access denied') {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to save calculation', details: error.message },
      { status: 500 }
    );
  }
} 
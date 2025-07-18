import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { principal, interestRate, termYears, paymentFrequency = 'monthly' } = body;

    // Validate input
    if (!principal || !interestRate || !termYears) {
      return NextResponse.json(
        { success: false, error: 'Principal, interest rate, and term are required' },
        { status: 400 }
      );
    }

    // Calculate amortization (simplified for build safety)
    const monthlyRate = interestRate / 12 / 100;
    const totalPayments = termYears * 12;
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                          (Math.pow(1 + monthlyRate, totalPayments) - 1);

    const totalPaymentsAmount = monthlyPayment * totalPayments;
    const totalInterest = totalPaymentsAmount - principal;

    // Generate first few payments for preview
    const schedule = [];
    let balance = principal;
    for (let i = 1; i <= Math.min(3, totalPayments); i++) {
      const interest = balance * monthlyRate;
      const principalPayment = monthlyPayment - interest;
      balance -= principalPayment;

      schedule.push({
        payment: i,
        principal: Math.round(principalPayment * 100) / 100,
        interest: Math.round(interest * 100) / 100,
        balance: Math.round(balance * 100) / 100,
      });
    }

    return NextResponse.json(
      { 
        success: true,
        data: {
          principal,
          interestRate,
          termYears,
          paymentFrequency,
          monthlyPayment: Math.round(monthlyPayment * 100) / 100,
          totalInterest: Math.round(totalInterest * 100) / 100,
          totalPayments: Math.round(totalPaymentsAmount * 100) / 100,
          schedule
        }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Calculator error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Calculation failed' },
      { status: 500 }
    );
  }
} 
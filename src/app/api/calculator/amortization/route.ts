import { NextRequest, NextResponse } from 'next/server';
import { calculatorService } from '@/services/calculator.service';
import { amortizationInputsSchema } from '@/utils/validation';
// import { authMiddleware } from '@/middleware/auth.middleware';

export async function POST(req: NextRequest) {
  // Authentication removed to make this endpoint public
  try {
    const body = await req.json();
    const parseResult = amortizationInputsSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({
        success: false,
        error: parseResult.error.issues.map((e: any) => e.message).join(', '),
      }, { status: 400 });
    }
    const results = await calculatorService.calculateAmortization(parseResult.data);
    return NextResponse.json({ success: true, data: results });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error',
    }, { status: 400 });
  }
} 
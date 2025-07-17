import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../../../../services/auth.service';
import { passwordResetRequestSchema } from '../../../../utils/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = passwordResetRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: validationResult.error.issues 
        },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    // Request password reset
    await AuthService.requestPasswordReset(email);

    return NextResponse.json(
      { 
        success: true, 
        message: 'If an account with that email exists, a password reset link has been sent.'
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Password reset request error:', error);
    
    // Always return success to prevent email enumeration
    return NextResponse.json(
      { 
        success: true, 
        message: 'If an account with that email exists, a password reset link has been sent.'
      },
      { status: 200 }
    );
  }
} 
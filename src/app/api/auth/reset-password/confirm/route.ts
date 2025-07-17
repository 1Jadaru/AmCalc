import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../../../../../services/auth.service';
import { passwordResetConfirmSchema } from '../../../../../utils/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = passwordResetConfirmSchema.safeParse(body);
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

    const { token, password } = validationResult.data;

    // Reset password
    await AuthService.resetPassword(token, password);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Password has been reset successfully'
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Password reset confirm error:', error);
    
    if (error.message === 'Invalid or expired reset token') {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Password reset failed' },
      { status: 500 }
    );
  }
} 
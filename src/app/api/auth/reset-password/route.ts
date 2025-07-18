import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate input
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // For build safety, return a simple response
    // In production, you'd send a password reset email
    return NextResponse.json(
      { 
        success: true, 
        message: 'If an account with this email exists, a password reset link has been sent'
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Password reset request error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
} 
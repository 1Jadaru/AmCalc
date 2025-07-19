import { NextRequest, NextResponse } from 'next/server';
import { AuthPgService } from '../../../../services/auth-pg.service';
import { validateAuthEnvironment } from '../../../../utils/env.validation';

export async function POST(request: NextRequest) {
  try {
    // Validate environment on first API call
    validateAuthEnvironment();
    
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log('Login attempt for email:', email);

    // Login user using PostgreSQL service
    const { user, accessToken, refreshToken } = await AuthPgService.loginUser({
      email,
      password
    });

    console.log('Login successful for user:', user.id);

    // Create response
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Login successful',
        data: { user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      },
      { status: 200 }
    );

    // Set cookies
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes
      path: '/'
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    console.error('Error stack:', error.stack);
    
    // Handle specific error types
    if (error.message === 'Invalid email or password') {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (error.message === 'Account is deactivated') {
      return NextResponse.json(
        { success: false, error: 'Account is deactivated' },
        { status: 403 }
      );
    }

    // Handle database connection errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.error('Database connection error:', error);
      return NextResponse.json(
        { success: false, error: 'Service temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { success: false, error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
} 

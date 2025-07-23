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
    const result = await AuthPgService.loginUser({
      email,
      password
    });

    console.log('Login successful for user:', result.user.id);

    // Create response with tokens
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Login successful',
        data: { 
          user: {
            id: result.user.id,
            email: result.user.email,
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            isActive: result.user.isActive,
            emailVerified: result.user.emailVerified
          },
          token: result.accessToken,
          refreshToken: result.refreshToken
        }
      },
      { status: 200 }
    );

    // Set HTTP-only cookies for tokens
    console.log('🍪 Setting accessToken cookie...');
    response.cookies.set('accessToken', result.accessToken, {
      httpOnly: false, // Temporarily disable httpOnly for debugging
      secure: false, // Explicitly false for localhost development
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    console.log('🍪 Setting refreshToken cookie...');
    response.cookies.set('refreshToken', result.refreshToken, {
      httpOnly: false, // Temporarily disable httpOnly for debugging
      secure: false, // Explicitly false for localhost development
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    console.log('🍪 Cookies set successfully');

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    console.error('Error stack:', error.stack);
    
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

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
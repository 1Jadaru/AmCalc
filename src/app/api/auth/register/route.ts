import { NextRequest, NextResponse } from 'next/server';
import { AuthPgService } from '../../../../services/auth-pg.service';
import { validateAuthEnvironment } from '../../../../utils/env.validation';

export async function POST(request: NextRequest) {
  try {
    // Validate environment on first API call
    validateAuthEnvironment();
    
    const body = await request.json();
    const { email, password, firstName, lastName } = body;

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    console.log('Registration attempt for email:', email);

    // Register user using PostgreSQL service
    const result = await AuthPgService.registerUser({
      email,
      password,
      firstName,
      lastName
    });

    console.log('Registration successful for user:', result.user.id);

    // Create response with tokens
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'User registered successfully',
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
      { status: 201 }
    );

    // Set HTTP-only cookies for tokens
    console.log('🍪 Setting accessToken cookie after registration...');
    response.cookies.set('accessToken', result.accessToken, {
      httpOnly: false, // Temporarily disable httpOnly for debugging
      secure: false, // Explicitly false for localhost development
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    response.cookies.set('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: false, // Set to true in production
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;

  } catch (error: any) {
    console.error('Registration error:', error);
    console.error('Error stack:', error.stack);
    
    // Handle specific error types
    if (error.message === 'User with this email already exists') {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
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
      { success: false, error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
} 

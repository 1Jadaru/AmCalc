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
    const user = await AuthPgService.registerUser({
      email,
      password,
      firstName,
      lastName
    });

    console.log('Registration successful for user:', user.id);

    return NextResponse.json(
      { 
        success: true, 
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      },
      { status: 201 }
    );

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
import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../../../../services/auth.service';
import { registerApiSchema, RegisterApiData } from '../../../../utils/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body using API schema (no confirmPassword)
    const validationResult = registerApiSchema.safeParse(body);
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

    const { email, password, firstName, lastName }: RegisterApiData = validationResult.data;

    // Register user
    const user = await AuthService.registerUser({
      email,
      password,
      firstName,
      lastName
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'User registered successfully',
        data: { user }
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.message === 'User with this email already exists') {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../../../../services/auth.service';
import { loginSchema } from '../../../../utils/validation';
import { LoginFormData } from '../../../../utils/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = loginSchema.safeParse(body);
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

    const { email, password }: LoginFormData = validationResult.data;

    // Login user
    const { user, accessToken, refreshToken } = await AuthService.loginUser({
      email,
      password
    });

    // Set secure cookies
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Login successful',
        data: { 
          user,
          token: accessToken,
          refreshToken 
        }
      },
      { status: 200 }
    );

    // Set secure HTTP-only cookies
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
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
} 
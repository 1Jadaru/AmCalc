import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../../../../services/auth.service';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (refreshToken) {
      // Get user from token (simplified for build safety)
      try {
        // For now, just clear the session without validation
        // In production, you'd validate the token first
        console.log('Logging out user with refresh token');
      } catch (error) {
        console.error('Token validation error:', error);
      }
    }

    // Clear cookies
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Logout successful'
      },
      { status: 200 }
    );

    // Clear authentication cookies
    response.cookies.set('accessToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    });

    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    });

    return response;

  } catch (error: any) {
    console.error('Logout error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
} 
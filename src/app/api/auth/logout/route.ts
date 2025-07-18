import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware, getAuthenticatedUser } from '../../../../middleware/auth.middleware';
import { AuthService } from '../../../../services/auth.service';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authResponse = await authMiddleware(request);
    if (authResponse) {
      return authResponse;
    }

    const user = getAuthenticatedUser(request as any);
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (refreshToken && user) {
      // Logout user and invalidate session
      await AuthService.logoutUser(user.id, refreshToken);
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
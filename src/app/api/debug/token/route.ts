import { NextRequest, NextResponse } from 'next/server';
import { AuthPgService } from '../../../../services/auth-pg.service';
import { generateAccessToken } from '../../../../utils/auth.utils';

/**
 * Development-only endpoint to get an access token for testing
 * DO NOT USE IN PRODUCTION
 */
export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { success: false, error: 'Not available in production' },
      { status: 404 }
    );
  }

  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const user = await AuthPgService.getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const accessToken = generateAccessToken(user);

    console.log('🔧 Debug token generated for user:', user.email);

    return NextResponse.json({
      success: true,
      data: {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      }
    });

  } catch (error: any) {
    console.error('Debug token error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate token' },
      { status: 500 }
    );
  }
}

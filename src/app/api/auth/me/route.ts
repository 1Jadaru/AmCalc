import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware, getAuthenticatedUser } from '../../../../middleware/auth.middleware';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authResponse = await authMiddleware(request);
    if (authResponse) {
      return authResponse;
    }

    const user = getAuthenticatedUser(request as any);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        data: { user }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Get user profile error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to get user profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const authResponse = await authMiddleware(request);
    if (authResponse) {
      return authResponse;
    }

    const user = getAuthenticatedUser(request as any);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    const body = await request.json();

    // For now, return a simple response
    // In production, you'd update the user profile
    return NextResponse.json(
      { 
        success: true, 
        message: 'Profile updated successfully',
        data: { user }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Update user profile error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
} 
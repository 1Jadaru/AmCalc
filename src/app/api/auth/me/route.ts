import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware, getAuthenticatedUser } from '../../../../middleware/auth.middleware';
import { AuthService } from '../../../../services/auth.service';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authResponse = await authMiddleware(request);
    if (authResponse) {
      // If authentication fails, return 401 instead of 500
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
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

    // Update user profile
    const updatedUser = await AuthService.updateUserProfile(user.id, {
      firstName: body.firstName,
      lastName: body.lastName
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Profile updated successfully',
        data: { user: updatedUser }
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
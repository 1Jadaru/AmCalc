import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // For build safety, return a simple response
    // In production, you'd validate the token and return user's projects
    return NextResponse.json(
      { 
        success: false, 
        error: 'Authentication required',
        message: 'Please log in to access your projects'
      },
      { status: 401 }
    );

  } catch (error: any) {
    console.error('Get projects error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to get projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // For build safety, return a simple response
    // In production, you'd validate the token and create the project
    return NextResponse.json(
      { 
        success: false, 
        error: 'Authentication required',
        message: 'Please log in to create projects'
      },
      { status: 401 }
    );

  } catch (error: any) {
    console.error('Create project error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
} 
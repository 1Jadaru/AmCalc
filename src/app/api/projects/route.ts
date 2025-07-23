import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware, AuthenticatedRequest } from '../../../middleware/auth.middleware';
import { ProjectService } from '../../../services/project.service';
import { validateAuthEnvironment } from '../../../utils/env.validation';

export async function GET(request: NextRequest) {
  try {
    // Validate environment on first API call
    validateAuthEnvironment();

    // Apply authentication middleware
    const authResult = await authMiddleware(request);
    if (authResult) {
      return authResult; // Return the error response from middleware
    }

    const authenticatedRequest = request as AuthenticatedRequest;
    const user = authenticatedRequest.user!;

    console.log('Getting projects for user:', user.id);

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const includeArchived = searchParams.get('includeArchived') === 'true';

    // Get user's projects
    const projects = await ProjectService.getUserProjects(user.id, includeArchived);

    return NextResponse.json(
      { 
        success: true, 
        data: { projects },
        count: projects.length
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Get projects error:', error);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { success: false, error: 'Failed to get projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validate environment on first API call
    validateAuthEnvironment();

    // Apply authentication middleware
    const authResult = await authMiddleware(request);
    if (authResult) {
      return authResult; // Return the error response from middleware
    }

    const authenticatedRequest = request as AuthenticatedRequest;
    const user = authenticatedRequest.user!;

    const body = await request.json();
    const { name, description } = body;

    // Validate input
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Project name is required' },
        { status: 400 }
      );
    }

    if (name.trim().length > 255) {
      return NextResponse.json(
        { success: false, error: 'Project name must be 255 characters or less' },
        { status: 400 }
      );
    }

    console.log('Creating project for user:', user.id);

    // Create the project
    const project = await ProjectService.createProject(user.id, {
      name: name.trim(),
      description: description ? description.trim() : undefined
    });

    console.log('Project created successfully:', project.id);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Project created successfully',
        data: { project }
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Create project error:', error);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
} 
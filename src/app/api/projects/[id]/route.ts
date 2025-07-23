import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware, AuthenticatedRequest } from '../../../../middleware/auth.middleware';
import { ProjectService } from '../../../../services/project.service';
import { validateAuthEnvironment } from '../../../../utils/env.validation';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id: projectId } = await params;

    console.log('Getting project:', projectId, 'for user:', user.id);

    // Get the project
    const project = await ProjectService.getProjectById(projectId, user.id);

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        data: { project }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Get project error:', error);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { success: false, error: 'Failed to get project' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id: projectId } = await params;

    const body = await request.json();
    const { name, description, isArchived } = body;

    // Validate input
    if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
      return NextResponse.json(
        { success: false, error: 'Project name cannot be empty' },
        { status: 400 }
      );
    }

    if (name !== undefined && name.trim().length > 255) {
      return NextResponse.json(
        { success: false, error: 'Project name must be 255 characters or less' },
        { status: 400 }
      );
    }

    console.log('Updating project:', projectId, 'for user:', user.id);

    // Update the project
    const project = await ProjectService.updateProject(projectId, user.id, {
      name: name ? name.trim() : undefined,
      description: description !== undefined ? (description ? description.trim() : null) : undefined,
      isArchived
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    console.log('Project updated successfully:', project.id);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Project updated successfully',
        data: { project }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Update project error:', error);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id: projectId } = await params;

    console.log('Deleting project:', projectId, 'for user:', user.id);

    // Delete the project
    const deleted = await ProjectService.deleteProject(projectId, user.id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    console.log('Project deleted successfully:', projectId);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Project deleted successfully'
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Delete project error:', error);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    );
  }
} 
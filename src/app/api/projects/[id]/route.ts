import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, getAuthenticatedUser, AuthenticatedRequest } from '@/middleware/auth.middleware';

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Authenticate
    const authResult = await authMiddleware(request);
    if (authResult) return authResult;
    const user = getAuthenticatedUser(request as AuthenticatedRequest);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: projectId } = await params;
    if (!projectId) return NextResponse.json({ error: 'Project ID required' }, { status: 400 });

    // Get project with scenarios
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        user_id: user.id
      },
      include: {
        scenarios: {
          orderBy: {
            created_at: 'desc'
          }
        }
      }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: project.id,
      name: project.name,
      description: project.description,
      createdAt: project.created_at,
      updatedAt: project.updated_at,
      scenarioCount: project.scenarios.length,
      scenarios: project.scenarios.map(scenario => ({
        id: scenario.id,
        name: scenario.name,
        principal: scenario.principal,
        interest_rate: scenario.interest_rate,
        term_years: scenario.term_years,
        payment_frequency: scenario.payment_frequency,
        payment_amount: scenario.payment_amount,
        total_interest: scenario.total_interest,
        total_payments: scenario.total_payments,
        amortization_schedule: scenario.amortization_schedule,
        created_at: scenario.created_at,
        updated_at: scenario.updated_at
      }))
    });

  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Authenticate
    const authResult = await authMiddleware(request);
    if (authResult) return authResult;
    const user = getAuthenticatedUser(request as AuthenticatedRequest);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: projectId } = await params;
    if (!projectId) return NextResponse.json({ error: 'Project ID required' }, { status: 400 });

    const body = await request.json();
    const { name, description } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    // Check if project exists and belongs to user
    const existingProject = await prisma.project.findFirst({
      where: {
        id: projectId,
        user_id: user.id
      }
    });

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Update project
    const updatedProject = await prisma.project.update({
      where: {
        id: projectId
      },
      data: {
        name: name.trim(),
        description: description || '',
        updated_at: new Date()
      }
    });

    return NextResponse.json({
      id: updatedProject.id,
      name: updatedProject.name,
      description: updatedProject.description,
      createdAt: updatedProject.created_at,
      updatedAt: updatedProject.updated_at
    });

  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    console.log('Starting project deletion process...');
    
    // Authenticate
    const authResult = await authMiddleware(request);
    if (authResult) {
      console.log('Authentication failed:', authResult.status);
      return authResult;
    }
    
    const user = getAuthenticatedUser(request as AuthenticatedRequest);
    if (!user) {
      console.log('No authenticated user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId } = await params;
    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    console.log('Project ID:', projectId);
    console.log('User ID:', user.id);

    // Check if project exists and belongs to the user
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        user_id: user.id
      },
      include: {
        scenarios: true
      }
    });

    if (!project) {
      console.log('Project not found or access denied');
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    console.log('Project found:', project.name);
    console.log('Scenarios to delete:', project.scenarios.length);

    // Delete project and all its scenarios (cascade delete)
    await prisma.project.delete({
      where: {
        id: projectId
      }
    });

    console.log('Project and all scenarios deleted successfully');

    return NextResponse.json({ 
      message: 'Project and all scenarios deleted successfully',
      deletedProjectId: projectId,
      deletedScenariosCount: project.scenarios.length
    }, { status: 200 });

  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ 
      error: 'Failed to delete project',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 
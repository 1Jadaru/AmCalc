import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { authMiddleware, getAuthenticatedUser, AuthenticatedRequest } from '@/middleware/auth.middleware';

const prisma = new PrismaClient();

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    console.log('Starting scenario deletion process...');
    
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

    const { id: scenarioId } = await params;
    if (!scenarioId) {
      return NextResponse.json({ error: 'Scenario ID required' }, { status: 400 });
    }

    console.log('Scenario ID:', scenarioId);
    console.log('User ID:', user.id);

    // Check if scenario exists and belongs to the user
    const scenario = await prisma.scenario.findFirst({
      where: {
        id: scenarioId,
        project: {
          user_id: user.id
        }
      },
      include: {
        project: true
      }
    });

    if (!scenario) {
      console.log('Scenario not found or access denied');
      return NextResponse.json({ error: 'Scenario not found' }, { status: 404 });
    }

    console.log('Scenario found:', scenario.name);
    console.log('Project:', scenario.project.name);

    // Delete the scenario
    await prisma.scenario.delete({
      where: {
        id: scenarioId
      }
    });

    console.log('Scenario deleted successfully');

    return NextResponse.json({ 
      message: 'Scenario deleted successfully',
      deletedScenarioId: scenarioId
    }, { status: 200 });

  } catch (error) {
    console.error('Error deleting scenario:', error);
    return NextResponse.json({ 
      error: 'Failed to delete scenario',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 
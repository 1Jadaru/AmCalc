import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { authMiddleware, getAuthenticatedUser, AuthenticatedRequest } from '@/middleware/auth.middleware';

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Authenticate
  const authResult = await authMiddleware(request);
  if (authResult) return authResult;
  const user = getAuthenticatedUser(request as AuthenticatedRequest);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const projectId = params.id;
  if (!projectId) return NextResponse.json({ error: 'Project ID required' }, { status: 400 });

  const project = await prisma.project.findFirst({
    where: { id: projectId, user_id: user.id, is_archived: false },
    include: { scenarios: { select: { id: true } } },
  });
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

  return NextResponse.json({
    id: project.id,
    name: project.name,
    description: project.description,
    createdAt: project.created_at,
    updatedAt: project.updated_at,
    scenarioCount: project.scenarios.length,
  });
} 
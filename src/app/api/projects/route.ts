import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { authMiddleware, getAuthenticatedUser, AuthenticatedRequest } from '@/middleware/auth.middleware';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  // Authenticate
  const authResult = await authMiddleware(request);
  if (authResult) return authResult;
  const user = getAuthenticatedUser(request as AuthenticatedRequest);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Fetch projects
  const projects = await prisma.project.findMany({
    where: { user_id: user.id, is_archived: false },
    include: { scenarios: { select: { id: true } } },
    orderBy: { updated_at: 'desc' },
  });
  const projectsWithCount = projects.map(project => ({
    id: project.id,
    name: project.name,
    description: project.description,
    createdAt: project.created_at,
    updatedAt: project.updated_at,
    scenarioCount: project.scenarios.length,
  }));
  return NextResponse.json(projectsWithCount);
}

export async function POST(request: NextRequest) {
  // Authenticate
  const authResult = await authMiddleware(request);
  if (authResult) return authResult;
  const user = getAuthenticatedUser(request as AuthenticatedRequest);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, description } = await request.json();
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
  }
  const project = await prisma.project.create({
    data: {
      user_id: user.id,
      name: name.trim(),
      description: description?.trim() || null,
    },
  });
  return NextResponse.json({
    id: project.id,
    name: project.name,
    description: project.description,
    createdAt: project.created_at,
    updatedAt: project.updated_at,
    scenarioCount: 0,
  }, { status: 201 });
} 
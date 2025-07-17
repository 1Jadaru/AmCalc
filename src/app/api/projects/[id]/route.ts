import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { authMiddleware, getAuthenticatedUser, AuthenticatedRequest } from '@/middleware/auth.middleware';

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Authenticate
  const authResult = await authMiddleware(request);
  if (authResult) return authResult;
  const user = getAuthenticatedUser(request as AuthenticatedRequest);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id: projectId } = await params;
  if (!projectId) return NextResponse.json({ error: 'Project ID required' }, { status: 400 });

  const project = await prisma.project.findFirst({
    where: { id: projectId, user_id: user.id, is_archived: false },
    include: { 
      scenarios: { 
        orderBy: { created_at: 'desc' }
      } 
    },
  });
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

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
      updated_at: scenario.updated_at,
    }))
  });
} 
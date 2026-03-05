import { NextResponse } from 'next/server';
import { createPlan, getAllPlans } from '@/lib/store';
import { ProjectInput } from '@/types/project';

export async function GET() {
  const plans = getAllPlans();
  return NextResponse.json(plans);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { projectName, description, repoUrl, demoUrl } = body as Partial<ProjectInput>;

  if (!projectName || !description || !repoUrl || !demoUrl) {
    return NextResponse.json(
      { error: 'Missing required fields: projectName, description, repoUrl, demoUrl' },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();
  const plan = createPlan({
    id: crypto.randomUUID(),
    input: {
      projectName,
      description,
      repoUrl,
      demoUrl,
      targetAudience: body.targetAudience,
      category: body.category,
      budget: body.budget,
      timeline: body.timeline,
    },
    channels: [],
    createdAt: now,
    updatedAt: now,
  });

  return NextResponse.json(plan, { status: 201 });
}

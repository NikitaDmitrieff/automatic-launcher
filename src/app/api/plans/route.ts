import { NextResponse } from 'next/server';
import { createPlan, getAllPlans } from '@/lib/store';
import { ProjectInput } from '@/types/project';
import { generateRecommendations } from '@/lib/engine';

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

  const input: ProjectInput = {
    projectName,
    description,
    repoUrl,
    demoUrl,
    targetAudience: body.targetAudience,
    category: body.category,
    budget: body.budget,
    timeline: body.timeline,
  };

  const recommendations = generateRecommendations(input);

  const now = new Date().toISOString();
  const plan = createPlan({
    id: crypto.randomUUID(),
    input,
    channels: recommendations.channels.map((c) => c.channel.name),
    recommendations,
    createdAt: now,
    updatedAt: now,
  });

  return NextResponse.json(plan, { status: 201 });
}

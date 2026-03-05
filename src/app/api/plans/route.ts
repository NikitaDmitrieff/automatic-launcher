import { NextResponse } from 'next/server';
import { createPlan, getAllPlans } from '@/lib/store';
import { ProjectInput } from '@/types/project';
import { generateRecommendations } from '@/lib/engine';
import { createPlanSchema, formatZodErrors } from '@/lib/validation';

export async function GET() {
  const plans = getAllPlans();
  return NextResponse.json(plans);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON in request body' },
      { status: 400 }
    );
  }

  const result = createPlanSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: formatZodErrors(result.error) },
      { status: 400 }
    );
  }

  const validated = result.data;

  const input: ProjectInput = {
    projectName: validated.projectName,
    description: validated.description,
    repoUrl: validated.repoUrl || '',
    demoUrl: validated.demoUrl || '',
    targetAudience: validated.targetAudience,
    category: validated.category,
    budget: validated.budget,
    timeline: validated.timeline,
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

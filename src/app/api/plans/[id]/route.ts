import { NextResponse } from 'next/server';
import { getPlan, updatePlan, deletePlan } from '@/lib/store';
import { updatePlanSchema, formatZodErrors } from '@/lib/validation';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const plan = getPlan(id);

  if (!plan) {
    return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
  }

  return NextResponse.json(plan);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const result = updatePlanSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: formatZodErrors(result.error) },
      { status: 400 }
    );
  }

  const existing = getPlan(id);
  if (!existing) {
    return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
  }

  const updatedInput = { ...existing.input, ...result.data };
  const updated = updatePlan(id, { input: updatedInput })!;

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = deletePlan(id);

  if (!deleted) {
    return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Plan deleted' });
}

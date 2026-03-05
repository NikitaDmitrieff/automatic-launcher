import { LaunchPlan } from '@/types/project';

const plans = new Map<string, LaunchPlan>();

export function createPlan(plan: LaunchPlan): LaunchPlan {
  plans.set(plan.id, plan);
  return plan;
}

export function getPlan(id: string): LaunchPlan | undefined {
  return plans.get(id);
}

export function getAllPlans(): LaunchPlan[] {
  return Array.from(plans.values());
}

export function updatePlan(id: string, updates: Partial<LaunchPlan>): LaunchPlan | undefined {
  const existing = plans.get(id);
  if (!existing) return undefined;
  const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
  plans.set(id, updated);
  return updated;
}

export function deletePlan(id: string): boolean {
  return plans.delete(id);
}

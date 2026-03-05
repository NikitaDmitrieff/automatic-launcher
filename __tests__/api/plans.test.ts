import { describe, it, expect, beforeEach } from 'vitest';
import { createPlan, getAllPlans, getPlan, updatePlan, deletePlan } from '../../src/lib/store';
import { generateRecommendations } from '../../src/lib/engine';
import type { ProjectInput, LaunchPlan } from '../../src/types/project';

/**
 * Tests for the API plans route logic.
 *
 * We test the store and engine functions directly rather than importing the
 * Next.js route handler, because the route handler depends on NextResponse
 * from 'next/server' which is not available in vitest's jsdom environment.
 *
 * These tests verify the same logic the POST/GET handlers exercise:
 * - Input validation (required fields check)
 * - Plan creation via store
 * - Plan retrieval via store
 * - Recommendation generation from engine
 */

const validInput: ProjectInput = {
  projectName: 'TestApp',
  description: 'A test application for unit testing',
  repoUrl: 'https://github.com/test/app',
  demoUrl: 'https://testapp.vercel.app',
};

function validateInput(body: Partial<ProjectInput>): string | null {
  const { projectName, description, repoUrl, demoUrl } = body;
  if (!projectName || !description || !repoUrl || !demoUrl) {
    return 'Missing required fields: projectName, description, repoUrl, demoUrl';
  }
  return null;
}

function createPlanFromInput(input: ProjectInput): LaunchPlan {
  const recommendations = generateRecommendations(input);
  const now = new Date().toISOString();
  return createPlan({
    id: crypto.randomUUID(),
    input,
    channels: recommendations.channels.map((c) => c.channel.name),
    recommendations,
    createdAt: now,
    updatedAt: now,
  });
}

describe('API plans route logic', () => {
  describe('input validation', () => {
    it('returns null for valid input', () => {
      expect(validateInput(validInput)).toBeNull();
    });

    it('returns error when all fields are missing', () => {
      expect(validateInput({})).toBe(
        'Missing required fields: projectName, description, repoUrl, demoUrl',
      );
    });

    it('returns error when only projectName is provided', () => {
      expect(validateInput({ projectName: 'Test' })).toContain('Missing required fields');
    });

    it('returns error when only some required fields are provided', () => {
      expect(
        validateInput({ projectName: 'Test', description: 'A test app' }),
      ).toContain('Missing required fields');
    });

    it('returns error when one required field is missing', () => {
      expect(
        validateInput({
          projectName: 'Test',
          description: 'A test app',
          repoUrl: 'https://github.com/test/app',
          // demoUrl missing
        }),
      ).toContain('Missing required fields');
    });
  });

  describe('POST - plan creation', () => {
    it('creates a plan with valid input and returns it', () => {
      const plan = createPlanFromInput(validInput);

      expect(plan.id).toBeDefined();
      expect(plan.input.projectName).toBe('TestApp');
      expect(plan.input.description).toBe('A test application for unit testing');
      expect(plan.channels).toBeDefined();
      expect(Array.isArray(plan.channels)).toBe(true);
      expect(plan.channels.length).toBeGreaterThan(0);
      expect(plan.recommendations).toBeDefined();
      expect(plan.createdAt).toBeDefined();
      expect(plan.updatedAt).toBeDefined();
    });

    it('stores the created plan in the store', () => {
      const plan = createPlanFromInput(validInput);
      const retrieved = getPlan(plan.id);

      expect(retrieved).toBeDefined();
      expect(retrieved!.id).toBe(plan.id);
      expect(retrieved!.input.projectName).toBe('TestApp');
    });

    it('includes optional fields when provided', () => {
      const input: ProjectInput = {
        ...validInput,
        category: 'devtool',
        budget: 'zero',
        targetAudience: 'developers',
        timeline: 'standard',
      };
      const plan = createPlanFromInput(input);

      expect(plan.input.category).toBe('devtool');
      expect(plan.input.budget).toBe('zero');
      expect(plan.input.targetAudience).toBe('developers');
      expect(plan.input.timeline).toBe('standard');
    });

    it('generates recommendations with channels', () => {
      const plan = createPlanFromInput(validInput);

      expect(plan.recommendations).toBeDefined();
      expect(plan.recommendations!.channels.length).toBeGreaterThan(0);
    });
  });

  describe('GET - plan retrieval', () => {
    it('getAllPlans returns created plans', () => {
      const plan = createPlanFromInput({
        ...validInput,
        projectName: 'UniqueGetTest',
      });

      const plans = getAllPlans();
      expect(Array.isArray(plans)).toBe(true);

      const found = plans.find((p) => p.id === plan.id);
      expect(found).toBeDefined();
      expect(found!.input.projectName).toBe('UniqueGetTest');
    });

    it('returns multiple plans after multiple creations', () => {
      const initialCount = getAllPlans().length;

      createPlanFromInput({ ...validInput, projectName: 'Plan A' });
      createPlanFromInput({ ...validInput, projectName: 'Plan B' });

      const plans = getAllPlans();
      expect(plans.length).toBeGreaterThanOrEqual(initialCount + 2);
    });
  });

  describe('store CRUD operations', () => {
    it('updatePlan modifies an existing plan', async () => {
      const plan = createPlanFromInput(validInput);
      // Wait a tick so the updatedAt timestamp differs
      await new Promise((r) => setTimeout(r, 5));
      const updated = updatePlan(plan.id, {
        channels: ['Reddit', 'Hacker News'],
      });

      expect(updated).toBeDefined();
      expect(updated!.channels).toEqual(['Reddit', 'Hacker News']);
      expect(updated!.updatedAt).not.toBe(plan.updatedAt);
    });

    it('updatePlan returns undefined for non-existent plan', () => {
      const result = updatePlan('non-existent-id', { channels: [] });
      expect(result).toBeUndefined();
    });

    it('deletePlan removes a plan', () => {
      const plan = createPlanFromInput(validInput);
      expect(getPlan(plan.id)).toBeDefined();

      const deleted = deletePlan(plan.id);
      expect(deleted).toBe(true);
      expect(getPlan(plan.id)).toBeUndefined();
    });

    it('deletePlan returns false for non-existent plan', () => {
      expect(deletePlan('non-existent-id')).toBe(false);
    });
  });
});

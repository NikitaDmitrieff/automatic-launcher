import { describe, it, expect } from 'vitest';
import { createPlanSchema, formatZodErrors } from '../src/lib/validation';

describe('createPlanSchema', () => {
  const validInput = {
    projectName: 'TestApp',
    description: 'A test application for indie hackers',
  };

  describe('valid inputs', () => {
    it('accepts minimal required fields', () => {
      const result = createPlanSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('accepts all optional fields', () => {
      const result = createPlanSchema.safeParse({
        ...validInput,
        repoUrl: 'https://github.com/test/app',
        demoUrl: 'https://testapp.com',
        tags: ['saas', 'ai'],
        targetAudience: 'developers',
        category: 'saas',
        budget: 'zero',
        timeline: 'rush',
      });
      expect(result.success).toBe(true);
    });

    it('accepts empty strings for repoUrl and demoUrl', () => {
      const result = createPlanSchema.safeParse({
        ...validInput,
        repoUrl: '',
        demoUrl: '',
      });
      expect(result.success).toBe(true);
    });

    it('trims whitespace from projectName and description', () => {
      const result = createPlanSchema.safeParse({
        projectName: '  TestApp  ',
        description: '  A test application  ',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.projectName).toBe('TestApp');
        expect(result.data.description).toBe('A test application');
      }
    });
  });

  describe('projectName validation', () => {
    it('rejects empty projectName', () => {
      const result = createPlanSchema.safeParse({
        ...validInput,
        projectName: '',
      });
      expect(result.success).toBe(false);
    });

    it('rejects projectName over 100 characters', () => {
      const result = createPlanSchema.safeParse({
        ...validInput,
        projectName: 'a'.repeat(101),
      });
      expect(result.success).toBe(false);
    });

    it('accepts projectName at exactly 100 characters', () => {
      const result = createPlanSchema.safeParse({
        ...validInput,
        projectName: 'a'.repeat(100),
      });
      expect(result.success).toBe(true);
    });

    it('rejects missing projectName', () => {
      const result = createPlanSchema.safeParse({
        description: 'A test application',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('description validation', () => {
    it('rejects empty description', () => {
      const result = createPlanSchema.safeParse({
        ...validInput,
        description: '',
      });
      expect(result.success).toBe(false);
    });

    it('rejects description over 200 characters', () => {
      const result = createPlanSchema.safeParse({
        ...validInput,
        description: 'a'.repeat(201),
      });
      expect(result.success).toBe(false);
    });

    it('accepts description at exactly 200 characters', () => {
      const result = createPlanSchema.safeParse({
        ...validInput,
        description: 'a'.repeat(200),
      });
      expect(result.success).toBe(true);
    });
  });

  describe('URL validation', () => {
    it('rejects invalid repoUrl', () => {
      const result = createPlanSchema.safeParse({
        ...validInput,
        repoUrl: 'not-a-url',
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid demoUrl', () => {
      const result = createPlanSchema.safeParse({
        ...validInput,
        demoUrl: 'not-a-url',
      });
      expect(result.success).toBe(false);
    });

    it('accepts valid URLs', () => {
      const result = createPlanSchema.safeParse({
        ...validInput,
        repoUrl: 'https://github.com/user/repo',
        demoUrl: 'https://example.com',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('enum validation', () => {
    it('rejects invalid targetAudience', () => {
      const result = createPlanSchema.safeParse({
        ...validInput,
        targetAudience: 'aliens',
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid category', () => {
      const result = createPlanSchema.safeParse({
        ...validInput,
        category: 'blockchain',
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid budget', () => {
      const result = createPlanSchema.safeParse({
        ...validInput,
        budget: 'unlimited',
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid timeline', () => {
      const result = createPlanSchema.safeParse({
        ...validInput,
        timeline: 'never',
      });
      expect(result.success).toBe(false);
    });

    it('accepts all valid targetAudience values', () => {
      const audiences = ['developers', 'designers', 'marketers', 'founders', 'general'] as const;
      for (const audience of audiences) {
        const result = createPlanSchema.safeParse({
          ...validInput,
          targetAudience: audience,
        });
        expect(result.success).toBe(true);
      }
    });

    it('accepts all valid category values', () => {
      const categories = ['saas', 'devtool', 'mobile-app', 'marketplace', 'content', 'other'] as const;
      for (const category of categories) {
        const result = createPlanSchema.safeParse({
          ...validInput,
          category,
        });
        expect(result.success).toBe(true);
      }
    });

    it('accepts all valid budget values', () => {
      const budgets = ['zero', 'low', 'medium'] as const;
      for (const budget of budgets) {
        const result = createPlanSchema.safeParse({
          ...validInput,
          budget,
        });
        expect(result.success).toBe(true);
      }
    });

    it('accepts all valid timeline values', () => {
      const timelines = ['rush', 'standard', 'relaxed'] as const;
      for (const timeline of timelines) {
        const result = createPlanSchema.safeParse({
          ...validInput,
          timeline,
        });
        expect(result.success).toBe(true);
      }
    });
  });

  describe('tags validation', () => {
    it('accepts an empty tags array', () => {
      const result = createPlanSchema.safeParse({
        ...validInput,
        tags: [],
      });
      expect(result.success).toBe(true);
    });

    it('accepts tags as string array', () => {
      const result = createPlanSchema.safeParse({
        ...validInput,
        tags: ['ai', 'saas', 'productivity'],
      });
      expect(result.success).toBe(true);
    });
  });
});

describe('formatZodErrors', () => {
  it('formats validation errors with field paths and messages', () => {
    const result = createPlanSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      const formatted = formatZodErrors(result.error);
      expect(formatted.length).toBeGreaterThan(0);
      expect(formatted[0]).toHaveProperty('field');
      expect(formatted[0]).toHaveProperty('message');
    }
  });

  it('returns correct field names', () => {
    const result = createPlanSchema.safeParse({
      projectName: '',
      description: '',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const formatted = formatZodErrors(result.error);
      const fields = formatted.map((e) => e.field);
      expect(fields).toContain('projectName');
      expect(fields).toContain('description');
    }
  });
});

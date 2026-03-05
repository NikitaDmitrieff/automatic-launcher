import { z } from 'zod';

export const createPlanSchema = z.object({
  projectName: z
    .string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must be 100 characters or fewer')
    .trim(),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(200, 'Description must be 200 characters or fewer')
    .trim(),
  repoUrl: z
    .string()
    .url('Invalid URL format for repository URL')
    .optional()
    .or(z.literal('')),
  demoUrl: z
    .string()
    .url('Invalid URL format for demo URL')
    .optional()
    .or(z.literal('')),
  tags: z.array(z.string()).optional(),
  targetAudience: z
    .enum(['developers', 'designers', 'marketers', 'founders', 'general'])
    .optional(),
  category: z
    .enum(['saas', 'devtool', 'mobile-app', 'marketplace', 'content', 'other'])
    .optional(),
  budget: z.enum(['zero', 'low', 'medium']).optional(),
  timeline: z.enum(['rush', 'standard', 'relaxed']).optional(),
});

export type CreatePlanInput = z.infer<typeof createPlanSchema>;

export const updatePlanSchema = createPlanSchema.partial();

export type UpdatePlanInput = z.infer<typeof updatePlanSchema>;

export function formatZodErrors(error: z.ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
}

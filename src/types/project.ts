import type { LaunchPlan as RecommendationPlan } from './recommendation';

export interface ProjectInput {
  projectName: string;
  description: string;
  repoUrl: string;
  demoUrl: string;
  targetAudience?: 'developers' | 'designers' | 'marketers' | 'founders' | 'general';
  category?: 'saas' | 'devtool' | 'mobile-app' | 'marketplace' | 'content' | 'other';
  budget?: 'zero' | 'low' | 'medium';
  timeline?: 'rush' | 'standard' | 'relaxed';
}

export type { RecommendationPlan };

export interface LaunchPlan {
  id: string;
  input: ProjectInput;
  channels: string[];
  recommendations?: RecommendationPlan;
  createdAt: string;
  updatedAt: string;
}

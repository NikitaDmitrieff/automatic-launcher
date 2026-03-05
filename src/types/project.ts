export interface ProjectInput {
  name: string;
  description: string;
  repoUrl: string;
  demoUrl: string;
  targetAudience?: string;
  category?: 'saas' | 'devtool' | 'mobile' | 'marketplace' | 'content' | 'other';
  budget?: 'free' | 'low' | 'medium';
  timeline?: '24h' | '1week' | '2weeks';
}

export interface LaunchPlan {
  id: string;
  input: ProjectInput;
  channels: string[];
  createdAt: string;
  updatedAt: string;
}

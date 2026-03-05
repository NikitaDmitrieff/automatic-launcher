export interface ProjectInput {
  projectName: string;
  description: string;
  repoUrl?: string;
  demoUrl?: string;
  category: 'saas' | 'devtool' | 'mobile-app' | 'marketplace' | 'content' | 'other';
  budget: 'zero' | 'low' | 'medium';
  timeline: 'rush' | 'standard' | 'relaxed';
  targetAudience: 'developers' | 'designers' | 'marketers' | 'general' | 'founders';
}

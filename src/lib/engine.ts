import { channels, Channel } from './channels';

export interface ProjectInput {
  name: string;
  description: string;
  repoUrl: string;
  demoUrl: string;
  category?: string;
  budget?: 'free' | 'low' | 'medium';
}

export interface Recommendation {
  channel: Channel;
  score: number;
  reason: string;
}

export function getRecommendations(input: ProjectInput): Recommendation[] {
  return channels
    .map(ch => {
      let score = 50;
      if (input.category && ch.categories.includes(input.category)) score += 30;
      if (input.budget && ch.cost === input.budget) score += 20;
      else if (ch.cost === 'free') score += 10;
      return { channel: ch, score: Math.min(score, 100), reason: `Great fit for ${input.category || 'general'} projects` };
    })
    .sort((a, b) => b.score - a.score);
}

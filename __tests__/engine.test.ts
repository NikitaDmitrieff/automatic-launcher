import { describe, it, expect } from 'vitest';
import { generateRecommendations } from '../src/lib/engine';
import type { ProjectInput } from '../src/types/project';

const baseInput: ProjectInput = {
  projectName: 'TestApp',
  description: 'A test application',
  repoUrl: 'https://github.com/test/app',
  demoUrl: 'https://testapp.com',
};

describe('generateRecommendations', () => {
  it('returns results', () => {
    const results = generateRecommendations(baseInput);
    expect(results.channels.length).toBeGreaterThan(0);
  });

  it('boosts score for matching category', () => {
    const withCategory = generateRecommendations({ ...baseInput, category: 'devtool' });
    const withoutCategory = generateRecommendations(baseInput);

    // Developer-oriented channels should get a bonus when category is 'devtool'
    const devChannelName = 'Hacker News (Show HN)';
    const devChannelWithCategory = withCategory.channels.find(r => r.channel.name === devChannelName);
    const devChannelWithoutCategory = withoutCategory.channels.find(r => r.channel.name === devChannelName);

    expect(devChannelWithCategory!.relevanceScore).toBeGreaterThan(devChannelWithoutCategory!.relevanceScore);
  });

  it('returns results sorted by relevanceScore descending', () => {
    const results = generateRecommendations({ ...baseInput, category: 'devtool' });
    for (let i = 1; i < results.channels.length; i++) {
      expect(results.channels[i - 1].relevanceScore).toBeGreaterThanOrEqual(results.channels[i].relevanceScore);
    }
  });

  it('all scores are between 0 and 100', () => {
    const results = generateRecommendations({ ...baseInput, category: 'saas', budget: 'zero' });
    results.channels.forEach(r => {
      expect(r.relevanceScore).toBeGreaterThanOrEqual(0);
      expect(r.relevanceScore).toBeLessThanOrEqual(100);
    });
  });
});

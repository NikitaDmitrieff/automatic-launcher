import { describe, it, expect } from 'vitest';
import { getRecommendations, ProjectInput } from '../src/lib/engine';

const baseInput: ProjectInput = {
  name: 'TestApp',
  description: 'A test application',
  repoUrl: 'https://github.com/test/app',
  demoUrl: 'https://testapp.com',
};

describe('getRecommendations', () => {
  it('returns results', () => {
    const results = getRecommendations(baseInput);
    expect(results.length).toBeGreaterThan(0);
  });

  it('boosts score for matching category', () => {
    const withCategory = getRecommendations({ ...baseInput, category: 'saas' });
    const withoutCategory = getRecommendations(baseInput);

    const saasChannel = withCategory.find(r => r.channel.categories.includes('saas'));
    const sameChannelNoCategory = withoutCategory.find(r => r.channel.name === saasChannel!.channel.name);

    expect(saasChannel!.score).toBeGreaterThan(sameChannelNoCategory!.score);
  });

  it('returns results sorted by score descending', () => {
    const results = getRecommendations({ ...baseInput, category: 'devtool' });
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });

  it('all scores are between 0 and 100', () => {
    const results = getRecommendations({ ...baseInput, category: 'saas', budget: 'free' });
    results.forEach(r => {
      expect(r.score).toBeGreaterThanOrEqual(0);
      expect(r.score).toBeLessThanOrEqual(100);
    });
  });
});

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
  it('returns channels', () => {
    const results = generateRecommendations(baseInput);
    expect(results.channels.length).toBeGreaterThan(0);
  });

  it('boosts score for matching category', () => {
    const withCategory = generateRecommendations({ ...baseInput, category: 'saas' });
    const withoutCategory = generateRecommendations(baseInput);

    const saasChannel = withCategory.channels[0];
    const sameChannelNoCategory = withoutCategory.channels.find(
      (r) => r.channel.name === saasChannel.channel.name,
    );

    expect(saasChannel.relevanceScore).toBeGreaterThanOrEqual(
      sameChannelNoCategory!.relevanceScore,
    );
  });

  it('returns results sorted by score descending', () => {
    const results = generateRecommendations({ ...baseInput, category: 'devtool' });
    for (let i = 1; i < results.channels.length; i++) {
      expect(results.channels[i - 1].relevanceScore).toBeGreaterThanOrEqual(
        results.channels[i].relevanceScore,
      );
    }
  });

  it('all scores are between 0 and 100', () => {
    const results = generateRecommendations({
      ...baseInput,
      category: 'saas',
      budget: 'zero',
    });
    results.channels.forEach((r) => {
      expect(r.relevanceScore).toBeGreaterThanOrEqual(0);
      expect(r.relevanceScore).toBeLessThanOrEqual(100);
    });
  });

  it('returns timeline and outreach templates', () => {
    const results = generateRecommendations({ ...baseInput, category: 'devtool' });
    expect(results.timeline.length).toBeGreaterThan(0);
    expect(results.outreachTemplates.length).toBeGreaterThan(0);
  });
});

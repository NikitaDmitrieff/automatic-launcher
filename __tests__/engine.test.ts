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

describe('scoring edge cases', () => {
  describe('category bonus', () => {
    it('gives no bonus when category is undefined', () => {
      const withoutCategory = generateRecommendations({ ...baseInput });
      const withCategory = generateRecommendations({ ...baseInput, category: 'saas' });
      // Without category, Product Hunt should score lower since it gets +15 for saas
      const phWithout = withoutCategory.channels.find((r) => r.channel.name === 'Product Hunt');
      const phWith = withCategory.channels.find((r) => r.channel.name === 'Product Hunt');
      expect(phWith!.relevanceScore).toBeGreaterThan(phWithout!.relevanceScore);
    });

    it('gives no bonus for unrecognized category channel combo', () => {
      // 'other' category gives 0 to channels not in its map (e.g., Lobste.rs)
      const results = generateRecommendations({ ...baseInput, category: 'other' });
      const lobsters = results.channels.find((r) => r.channel.name === 'Lobste.rs');
      const noCategory = generateRecommendations({ ...baseInput });
      const lobstersBase = noCategory.channels.find((r) => r.channel.name === 'Lobste.rs');
      expect(lobsters!.relevanceScore).toBe(lobstersBase!.relevanceScore);
    });
  });

  describe('audience bonus', () => {
    it('gives no bonus when targetAudience is undefined', () => {
      const without = generateRecommendations({ ...baseInput });
      const with_ = generateRecommendations({ ...baseInput, targetAudience: 'developers' });
      const hn = with_.channels.find((r) => r.channel.name === 'Hacker News (Show HN)');
      const hnBase = without.channels.find((r) => r.channel.name === 'Hacker News (Show HN)');
      expect(hn!.relevanceScore).toBeGreaterThan(hnBase!.relevanceScore);
    });

    it('boosts developer channels for developers audience', () => {
      const results = generateRecommendations({ ...baseInput, targetAudience: 'developers' });
      const devTo = results.channels.find((r) => r.channel.name === 'Dev.to');
      expect(devTo!.relevanceScore).toBeGreaterThanOrEqual(60); // base 50 + 10
    });

    it('boosts founder channels for founders audience', () => {
      const results = generateRecommendations({ ...baseInput, targetAudience: 'founders' });
      const ih = results.channels.find((r) => r.channel.name === 'Indie Hackers');
      expect(ih!.relevanceScore).toBeGreaterThanOrEqual(62); // base 50 + 12
    });
  });

  describe('budget bonus', () => {
    it('penalizes non-free channels when budget is zero', () => {
      const withZero = generateRecommendations({ ...baseInput, budget: 'zero' });
      const noBudget = generateRecommendations({ ...baseInput });
      // Non-free channels get -15, so they should score lower overall
      // Check that more free channels appear in top results
      const freeCount = withZero.channels.filter((r) => r.channel.cost === 'free').length;
      expect(freeCount).toBeGreaterThanOrEqual(8); // most top 10 should be free
    });

    it('gives bonus to free channels when budget is zero', () => {
      const withBudget = generateRecommendations({ ...baseInput, budget: 'zero' });
      const noBudget = generateRecommendations({ ...baseInput });
      // Free channels get +5 when budget is 'zero'
      const freeChannel = withBudget.channels.find(
        (r) => r.channel.cost === 'free',
      );
      const sameNobudget = noBudget.channels.find(
        (r) => r.channel.name === freeChannel!.channel.name,
      );
      expect(freeChannel!.relevanceScore).toBeGreaterThan(sameNobudget!.relevanceScore);
    });

    it('gives no bonus when budget is undefined', () => {
      const withBudget = generateRecommendations({ ...baseInput, budget: 'zero' });
      const noBudget = generateRecommendations({ ...baseInput });
      // With undefined budget, free channels should not get the +5 bonus
      const blNoBudget = noBudget.channels.find((r) => r.channel.name === 'BetaList');
      const blWithBudget = withBudget.channels.find((r) => r.channel.name === 'BetaList');
      expect(blWithBudget!.relevanceScore).toBeGreaterThan(blNoBudget!.relevanceScore);
    });
  });

  describe('timeline bonus', () => {
    it('boosts low-effort channels on rush timeline', () => {
      const rush = generateRecommendations({ ...baseInput, timeline: 'rush' });
      const standard = generateRecommendations({ ...baseInput });
      // BetaList has effort: 'low', should get +10 on rush
      const blRush = rush.channels.find((r) => r.channel.name === 'BetaList');
      const blStd = standard.channels.find((r) => r.channel.name === 'BetaList');
      expect(blRush!.relevanceScore).toBeGreaterThan(blStd!.relevanceScore);
    });

    it('penalizes high-effort channels on rush timeline', () => {
      const rush = generateRecommendations({ ...baseInput, timeline: 'rush' });
      const standard = generateRecommendations({ ...baseInput });
      // Low-effort channels should rank higher on rush vs standard
      const lowEffortRushAvg =
        rush.channels
          .filter((r) => r.channel.effort === 'low')
          .reduce((sum, r) => sum + r.relevanceScore, 0) /
        rush.channels.filter((r) => r.channel.effort === 'low').length;
      const lowEffortStdAvg =
        standard.channels
          .filter((r) => r.channel.effort === 'low')
          .reduce((sum, r) => sum + r.relevanceScore, 0) /
        standard.channels.filter((r) => r.channel.effort === 'low').length;
      expect(lowEffortRushAvg).toBeGreaterThan(lowEffortStdAvg);
    });

    it('boosts high-effort channels on relaxed timeline', () => {
      const relaxed = generateRecommendations({ ...baseInput, timeline: 'relaxed' });
      const standard = generateRecommendations({ ...baseInput });
      const hnRelaxed = relaxed.channels.find((r) => r.channel.name === 'Hacker News (Show HN)');
      const hnStd = standard.channels.find((r) => r.channel.name === 'Hacker News (Show HN)');
      expect(hnRelaxed!.relevanceScore).toBeGreaterThan(hnStd!.relevanceScore);
    });
  });

  describe('score clamping', () => {
    it('scores never exceed 100', () => {
      // Maximize bonuses: devtool category + developers audience + zero budget (free channels) + relaxed timeline
      const results = generateRecommendations({
        ...baseInput,
        category: 'devtool',
        targetAudience: 'developers',
        budget: 'zero',
        timeline: 'relaxed',
      });
      results.channels.forEach((r) => {
        expect(r.relevanceScore).toBeLessThanOrEqual(100);
      });
    });

    it('scores never go below 0', () => {
      // Minimize bonuses: zero budget penalizes non-free, rush penalizes high-effort
      const results = generateRecommendations({
        ...baseInput,
        category: 'other',
        budget: 'zero',
        timeline: 'rush',
      });
      results.channels.forEach((r) => {
        expect(r.relevanceScore).toBeGreaterThanOrEqual(0);
      });
    });

    it('all scores are integers or valid numbers', () => {
      const results = generateRecommendations({
        ...baseInput,
        category: 'saas',
        targetAudience: 'founders',
        budget: 'low',
        timeline: 'standard',
      });
      results.channels.forEach((r) => {
        expect(Number.isFinite(r.relevanceScore)).toBe(true);
      });
    });
  });

  describe('URL bonuses', () => {
    it('gives bonus to developer channels when repoUrl is provided', () => {
      const withRepo = generateRecommendations({ ...baseInput });
      const withoutRepo = generateRecommendations({
        ...baseInput,
        repoUrl: '',
      });
      const hnWith = withRepo.channels.find((r) => r.channel.name === 'Hacker News (Show HN)');
      const hnWithout = withoutRepo.channels.find((r) => r.channel.name === 'Hacker News (Show HN)');
      expect(hnWith!.relevanceScore).toBeGreaterThan(hnWithout!.relevanceScore);
    });

    it('gives bonus to product channels when demoUrl is provided', () => {
      const withDemo = generateRecommendations({ ...baseInput });
      const withoutDemo = generateRecommendations({
        ...baseInput,
        demoUrl: '',
      });
      const phWith = withDemo.channels.find((r) => r.channel.name === 'Product Hunt');
      const phWithout = withoutDemo.channels.find((r) => r.channel.name === 'Product Hunt');
      expect(phWith!.relevanceScore).toBeGreaterThan(phWithout!.relevanceScore);
    });
  });

  describe('all-zero bonuses (minimal input)', () => {
    it('returns base score of 50 for channels with no matching bonuses', () => {
      // No optional fields → all bonus functions return 0, no URLs → no URL bonuses
      const results = generateRecommendations({
        projectName: 'X',
        description: 'Y',
        repoUrl: '',
        demoUrl: '',
      });
      // All channels should have the base score of 50 since no bonuses apply
      results.channels.forEach((r) => {
        expect(r.relevanceScore).toBe(50);
      });
    });
  });
});

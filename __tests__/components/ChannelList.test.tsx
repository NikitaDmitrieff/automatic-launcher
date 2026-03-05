import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChannelList from '../../src/components/ChannelList';
import type { ChannelRecommendation } from '../../src/types/recommendation';

function makeRec(overrides: Partial<ChannelRecommendation> & { name: string; type: ChannelRecommendation['channel']['type']; effort: ChannelRecommendation['channel']['effort']; score: number }): ChannelRecommendation {
  return {
    channel: {
      name: overrides.name,
      type: overrides.type,
      url: `https://example.com/${overrides.name.toLowerCase().replace(/\s/g, '-')}`,
      description: `${overrides.name} description`,
      audienceSize: '10k+',
      effort: overrides.effort,
      cost: 'free',
    },
    relevanceScore: overrides.score,
    reason: `Reason for ${overrides.name}`,
    actionItems: ['Action 1'],
  };
}

const recommendations: ChannelRecommendation[] = [
  makeRec({ name: 'Reddit', type: 'social', effort: 'low', score: 90 }),
  makeRec({ name: 'HN', type: 'news', effort: 'medium', score: 80 }),
  makeRec({ name: 'Discord', type: 'community', effort: 'high', score: 70 }),
  makeRec({ name: 'PH Directory', type: 'directory', effort: 'low', score: 60 }),
  makeRec({ name: 'Newsletter', type: 'email', effort: 'medium', score: 50 }),
];

describe('ChannelList', () => {
  it('renders all channels by default', () => {
    render(<ChannelList recommendations={recommendations} />);
    expect(screen.getByText('5 channels found')).toBeDefined();
  });

  it('renders filter tabs', () => {
    render(<ChannelList recommendations={recommendations} />);
    expect(screen.getByRole('tab', { name: /filter by all/i })).toBeDefined();
    expect(screen.getByRole('tab', { name: /filter by social/i })).toBeDefined();
    expect(screen.getByRole('tab', { name: /filter by community/i })).toBeDefined();
    expect(screen.getByRole('tab', { name: /filter by news/i })).toBeDefined();
  });

  it('filters channels by type when a tab is clicked', async () => {
    const user = userEvent.setup();
    render(<ChannelList recommendations={recommendations} />);

    await user.click(screen.getByRole('tab', { name: /filter by social/i }));

    expect(screen.getByText('1 channel found')).toBeDefined();
    expect(screen.getByText('Reddit')).toBeDefined();
  });

  it('shows "All" tab as selected by default', () => {
    render(<ChannelList recommendations={recommendations} />);
    const allTab = screen.getByRole('tab', { name: /filter by all/i });
    expect(allTab.getAttribute('aria-selected')).toBe('true');
  });

  it('updates aria-selected when switching tabs', async () => {
    const user = userEvent.setup();
    render(<ChannelList recommendations={recommendations} />);

    const newsTab = screen.getByRole('tab', { name: /filter by news/i });
    await user.click(newsTab);

    expect(newsTab.getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('tab', { name: /filter by all/i }).getAttribute('aria-selected')).toBe('false');
  });

  it('sorts by relevance by default (descending)', () => {
    render(<ChannelList recommendations={recommendations} />);
    const articles = screen.getAllByRole('article');
    expect(articles[0].textContent).toContain('Reddit');
    expect(articles[4].textContent).toContain('Newsletter');
  });

  it('sorts by effort when selected', async () => {
    const user = userEvent.setup();
    render(<ChannelList recommendations={recommendations} />);

    await user.selectOptions(screen.getByLabelText(/sort channels/i), 'effort');

    const articles = screen.getAllByRole('article');
    // Low effort first: Reddit (low), PH Directory (low), then medium, then high
    expect(articles[0].textContent).toContain('Reddit');
    expect(articles[1].textContent).toContain('PH Directory');
    expect(articles[4].textContent).toContain('Discord');
  });

  it('shows empty state when no channels match filter', async () => {
    const onlySocial = [makeRec({ name: 'Twitter', type: 'social', effort: 'low', score: 80 })];
    const user = userEvent.setup();
    render(<ChannelList recommendations={onlySocial} />);

    await user.click(screen.getByRole('tab', { name: /filter by news/i }));

    expect(screen.getByText('No channels match this filter.')).toBeDefined();
    expect(screen.getByText('0 channels found')).toBeDefined();
  });

  it('handles empty recommendations list', () => {
    render(<ChannelList recommendations={[]} />);
    expect(screen.getByText('0 channels found')).toBeDefined();
    expect(screen.getByText('No channels match this filter.')).toBeDefined();
  });

  it('combines filter and sort', async () => {
    const recs = [
      makeRec({ name: 'Reddit', type: 'social', effort: 'high', score: 90 }),
      makeRec({ name: 'Twitter', type: 'social', effort: 'low', score: 70 }),
    ];
    const user = userEvent.setup();
    render(<ChannelList recommendations={recs} />);

    await user.click(screen.getByRole('tab', { name: /filter by social/i }));
    await user.selectOptions(screen.getByLabelText(/sort channels/i), 'effort');

    const articles = screen.getAllByRole('article');
    expect(articles[0].textContent).toContain('Twitter'); // low effort first
    expect(articles[1].textContent).toContain('Reddit'); // high effort second
  });
});

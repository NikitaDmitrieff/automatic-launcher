import { describe, it, expect } from 'vitest';
import { exportToMarkdown, exportToJSON, ExportData } from '../src/lib/exporters';

const sampleData: ExportData = {
  projectName: 'MyApp',
  channels: [
    { name: 'Reddit', url: 'https://reddit.com/r/test', reason: 'Great community', actionItems: ['Post intro'] },
    { name: 'Hacker News', url: 'https://news.ycombinator.com', reason: 'Tech audience', actionItems: ['Submit Show HN'] },
  ],
  timeline: [
    { day: 1, title: 'Prep', tasks: ['Write copy'] },
  ],
  templates: [
    { channelName: 'Reddit', body: 'Check out MyApp' },
  ],
};

describe('exportToMarkdown', () => {
  it('produces valid markdown', () => {
    const md = exportToMarkdown(sampleData);
    expect(md).toContain('#');
    expect(md).toContain('-');
  });

  it('includes project name', () => {
    const md = exportToMarkdown(sampleData);
    expect(md).toContain('MyApp');
  });

  it('includes channel links', () => {
    const md = exportToMarkdown(sampleData);
    expect(md).toContain('[Reddit](https://reddit.com/r/test)');
    expect(md).toContain('[Hacker News](https://news.ycombinator.com)');
  });
});

describe('exportToJSON', () => {
  it('returns parseable JSON', () => {
    const json = exportToJSON(sampleData);
    const parsed = JSON.parse(json);
    expect(parsed).toEqual(sampleData);
  });
});

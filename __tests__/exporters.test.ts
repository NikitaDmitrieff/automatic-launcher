import { describe, it, expect } from 'vitest';
import { exportToMarkdown, exportToJSON } from '../src/lib/exporters';

const sampleData = {
  projectName: 'MyApp',
  channels: [
    { name: 'Reddit', url: 'https://reddit.com/r/test' },
    { name: 'Hacker News', url: 'https://news.ycombinator.com' },
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

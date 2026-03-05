import { describe, it, expect } from 'vitest';
import { CHANNELS as channels } from '../src/lib/channels';
import { outreachTemplates } from '../src/lib/templates';

describe('channels', () => {
  it('array is not empty', () => {
    expect(channels.length).toBeGreaterThan(0);
  });

  it('each channel has required fields', () => {
    channels.forEach(ch => {
      expect(ch.name).toBeDefined();
      expect(ch.name).toBeTruthy();
      expect(ch.url).toBeDefined();
      expect(ch.url).toBeTruthy();
      expect(ch.type).toBeDefined();
      expect(ch.type).toBeTruthy();
    });
  });

  it('all URLs start with https://', () => {
    channels.forEach(ch => {
      expect(ch.url).toMatch(/^https:\/\//);
    });
  });

  it('all channels have a valid audience', () => {
    const validAudiences = ['developer', 'product', 'general'];
    channels.forEach(ch => {
      expect(validAudiences).toContain(ch.audience);
    });
  });

  it('all channels have a valid outreachType', () => {
    const validOutreachTypes = [
      'reddit', 'hackernews', 'producthunt', 'twitter',
      'linkedin', 'email', 'community', 'devto', 'indiehackers',
    ];
    channels.forEach(ch => {
      expect(validOutreachTypes).toContain(ch.outreachType);
    });
  });

  it('developer channels include expected entries', () => {
    const devChannels = channels.filter(ch => ch.audience === 'developer');
    const devNames = devChannels.map(ch => ch.name);
    expect(devNames).toContain('Hacker News (Show HN)');
    expect(devNames).toContain('GitHub Trending');
    expect(devNames).toContain('Dev.to');
  });

  it('product channels include expected entries', () => {
    const productChannels = channels.filter(ch => ch.audience === 'product');
    const productNames = productChannels.map(ch => ch.name);
    expect(productNames).toContain('Product Hunt');
    expect(productNames).toContain('BetaList');
    expect(productNames).toContain('Uneed');
  });

  it('includes Dev.to channel', () => {
    const devto = channels.find(ch => ch.name === 'Dev.to');
    expect(devto).toBeDefined();
    expect(devto!.url).toBe('https://dev.to/');
    expect(devto!.type).toBe('community');
  });

  it('includes Indie Hackers channel', () => {
    const ih = channels.find(ch => ch.name === 'Indie Hackers');
    expect(ih).toBeDefined();
    expect(ih!.url).toBe('https://www.indiehackers.com/');
    expect(ih!.type).toBe('community');
  });
});

describe('outreach templates', () => {
  it('has a Dev.to template', () => {
    const devtoTemplate = outreachTemplates.find(t => t.channelType === 'devto');
    expect(devtoTemplate).toBeDefined();
    expect(devtoTemplate!.channelName).toBe('Dev.to');
    expect(devtoTemplate!.body).toContain('{{projectName}}');
    expect(devtoTemplate!.tips.length).toBeGreaterThan(0);
  });

  it('has an Indie Hackers template', () => {
    const ihTemplate = outreachTemplates.find(t => t.channelType === 'indiehackers');
    expect(ihTemplate).toBeDefined();
    expect(ihTemplate!.channelName).toBe('Indie Hackers');
    expect(ihTemplate!.body).toContain('{{projectName}}');
    expect(ihTemplate!.tips.length).toBeGreaterThan(0);
  });
});

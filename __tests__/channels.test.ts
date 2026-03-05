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

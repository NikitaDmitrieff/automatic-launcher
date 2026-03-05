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

  it('includes Indie Hackers channel', () => {
    const ih = channels.find(ch => ch.name === 'Indie Hackers');
    expect(ih).toBeDefined();
    expect(ih!.type).toBe('community');
    expect(ih!.url).toBe('https://www.indiehackers.com/');
    expect(ih!.effort).toBe('medium');
    expect(ih!.cost).toBe('free');
  });
});

describe('outreach templates', () => {
  it('includes Indie Hackers template', () => {
    const ihTemplate = outreachTemplates.find(t => t.id === 'indiehackers-post');
    expect(ihTemplate).toBeDefined();
    expect(ihTemplate!.channelName).toBe('Indie Hackers');
    expect(ihTemplate!.body).toContain('{{projectName}}');
    expect(ihTemplate!.body).toContain('{{demoUrl}}');
    expect(ihTemplate!.tips.length).toBeGreaterThan(0);
  });
});

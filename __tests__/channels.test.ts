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

  describe('Dev.to channel', () => {
    const devto = channels.find(ch => ch.name === 'Dev.to');

    it('exists in the channels list', () => {
      expect(devto).toBeDefined();
    });

    it('has correct URL', () => {
      expect(devto!.url).toBe('https://dev.to/');
    });

    it('is categorized as community type', () => {
      expect(devto!.type).toBe('community');
    });

    it('has audience size and effort defined', () => {
      expect(devto!.audienceSize).toBeTruthy();
      expect(devto!.effort).toBeTruthy();
    });
  });

  describe('Dev.to outreach template', () => {
    const devtoTemplate = outreachTemplates.find(t => t.id === 'devto-post');

    it('exists in the templates list', () => {
      expect(devtoTemplate).toBeDefined();
    });

    it('has channelType set to devto', () => {
      expect(devtoTemplate!.channelType).toBe('devto');
    });

    it('has a body with template placeholders', () => {
      expect(devtoTemplate!.body).toContain('{{projectName}}');
      expect(devtoTemplate!.body).toContain('{{demoUrl}}');
    });

    it('has tips array with entries', () => {
      expect(devtoTemplate!.tips.length).toBeGreaterThan(0);
    });
  });
});

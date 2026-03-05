import { describe, it, expect } from 'vitest';
import { CHANNELS as channels } from '../src/lib/channels';

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
});

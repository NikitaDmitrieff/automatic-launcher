import { describe, it, expect } from 'vitest';
import { fillTemplate, outreachTemplates } from '../src/lib/templates';
import type { OutreachTemplate } from '../src/types/outreach';

const baseTemplate: OutreachTemplate = {
  id: 'test-template',
  channelName: 'Test Channel',
  channelType: 'community',
  subject: 'Launch: {{projectName}} - {{description}}',
  body: 'Check out {{projectName}}: {{description}} at {{demoUrl}}',
  tips: ['Be nice'],
};

const baseValues = {
  projectName: 'MyApp',
  description: 'A cool tool',
  demoUrl: 'https://example.com',
};

describe('fillTemplate', () => {
  describe('basic substitution', () => {
    it('replaces all placeholders in subject and body', () => {
      const result = fillTemplate(baseTemplate, baseValues);
      expect(result.subject).toBe('Launch: MyApp - A cool tool');
      expect(result.body).toBe('Check out MyApp: A cool tool at https://example.com');
    });

    it('replaces multiple occurrences of the same placeholder', () => {
      const template: OutreachTemplate = {
        ...baseTemplate,
        body: '{{projectName}} is great. Try {{projectName}} today!',
      };
      const result = fillTemplate(template, baseValues);
      expect(result.body).toBe('MyApp is great. Try MyApp today!');
    });

    it('handles template with no subject', () => {
      const template: OutreachTemplate = {
        ...baseTemplate,
        subject: undefined,
      };
      const result = fillTemplate(template, baseValues);
      expect(result.subject).toBeUndefined();
      expect(result.body).toContain('MyApp');
    });

    it('preserves non-placeholder text', () => {
      const template: OutreachTemplate = {
        ...baseTemplate,
        body: 'Hello world, no placeholders here.',
      };
      const result = fillTemplate(template, baseValues);
      expect(result.body).toBe('Hello world, no placeholders here.');
    });

    it('preserves other template properties', () => {
      const result = fillTemplate(baseTemplate, baseValues);
      expect(result.id).toBe('test-template');
      expect(result.channelName).toBe('Test Channel');
      expect(result.channelType).toBe('community');
      expect(result.tips).toEqual(['Be nice']);
    });
  });

  describe('XSS sanitization', () => {
    it('escapes HTML tags in projectName', () => {
      const result = fillTemplate(baseTemplate, {
        ...baseValues,
        projectName: '<script>alert("xss")</script>',
      });
      expect(result.body).not.toContain('<script>');
      expect(result.body).toContain('&lt;script&gt;');
    });

    it('escapes HTML tags in description', () => {
      const result = fillTemplate(baseTemplate, {
        ...baseValues,
        description: '<img src=x onerror=alert(1)>',
      });
      expect(result.body).not.toContain('<img');
      expect(result.body).toContain('&lt;img');
    });

    it('escapes HTML tags in demoUrl', () => {
      const result = fillTemplate(baseTemplate, {
        ...baseValues,
        demoUrl: 'javascript:alert("xss")',
      });
      expect(result.body).toContain('javascript:alert(&quot;xss&quot;)');
    });

    it('escapes ampersands', () => {
      const result = fillTemplate(baseTemplate, {
        ...baseValues,
        projectName: 'A&B',
      });
      expect(result.body).toContain('A&amp;B');
    });

    it('escapes single quotes', () => {
      const result = fillTemplate(baseTemplate, {
        ...baseValues,
        projectName: "it's",
      });
      expect(result.body).toContain('it&#x27;s');
    });

    it('escapes double quotes', () => {
      const result = fillTemplate(baseTemplate, {
        ...baseValues,
        projectName: 'say "hello"',
      });
      expect(result.body).toContain('say &quot;hello&quot;');
    });

    it('escapes all HTML entities together', () => {
      const result = fillTemplate(baseTemplate, {
        ...baseValues,
        projectName: `<b>"Tom & Jerry's"</b>`,
      });
      expect(result.body).toContain(
        '&lt;b&gt;&quot;Tom &amp; Jerry&#x27;s&quot;&lt;/b&gt;',
      );
    });

    it('handles nested script injection attempts', () => {
      const result = fillTemplate(baseTemplate, {
        ...baseValues,
        projectName: '<<script>script>alert("xss")<</script>/script>',
      });
      expect(result.body).not.toContain('<script>');
      expect(result.subject).not.toContain('<script>');
    });

    it('escapes quotes to prevent attribute injection', () => {
      const result = fillTemplate(baseTemplate, {
        ...baseValues,
        description: '" onmouseover="alert(1)" data-x="',
      });
      // Quotes are escaped so they can't break out of HTML attributes
      expect(result.body).not.toContain('"');
      expect(result.body).toContain('&quot; onmouseover=&quot;alert(1)&quot; data-x=&quot;');
    });
  });

  describe('edge cases', () => {
    it('handles empty string values', () => {
      const result = fillTemplate(baseTemplate, {
        projectName: '',
        description: '',
        demoUrl: '',
      });
      expect(result.body).toBe('Check out :  at ');
    });

    it('handles values with only special characters', () => {
      const result = fillTemplate(baseTemplate, {
        projectName: '<>&"\'',
        description: '<>&"\'',
        demoUrl: '<>&"\'',
      });
      expect(result.body).not.toContain('<');
      expect(result.body).not.toContain('>');
    });

    it('handles very long input strings', () => {
      const longString = 'a'.repeat(10000);
      const result = fillTemplate(baseTemplate, {
        ...baseValues,
        projectName: longString,
      });
      expect(result.body).toContain(longString);
    });
  });
});

describe('outreachTemplates', () => {
  it('exports a non-empty array of templates', () => {
    expect(outreachTemplates.length).toBeGreaterThan(0);
  });

  it('each template has required fields', () => {
    for (const t of outreachTemplates) {
      expect(t.id).toBeTruthy();
      expect(t.channelName).toBeTruthy();
      expect(t.channelType).toBeTruthy();
      expect(t.body).toBeTruthy();
      expect(t.tips.length).toBeGreaterThan(0);
    }
  });

  it('each template has unique id', () => {
    const ids = outreachTemplates.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

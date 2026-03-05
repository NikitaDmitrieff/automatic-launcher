import type { OutreachTemplate } from '../types/outreach';

export const outreachTemplates: OutreachTemplate[] = [
  {
    id: 'reddit-sideproject',
    channelName: 'Reddit (r/SideProject)',
    channelType: 'reddit',
    subject: 'Show r/SideProject: {{projectName}} - {{description}}',
    body: `Hey r/SideProject!

I've been working on **{{projectName}}** and wanted to share it with you all.

**What it does:** {{description}}

**Demo:** {{demoUrl}}

I'd love to hear your thoughts, feedback, or suggestions. What would make this more useful for you?

Thanks for checking it out!`,
    tips: [
      'DO: Be genuine and conversational - Reddit hates marketing speak',
      'DO: Ask for specific feedback to encourage engagement',
      'DO: Respond to every comment, even critical ones',
      'DO: Share your build journey and lessons learned',
      "DON'T: Use clickbait titles or excessive emojis",
      "DON'T: Post the same thing across multiple subreddits simultaneously",
      "DON'T: Be defensive about criticism",
      "DON'T: Include pricing or upsells in your first post",
    ],
  },
  {
    id: 'hackernews-showhn',
    channelName: 'Hacker News (Show HN)',
    channelType: 'hackernews',
    subject: 'Show HN: {{projectName}} - {{description}}',
    body: `{{demoUrl}}

Hi HN, I built {{projectName}} because {{description}}.

The stack: [mention your tech stack briefly]

What surprised me most during the build was [share a genuine insight].

I'm looking for feedback on [specific area]. Happy to answer any questions about the technical implementation.`,
    tips: [
      'DO: Lead with the URL - HN readers want to try it immediately',
      'DO: Mention interesting technical decisions or challenges',
      'DO: Be transparent about limitations and roadmap',
      'DO: Post between 8-10am EST for best visibility',
      "DON'T: Use marketing language or buzzwords",
      "DON'T: Describe it as 'Uber for X' or 'AI-powered'",
      "DON'T: Ask for upvotes or shares",
      "DON'T: Ignore technical questions - HN values depth",
    ],
  },
  {
    id: 'producthunt-launch',
    channelName: 'Product Hunt',
    channelType: 'producthunt',
    subject: '{{projectName}} - {{description}}',
    body: `**Tagline:** {{description}}

**Description:**
Hey Product Hunt! We're excited to launch {{projectName}} today.

**The Problem:** [What pain point does this solve?]

**The Solution:** {{projectName}} helps you [core value proposition].

**Key Features:**
- [Feature 1]
- [Feature 2]
- [Feature 3]

**Try it now:** {{demoUrl}}

We'd love your feedback and support. Drop a comment and we'll respond to every single one!`,
    tips: [
      'DO: Prepare a compelling 60-character tagline',
      'DO: Launch on Tuesday, Wednesday, or Thursday for best results',
      'DO: Have a visually polished landing page ready',
      'DO: Engage with every comment within minutes of launch',
      "DON'T: Launch before your product is polished and bug-free",
      "DON'T: Ask friends to upvote at the same time (PH detects this)",
      "DON'T: Neglect your product gallery images and video",
      "DON'T: Launch without a hunter if you can find one",
    ],
  },
  {
    id: 'twitter-launch-thread',
    channelName: 'Twitter / X',
    channelType: 'twitter',
    subject: 'Launch Thread',
    body: `I just launched {{projectName}}!

{{description}}

Try it here: {{demoUrl}}

Here's what I learned building it (thread)`,
    tips: [
      'DO: Keep the first tweet punchy and under 280 characters',
      'DO: Use a thread format for storytelling (build journey)',
      'DO: Include a screenshot or demo GIF in the first tweet',
      'DO: Tag relevant accounts and use 1-2 hashtags',
      "DON'T: Write a wall of text - keep each tweet focused",
      "DON'T: Use more than 2-3 hashtags per tweet",
      "DON'T: Forget to add a clear CTA (link to try it)",
      "DON'T: Post and ghost - engage with replies",
    ],
    characterLimit: 280,
  },
  {
    id: 'linkedin-post',
    channelName: 'LinkedIn',
    channelType: 'linkedin',
    subject: 'Launch Announcement',
    body: `I'm thrilled to share something I've been working on:

{{projectName}} - {{description}}

The backstory:
I noticed that [problem you experienced firsthand]. After [time period] of building, I created a solution.

What makes it different:
- [Key differentiator 1]
- [Key differentiator 2]
- [Key differentiator 3]

I'd love for you to check it out and share your thoughts:
{{demoUrl}}

If you know someone who could benefit from this, I'd appreciate a share.

#launch #buildinpublic #startup`,
    tips: [
      'DO: Start with a hook in the first 2 lines (before "see more")',
      'DO: Use line breaks generously for readability',
      'DO: Share your personal journey and motivation',
      'DO: Ask a question at the end to drive comments',
      "DON'T: Be overly salesy - LinkedIn rewards authentic stories",
      "DON'T: Use more than 3-5 hashtags",
      "DON'T: Post a link in the first comment (LinkedIn doesn't penalize links anymore)",
      "DON'T: Tag people who haven't agreed to be tagged",
    ],
  },
  {
    id: 'cold-email',
    channelName: 'Cold Email',
    channelType: 'email',
    subject: 'Quick question about [their specific pain point]',
    body: `Hi [Name],

I noticed you [specific observation about their work/company].

I built {{projectName}} to help with exactly that - {{description}}.

Would you be open to a 5-minute demo? Here's a quick look: {{demoUrl}}

Either way, I'd love your take on [specific question about their workflow].

Best,
[Your Name]`,
    tips: [
      'DO: Personalize the first line for every recipient',
      'DO: Keep it under 100 words - respect their time',
      'DO: Focus on their problem, not your features',
      'DO: Include a specific and low-commitment CTA',
      "DON'T: Send the same template to everyone without personalization",
      "DON'T: Use 'just following up' as a subject line",
      "DON'T: Attach files or use HTML-heavy formatting",
      "DON'T: Send more than 2 follow-ups without a response",
    ],
  },
  {
    id: 'devto-article',
    channelName: 'Dev.to',
    channelType: 'devto',
    subject: '{{projectName}} - {{description}}',
    body: `---
title: "I built {{projectName}} — {{description}}"
published: true
tags: showdev, webdev, opensource, productivity
---

I just launched **{{projectName}}** and wanted to share the journey with the Dev.to community.

## The Problem

[Describe the pain point you experienced firsthand]

## The Solution

{{projectName}} — {{description}}.

## How It Works

[Walk through the core architecture or workflow — include code snippets]

\`\`\`typescript
// Example usage
\`\`\`

## Tech Stack

- [Framework]
- [Database]
- [Deployment]

## Try It Out

{{demoUrl}}

## What's Next

I'd love your feedback. What features would make this more useful? Drop a comment or open an issue.`,
    tips: [
      'DO: Write a genuine technical article, not a product pitch',
      'DO: Include code snippets and architecture decisions',
      'DO: Use relevant tags (#showdev is key for launches)',
      'DO: Engage with comments — Dev.to rewards active authors',
      "DON'T: Write a thin marketing post — Dev.to readers want depth",
      "DON'T: Spam tags — stick to 4 relevant ones",
      "DON'T: Skip the personal story — why you built it matters",
      "DON'T: Forget to cross-post from your blog if you have one",
    ],
  },
  {
    id: 'indiehackers-post',
    channelName: 'Indie Hackers',
    channelType: 'indiehackers',
    subject: '{{projectName}} — {{description}}',
    body: `Hey IH!

I just launched **{{projectName}}** — {{description}}.

## The backstory

[Share why you started building this — what problem were you facing?]

## What I built

{{projectName}} helps [target user] do [core value prop]. Here's a quick look: {{demoUrl}}

## Key numbers

- Time to build: [X weeks/months]
- Tech stack: [brief]
- Current users/signups: [be transparent]
- Revenue: [even if $0 — IH respects honesty]

## What worked for launch

- [Tactic 1]
- [Tactic 2]

## What I'd do differently

- [Lesson 1]
- [Lesson 2]

## Ask

I'd love feedback from this community. What would make you use this? What's missing?`,
    tips: [
      'DO: Share real numbers — revenue, users, costs. IH loves transparency',
      'DO: Focus on the journey and lessons, not just the product',
      'DO: Engage in other IH discussions before and after posting',
      'DO: Create a product page on IH to build long-term presence',
      "DON'T: Write a press release — keep it conversational",
      "DON'T: Hide behind vanity metrics — be honest about traction",
      "DON'T: Post without engaging with the community first",
      "DON'T: Ignore the milestone/group features — they drive visibility",
    ],
  },
  {
    id: 'community-post',
    channelName: 'Community (Discord/Slack)',
    channelType: 'community',
    body: `Hey everyone!

I've been building {{projectName}} - {{description}}.

I'd love to get feedback from this community since you all understand [the relevant domain].

Here's a quick demo: {{demoUrl}}

A few specific questions I'd love input on:
1. Does the [core feature] solve a real problem for you?
2. What's missing that would make you use this daily?
3. Would you prefer [option A] or [option B]?

Happy to answer any questions. Thanks for your time!`,
    tips: [
      'DO: Read the community rules before posting',
      'DO: Be an active member before promoting your project',
      'DO: Ask specific questions to encourage feedback',
      'DO: Share in the appropriate channel (#showcase, #feedback, etc.)',
      "DON'T: Drop links without context or engagement",
      "DON'T: DM members unsolicited to promote your project",
      "DON'T: Cross-post the same message in multiple channels",
      "DON'T: Ignore community guidelines about self-promotion",
    ],
  },
];

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export function fillTemplate(
  template: OutreachTemplate,
  values: { projectName: string; description: string; demoUrl: string }
): OutreachTemplate {
  const safeValues = {
    projectName: escapeHtml(values.projectName),
    description: escapeHtml(values.description),
    demoUrl: escapeHtml(values.demoUrl),
  };

  const fill = (text: string): string =>
    text
      .replace(/\{\{projectName\}\}/g, safeValues.projectName)
      .replace(/\{\{description\}\}/g, safeValues.description)
      .replace(/\{\{demoUrl\}\}/g, safeValues.demoUrl);

  return {
    ...template,
    subject: template.subject ? fill(template.subject) : undefined,
    body: fill(template.body),
  };
}

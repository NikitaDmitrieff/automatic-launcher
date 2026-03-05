import type { ProjectInput } from '@/types/project';
import type {
  Channel,
  ChannelRecommendation,
  LaunchPlan,
  OutreachTemplate,
  TimelineItem,
} from '@/types/recommendation';
import { CHANNELS } from './channels';

/**
 * Score a channel based on how well it matches the project input.
 *
 * Starts from a base score of 50 and applies bonuses/penalties for:
 * - **Category match** — e.g. `devtool` projects score higher on Hacker News
 * - **Audience match** — e.g. `founders` audience boosts Indie Hackers
 * - **Budget match** — free channels score higher when budget is `zero`
 * - **Timeline match** — low-effort channels score higher on `rush` timelines
 * - **URL bonuses** — +5 for repo URL on dev channels, +5 for demo URL on product channels
 *
 * @param channel - The channel to score
 * @param input - The project input containing user-provided details
 * @returns A relevance score between 0 and 100
 */
export function scoreChannel(channel: Channel, input: ProjectInput): number {
  let score = 50; // base score

  // Category matching
  score += getCategoryBonus(channel, input.category);

  // Audience matching
  score += getAudienceBonus(channel, input.targetAudience);

  // Budget matching
  score += getBudgetBonus(channel, input.budget);

  // Timeline matching
  score += getTimelineBonus(channel, input.timeline);

  // Bonus for having a repo URL on developer-oriented channels
  if (input.repoUrl && isDeveloperChannel(channel)) {
    score += 5;
  }

  // Bonus for having a demo URL on product-oriented channels
  if (input.demoUrl && isProductChannel(channel)) {
    score += 5;
  }

  return Math.max(0, Math.min(100, score));
}

function getCategoryBonus(channel: Channel, category: ProjectInput['category']): number {
  if (!category) return 0;
  const bonusMap: Record<string, Record<string, number>> = {
    saas: {
      'Product Hunt': 15,
      'Indie Hackers': 12,
      'BetaList': 10,
      'Twitter / X': 8,
      'LinkedIn': 10,
      'Reddit r/startups': 8,
      'Reddit r/SideProject': 6,
    },
    devtool: {
      'Hacker News (Show HN)': 15,
      'GitHub Trending': 15,
      'Dev.to': 12,
      'Reddit r/webdev': 12,
      'Lobste.rs': 10,
      'Reddit r/SideProject': 8,
      'Hacker Newsletter': 6,
    },
    'mobile-app': {
      'Product Hunt': 15,
      'BetaList': 10,
      'Reddit r/startups': 8,
      'Twitter / X': 8,
      'Indie Hackers': 6,
    },
    marketplace: {
      'Product Hunt': 12,
      'Indie Hackers': 10,
      'Reddit r/startups': 10,
      'Twitter / X': 8,
      'LinkedIn': 8,
      'BetaList': 6,
    },
    content: {
      'Twitter / X': 12,
      'LinkedIn': 10,
      'Dev.to': 10,
      'Reddit r/SideProject': 8,
      'Indie Hackers': 8,
      'Product Hunt': 6,
    },
    other: {
      'Reddit r/SideProject': 8,
      'Product Hunt': 8,
      'Indie Hackers': 6,
      'Twitter / X': 6,
      'BetaList': 6,
    },
  };

  return bonusMap[category]?.[channel.name] ?? 0;
}

function getAudienceBonus(channel: Channel, audience: ProjectInput['targetAudience']): number {
  if (!audience) return 0;
  const bonusMap: Record<string, Record<string, number>> = {
    developers: {
      'Hacker News (Show HN)': 12,
      'GitHub Trending': 12,
      'Dev.to': 10,
      'Reddit r/webdev': 10,
      'Lobste.rs': 10,
      'Hacker Newsletter': 6,
    },
    designers: {
      'Twitter / X': 8,
      'Product Hunt': 8,
      'BetaList': 6,
      'Reddit r/SideProject': 4,
    },
    marketers: {
      'LinkedIn': 10,
      'Twitter / X': 8,
      'Product Hunt': 8,
      'Indie Hackers': 6,
    },
    founders: {
      'Indie Hackers': 12,
      'Reddit r/startups': 10,
      'Reddit r/indiehackers': 10,
      'Twitter / X': 8,
      'Product Hunt': 8,
      'LinkedIn': 6,
    },
    general: {
      'Product Hunt': 8,
      'Twitter / X': 6,
      'Reddit r/SideProject': 6,
      'BetaList': 4,
    },
  };

  return bonusMap[audience]?.[channel.name] ?? 0;
}

function getBudgetBonus(channel: Channel, budget: ProjectInput['budget']): number {
  if (!budget) return 0;
  if (budget === 'zero' && channel.cost === 'free') return 5;
  if (budget === 'zero' && channel.cost !== 'free') return -15;
  if (budget === 'low' && channel.cost === 'medium') return -5;
  return 0;
}

function getTimelineBonus(channel: Channel, timeline: ProjectInput['timeline']): number {
  if (!timeline) return 0;
  if (timeline === 'rush') {
    if (channel.effort === 'low') return 10;
    if (channel.effort === 'high') return -10;
  }
  if (timeline === 'relaxed') {
    if (channel.effort === 'high') return 5;
  }
  return 0;
}

function isDeveloperChannel(channel: Channel): boolean {
  const devChannels = [
    'Hacker News (Show HN)',
    'GitHub Trending',
    'Dev.to',
    'Reddit r/webdev',
    'Lobste.rs',
  ];
  return devChannels.includes(channel.name);
}

function isProductChannel(channel: Channel): boolean {
  const productChannels = [
    'Product Hunt',
    'BetaList',
    'Launching.io',
    'Uneed',
    'Indie Hackers',
  ];
  return productChannels.includes(channel.name);
}

function generateReason(channel: Channel, input: ProjectInput): string {
  const reasons: string[] = [];

  if (channel.cost === 'free') {
    reasons.push('Free to submit');
  }

  if (input.category === 'devtool' && isDeveloperChannel(channel)) {
    reasons.push('highly relevant developer audience');
  } else if (input.targetAudience === 'founders' && channel.name.includes('Indie')) {
    reasons.push('direct access to indie founder community');
  } else if (channel.type === 'directory') {
    reasons.push('product directory with early-adopter traffic');
  } else if (channel.type === 'social') {
    reasons.push('broad reach for building awareness');
  } else if (channel.type === 'news') {
    reasons.push('high-visibility tech news audience');
  } else if (channel.type === 'community') {
    reasons.push('engaged community for feedback and traction');
  } else if (channel.type === 'email') {
    reasons.push('curated audience with high open rates');
  }

  if (channel.effort === 'low') {
    reasons.push('quick to set up');
  }

  return reasons.length > 0
    ? reasons.join('. ') + '.'
    : `Good fit for launching ${input.projectName}.`;
}

function generateActionItems(channel: Channel, input: ProjectInput): string[] {
  const items: string[] = [];

  switch (channel.name) {
    case 'Reddit r/SideProject':
    case 'Reddit r/startups':
    case 'Reddit r/indiehackers':
    case 'Reddit r/webdev':
      items.push(`Write a genuine post about building ${input.projectName} — focus on the story, not the pitch`);
      items.push('Engage with every comment within the first 2 hours');
      items.push('Share what problem you are solving and why you built it');
      break;
    case 'Hacker News (Show HN)':
      items.push(`Submit as "Show HN: ${input.projectName} – ${input.description}"`);
      items.push('Post between 8-10 AM ET for maximum visibility');
      items.push('Write a top-level comment explaining the technical details');
      items.push('Respond to every comment quickly and substantively');
      break;
    case 'Product Hunt':
      items.push('Prepare assets: logo, gallery images, tagline (60 chars), description');
      items.push('Find a hunter with followers or self-launch');
      items.push('Schedule launch for Tuesday-Thursday at 12:01 AM PT');
      items.push('Prepare a maker comment with your backstory');
      break;
    case 'Indie Hackers':
      items.push(`Create a product page for ${input.projectName}`);
      items.push('Write a launch post sharing your journey and metrics');
      items.push('Engage in relevant group discussions before and after launch');
      break;
    case 'Dev.to':
      items.push(`Write a tutorial or technical write-up about building ${input.projectName}`);
      items.push('Use relevant tags (e.g., #showdev, #webdev, #opensource)');
      items.push('Include code snippets or architecture diagrams');
      break;
    case 'Twitter / X':
      items.push('Write a launch thread: problem, solution, demo, ask');
      items.push('Tag relevant people in the space');
      items.push('Pin the launch tweet to your profile');
      items.push('Engage with replies and quote tweets');
      break;
    case 'LinkedIn':
      items.push('Write a professional announcement post about the launch');
      items.push('Share the problem you are solving and who it helps');
      items.push('Ask your network to share and comment');
      break;
    case 'BetaList':
    case 'Launching.io':
    case 'Uneed':
      items.push(`Submit ${input.projectName} with a clear tagline and description`);
      items.push('Upload a high-quality logo and screenshot');
      if (input.demoUrl) items.push(`Include your demo URL: ${input.demoUrl}`);
      break;
    case 'Lobste.rs':
      items.push('Get an invite from an existing member');
      items.push(`Submit with a descriptive title about what ${input.projectName} does`);
      items.push('Be ready for in-depth technical questions');
      break;
    case 'GitHub Trending':
      items.push('Write an excellent README with clear install instructions');
      items.push('Add relevant topics/tags to the repository');
      items.push('Include a demo GIF or screenshot in the README');
      if (input.repoUrl) items.push(`Ensure your repo is public: ${input.repoUrl}`);
      break;
    default:
      items.push(`Submit ${input.projectName} with a compelling description`);
      items.push('Include a link to your demo or landing page');
      break;
  }

  return items;
}

function generateTimeline(input: ProjectInput, topChannels: ChannelRecommendation[]): TimelineItem[] {
  const timeline: TimelineItem[] = [];
  const channelNames = topChannels.map((c) => c.channel.name);

  // Day 1: Preparation
  timeline.push({
    day: 1,
    title: 'Preparation',
    tasks: [
      'Finalize landing page and demo',
      'Prepare screenshots, logo, and marketing assets',
      `Write a 1-paragraph pitch for ${input.projectName}`,
      'Set up analytics to track launch traffic',
    ],
  });

  // Day 2: Soft launch on low-effort channels
  const lowEffortChannels = topChannels.filter((c) => c.channel.effort === 'low').slice(0, 3);
  timeline.push({
    day: 2,
    title: 'Soft Launch',
    tasks: [
      'Submit to product directories (BetaList, Uneed, Launching.io)',
      ...lowEffortChannels.map((c) => `Submit to ${c.channel.name}`),
      'Share with close friends and ask for honest feedback',
    ],
  });

  // Day 3: Community launch
  timeline.push({
    day: 3,
    title: 'Community Launch',
    tasks: channelNames.includes('Reddit r/SideProject')
      ? [
          'Post on Reddit (r/SideProject, r/indiehackers)',
          'Write a genuine story post — no hard selling',
          'Monitor and reply to all comments within 2 hours',
        ]
      : [
          'Share in relevant online communities',
          'Write a genuine launch story',
          'Monitor and reply to all comments',
        ],
  });

  // Day 4: Major launch
  timeline.push({
    day: 4,
    title: 'Major Launch',
    tasks: channelNames.includes('Hacker News (Show HN)')
      ? [
          'Post Show HN in the morning (8-10 AM ET)',
          'Write a detailed first comment',
          'Stay online and respond to every comment',
        ]
      : channelNames.includes('Product Hunt')
        ? [
            'Launch on Product Hunt at 12:01 AM PT',
            'Post your maker comment immediately',
            'Rally your network for upvotes and comments',
          ]
        : [
            'Launch on your highest-impact channel',
            'Be available to respond to all feedback',
            'Share across your social networks',
          ],
  });

  // Day 5: Social amplification
  timeline.push({
    day: 5,
    title: 'Social Amplification',
    tasks: [
      'Post launch thread on Twitter / X',
      'Share professional update on LinkedIn',
      'Cross-post results and learnings from previous days',
      'Thank everyone who gave feedback',
    ],
  });

  // Day 6: Content push
  timeline.push({
    day: 6,
    title: 'Content & Follow-up',
    tasks: [
      'Write a blog post or Dev.to article about the launch',
      'Share metrics and learnings transparently',
      'Follow up with engaged users from earlier posts',
      'Reach out to newsletter curators',
    ],
  });

  // Day 7: Review and iterate
  timeline.push({
    day: 7,
    title: 'Review & Next Steps',
    tasks: [
      'Compile launch metrics (traffic, signups, feedback)',
      'Identify which channels drove the most engagement',
      'Respond to any remaining comments or messages',
      'Plan next week based on what worked',
    ],
  });

  return timeline;
}

function deriveChannelType(channel: Channel): OutreachTemplate['channelType'] {
  const name = channel.name.toLowerCase();
  if (name.includes('reddit')) return 'reddit';
  if (name.includes('hacker news') || name.includes('show hn')) return 'hackernews';
  if (name.includes('product hunt')) return 'producthunt';
  if (name.includes('twitter') || name.includes('x')) return 'twitter';
  if (name.includes('linkedin')) return 'linkedin';
  if (name.includes('dev.to')) return 'devto';
  if (name.includes('indie hacker')) return 'indiehackers';
  if (channel.type === 'email') return 'email';
  return 'community';
}

function deriveChannelId(channel: Channel): string {
  return channel.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const CHARACTER_LIMITS: Partial<Record<OutreachTemplate['channelType'], number>> = {
  twitter: 280,
  reddit: 40000,
  hackernews: 10000,
};

function generateOutreachTemplates(
  topChannels: ChannelRecommendation[],
  input: ProjectInput,
): OutreachTemplate[] {
  const templates: OutreachTemplate[] = [];

  for (const rec of topChannels.slice(0, 5)) {
    const channel = rec.channel;
    const channelType = deriveChannelType(channel);
    const id = deriveChannelId(channel);
    const characterLimit = CHARACTER_LIMITS[channelType];
    let template: OutreachTemplate;

    switch (channel.type) {
      case 'community':
        template = {
          id,
          channelName: channel.name,
          channelType,
          subject: `I built ${input.projectName} — ${input.description}`,
          body: `Hey everyone! I've been working on ${input.projectName} and wanted to share it with this community.\n\n**What it does:** ${input.description}\n\n${input.demoUrl ? `**Try it out:** ${input.demoUrl}\n\n` : ''}${input.repoUrl ? `**Source code:** ${input.repoUrl}\n\n` : ''}I'd love to hear your thoughts and feedback. What would make this more useful for you?`,
          tips: [
            'Be authentic — share your motivation and journey',
            'Ask a specific question to encourage discussion',
            'Respond to every comment, even critical ones',
          ],
          characterLimit,
        };
        break;
      case 'news':
        template = {
          id,
          channelName: channel.name,
          channelType,
          subject: `Show HN: ${input.projectName} – ${input.description}`,
          body: `${input.description}\n\n${input.demoUrl ? `Demo: ${input.demoUrl}\n` : ''}${input.repoUrl ? `Repo: ${input.repoUrl}\n` : ''}\nI built this because [explain the problem you experienced]. The key technical decisions were [briefly explain architecture]. Happy to answer any questions about the implementation.`,
          tips: [
            'Keep the title factual and concise',
            'Post between 8-10 AM ET on weekdays',
            'Write a substantive first comment with technical details',
            'Never ask for upvotes',
          ],
          characterLimit,
        };
        break;
      case 'social':
        template = {
          id,
          channelName: channel.name,
          channelType,
          body: `I just launched ${input.projectName}!\n\n${input.description}\n\n${input.demoUrl ? `Check it out: ${input.demoUrl}\n\n` : ''}Here's what I learned building it:\n1. [Key insight]\n2. [Key insight]\n3. [Key insight]\n\nWould love your feedback!`,
          tips: [
            'Use a thread format for more detail',
            'Include a screenshot or demo GIF',
            'Tag relevant people who might find it useful',
            'Post during peak hours for your audience timezone',
          ],
          characterLimit,
        };
        break;
      case 'directory':
        template = {
          id,
          channelName: channel.name,
          channelType,
          body: `${input.projectName}: ${input.description}`,
          tips: [
            'Use a clear, benefit-driven tagline',
            'Upload high-quality screenshots and logo',
            'Fill out all optional fields for better visibility',
          ],
          characterLimit,
        };
        break;
      case 'email':
        template = {
          id,
          channelName: channel.name,
          channelType,
          subject: `${input.projectName} — ${input.description}`,
          body: `Hi,\n\nI recently launched ${input.projectName}, which ${input.description.toLowerCase()}.\n\n${input.demoUrl ? `You can check it out here: ${input.demoUrl}\n\n` : ''}I think your readers would find this interesting because [explain why it is relevant to their audience].\n\nWould you consider featuring it in an upcoming issue?\n\nThanks!`,
          tips: [
            'Keep the pitch email under 150 words',
            'Explain why it is relevant to their specific audience',
            'Include a clear call-to-action',
            'Follow up once after 3-5 days if no response',
          ],
          characterLimit,
        };
        break;
    }

    templates.push(template!);
  }

  return templates;
}

/**
 * Generate a complete launch plan with channel recommendations,
 * timeline, and outreach templates based on project input.
 *
 * Scores all channels via {@link scoreChannel}, ranks them by relevance,
 * and selects the top 10. Then generates a 7-day launch timeline and
 * outreach templates for the top 5 channels.
 *
 * @param input - The project input containing name, description, URLs, and optional filters
 * @returns A complete {@link LaunchPlan} with ranked channels, timeline, and outreach templates
 */
export function generateRecommendations(input: ProjectInput): LaunchPlan {
  // Score and rank all channels
  const scored: ChannelRecommendation[] = CHANNELS.map((channel) => ({
    channel,
    relevanceScore: scoreChannel(channel, input),
    reason: generateReason(channel, input),
    actionItems: generateActionItems(channel, input),
  }));

  // Sort by relevance score descending
  scored.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Take top 10 channels
  const topChannels = scored.slice(0, 10);

  // Generate timeline and outreach templates
  const timeline = generateTimeline(input, topChannels);
  const outreachTemplates = generateOutreachTemplates(topChannels, input);

  return {
    projectName: input.projectName,
    channels: topChannels,
    timeline,
    outreachTemplates,
  };
}

import Link from 'next/link';
import ChannelList from '@/components/ChannelList';
import { ChannelRecommendation } from '@/types/recommendation';

const mockRecommendations: ChannelRecommendation[] = [
  {
    channel: {
      name: 'Hacker News',
      type: 'news',
      url: 'https://news.ycombinator.com/submit',
      description:
        'Tech-savvy audience of developers, founders, and investors. Show HN posts can drive massive early traffic.',
      audienceSize: '10M+ monthly',
      effort: 'medium',
      cost: 'free',
    },
    relevanceScore: 0.95,
    reason:
      'Your developer tool aligns perfectly with the HN audience. Show HN posts regularly hit the front page for well-crafted launches.',
    actionItems: [
      'Craft a concise Show HN title (under 80 chars)',
      'Write a top-level comment explaining the problem you solve',
      'Post between 8-9am ET on a weekday',
      'Respond to every comment within the first 2 hours',
    ],
  },
  {
    channel: {
      name: 'r/SideProject',
      type: 'community',
      url: 'https://www.reddit.com/r/SideProject/',
      description:
        'Reddit community for sharing side projects. Very supportive, great for early feedback and validation.',
      audienceSize: '200K+ members',
      effort: 'low',
      cost: 'free',
    },
    relevanceScore: 0.88,
    reason:
      'Side project communities are ideal for indie launches. Members are fellow builders who give genuine feedback.',
    actionItems: [
      'Share your story — what problem you faced personally',
      'Include a short demo GIF or video',
      'Ask for specific feedback, not just upvotes',
      'Follow up on comments with genuine responses',
    ],
  },
  {
    channel: {
      name: 'Product Hunt',
      type: 'directory',
      url: 'https://www.producthunt.com/',
      description:
        'The go-to platform for launching new products. Can drive thousands of signups on launch day.',
      audienceSize: '5M+ monthly',
      effort: 'high',
      cost: 'free',
    },
    relevanceScore: 0.85,
    reason:
      'Product Hunt remains the top launch platform. A well-prepared launch can generate significant buzz and backlinks.',
    actionItems: [
      'Secure a hunter with 1K+ followers to hunt your product',
      'Prepare all assets: tagline, description, gallery images, maker comment',
      'Schedule launch for Tuesday-Thursday at 12:01am PT',
      'Rally your network to support within the first hour',
      'Prepare a launch-day offer or exclusive for PH visitors',
    ],
  },
  {
    channel: {
      name: 'Twitter / X',
      type: 'social',
      url: 'https://twitter.com/compose/tweet',
      description:
        'Build in public and connect with the indie hacker community. Great for ongoing traction.',
      audienceSize: '500M+ monthly',
      effort: 'medium',
      cost: 'free',
    },
    relevanceScore: 0.82,
    reason:
      'The build-in-public community on Twitter is highly engaged. Threading your launch story can go viral in tech circles.',
    actionItems: [
      'Write a launch thread: problem, solution, journey, ask',
      'Tag relevant accounts and communities',
      'Use 2-3 relevant hashtags (#buildinpublic, #indiehackers)',
      'Pin the launch tweet to your profile',
    ],
  },
  {
    channel: {
      name: 'Indie Hackers',
      type: 'community',
      url: 'https://www.indiehackers.com/',
      description:
        'Community of bootstrapped founders sharing revenue, growth tactics, and honest feedback.',
      audienceSize: '100K+ members',
      effort: 'low',
      cost: 'free',
    },
    relevanceScore: 0.79,
    reason:
      'Fellow indie hackers understand your journey. Great place to share milestones and get actionable advice.',
    actionItems: [
      'Create a product page with your revenue/user metrics',
      'Write a launch post in the community section',
      'Join relevant groups and engage before launching',
      'Share your tech stack and lessons learned',
    ],
  },
  {
    channel: {
      name: 'Dev.to',
      type: 'community',
      url: 'https://dev.to/',
      description:
        'Developer-focused blogging platform. Technical write-ups about your stack and approach drive organic traffic.',
      audienceSize: '20M+ monthly',
      effort: 'medium',
      cost: 'free',
    },
    relevanceScore: 0.72,
    reason:
      'A well-written technical article about how you built your product can rank on Google and drive long-term traffic.',
    actionItems: [
      'Write a "How I Built X" article covering your tech stack',
      'Include code snippets and architecture decisions',
      'Add a clear CTA at the end linking to your product',
      'Cross-post to Hashnode and Medium for extra reach',
    ],
  },
  {
    channel: {
      name: 'BetaList',
      type: 'directory',
      url: 'https://betalist.com/submit',
      description:
        'Curated directory of upcoming startups and products. Good for early adopter signups.',
      audienceSize: '50K+ monthly',
      effort: 'low',
      cost: 'free',
    },
    relevanceScore: 0.68,
    reason:
      'BetaList attracts early adopters actively looking for new tools to try. Low-effort submission with good ROI.',
    actionItems: [
      'Submit your product with a compelling one-liner',
      'Prepare a landing page with email capture before submitting',
      'Add high-quality screenshots or a demo video',
    ],
  },
  {
    channel: {
      name: 'Launch newsletter',
      type: 'email',
      url: 'https://www.launchingnext.com/submit/',
      description:
        'Email newsletters curating new launches reach engaged audiences who actively discover new tools.',
      audienceSize: '30K+ subscribers',
      effort: 'low',
      cost: 'low',
    },
    relevanceScore: 0.6,
    reason:
      'Newsletter features can drive a burst of highly targeted traffic from readers who love discovering new products.',
    actionItems: [
      'Submit to LaunchingNext, BetaPage, and SaaSHub',
      'Prepare a press kit with logo, screenshots, and one-liner',
      'Follow up if you do not hear back within a week',
    ],
  },
];

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/launch"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/40 transition-colors hover:text-white/70"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to launch
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Your Launch Channels
          </h1>
          <p className="mt-3 text-lg text-white/50">
            Personalized recommendations sorted by relevance to your project.
          </p>
        </div>

        {/* Channel list */}
        <ChannelList recommendations={mockRecommendations} />
      </div>
    </div>
  );
}

export interface Channel {
  name: string;
  type: 'social' | 'community' | 'news' | 'directory' | 'email';
  url: string;
  description: string;
  audienceSize: string;
  effort: 'low' | 'medium' | 'high';
  cost: 'free' | 'low' | 'medium';
  categories: string[];
}

export const channels: Channel[] = [
  { name: 'Reddit - r/SideProject', type: 'community', url: 'https://reddit.com/r/SideProject', description: 'Community for side projects', audienceSize: '200k+', effort: 'low', cost: 'free', categories: ['saas', 'devtool', 'mobile', 'other'] },
  { name: 'Hacker News', type: 'news', url: 'https://news.ycombinator.com', description: 'Tech news and Show HN', audienceSize: '500k+', effort: 'medium', cost: 'free', categories: ['devtool', 'saas'] },
  { name: 'Product Hunt', type: 'directory', url: 'https://producthunt.com', description: 'Product launch platform', audienceSize: '1M+', effort: 'high', cost: 'free', categories: ['saas', 'devtool', 'mobile', 'marketplace'] },
];

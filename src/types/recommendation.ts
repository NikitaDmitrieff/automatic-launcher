import type { OutreachTemplate } from './outreach';
export type { OutreachTemplate } from './outreach';

export interface Channel {
  name: string;
  type: 'social' | 'community' | 'news' | 'directory' | 'email';
  url: string;
  description: string;
  audienceSize: string;
  effort: 'low' | 'medium' | 'high';
  cost: 'free' | 'low' | 'medium';
}

export interface ChannelRecommendation {
  channel: Channel;
  relevanceScore: number;
  reason: string;
  actionItems: string[];
}

export interface LaunchPlan {
  projectName: string;
  channels: ChannelRecommendation[];
  timeline: TimelineItem[];
  outreachTemplates: OutreachTemplate[];
}

export interface TimelineItem {
  day: number;
  title: string;
  tasks: string[];
}

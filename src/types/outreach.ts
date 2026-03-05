export interface OutreachTemplate {
  id: string;
  channelName: string;
  channelType: 'reddit' | 'hackernews' | 'producthunt' | 'twitter' | 'linkedin' | 'email' | 'community' | 'devto' | 'indiehackers';
  subject?: string;
  body: string;
  tips: string[];
  characterLimit?: number;
}

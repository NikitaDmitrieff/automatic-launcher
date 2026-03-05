export interface OutreachTemplate {
  id: string;
  channelName: string;
  channelType: 'reddit' | 'hackernews' | 'producthunt' | 'twitter' | 'linkedin' | 'email' | 'community';
  subject?: string;
  body: string;
  tips: string[];
  characterLimit?: number;
}

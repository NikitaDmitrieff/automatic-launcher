'use client';

import { useState, useMemo, useCallback } from 'react';
import { ChannelRecommendation } from '@/types/recommendation';
import ChannelCard from './ChannelCard';

type ChannelType = 'all' | 'social' | 'community' | 'news' | 'directory' | 'email';
type SortOption = 'relevance' | 'effort';

const effortOrder: Record<string, number> = { low: 1, medium: 2, high: 3 };

const tabs: { value: ChannelType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'social', label: 'Social' },
  { value: 'community', label: 'Community' },
  { value: 'news', label: 'News' },
  { value: 'directory', label: 'Directory' },
  { value: 'email', label: 'Email' },
];

export default function ChannelList({ recommendations }: { recommendations: ChannelRecommendation[] }) {
  const [activeType, setActiveType] = useState<ChannelType>('all');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');

  const handleTypeChange = useCallback((type: ChannelType) => {
    setActiveType(type);
  }, []);

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortOption);
  }, []);

  const filtered = useMemo(() => {
    let result = recommendations;

    if (activeType !== 'all') {
      result = result.filter((r) => r.channel.type === activeType);
    }

    result = [...result].sort((a, b) => {
      if (sortBy === 'relevance') {
        return b.relevanceScore - a.relevanceScore;
      }
      return effortOrder[a.channel.effort] - effortOrder[b.channel.effort];
    });

    return result;
  }, [recommendations, activeType, sortBy]);

  return (
    <div>
      {/* Controls */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Filter tabs */}
        <div role="tablist" aria-label="Filter channels by type" className="flex flex-wrap gap-1.5 rounded-xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-md">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              role="tab"
              aria-selected={activeType === tab.value}
              aria-label={`Filter by ${tab.label}`}
              onClick={() => handleTypeChange(tab.value)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                activeType === tab.value
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-white/50 hover:text-white/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort select */}
        <div className="flex items-center gap-2">
          <label htmlFor="channel-sort" className="text-sm text-white/40">Sort by</label>
          <select
            id="channel-sort"
            value={sortBy}
            onChange={handleSortChange}
            aria-label="Sort channels"
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/70 backdrop-blur-md outline-none transition-colors focus:border-white/20"
          >
            <option value="relevance">Relevance</option>
            <option value="effort">Effort (low first)</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="mb-4 text-sm text-white/40">
        {filtered.length} channel{filtered.length !== 1 ? 's' : ''} found
      </p>

      {/* Grid */}
      <div role="list" className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((rec) => (
          <div role="listitem" key={rec.channel.name}>
            <ChannelCard recommendation={rec} />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center text-white/30">
          No channels match this filter.
        </div>
      )}
    </div>
  );
}

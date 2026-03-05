'use client';

import React, { useState } from 'react';
import { ChannelRecommendation } from '@/types/recommendation';

const typeColors: Record<string, string> = {
  social: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  community: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  news: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  directory: 'bg-green-500/20 text-green-300 border-green-500/30',
  email: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
};

const effortColors: Record<string, string> = {
  low: 'bg-green-500/20 text-green-300',
  medium: 'bg-yellow-500/20 text-yellow-300',
  high: 'bg-red-500/20 text-red-300',
};

const costColors: Record<string, string> = {
  free: 'bg-emerald-500/20 text-emerald-300',
  low: 'bg-yellow-500/20 text-yellow-300',
  medium: 'bg-orange-500/20 text-orange-300',
};

function ChannelCard({ recommendation }: { recommendation: ChannelRecommendation }) {
  const { channel, relevanceScore, reason, actionItems } = recommendation;
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleItem = (index: number) => {
    setCheckedItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const scorePercent = Math.round(relevanceScore * 100);

  return (
    <div className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-lg hover:shadow-purple-500/5">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <a
          href={channel.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-lg font-semibold text-white transition-colors hover:text-purple-300"
        >
          {channel.name}
          <svg
            className="h-4 w-4 shrink-0 opacity-50 transition-opacity group-hover:opacity-100"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${typeColors[channel.type]}`}
        >
          {channel.type}
        </span>
      </div>

      {/* Relevance score bar */}
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-white/50">Relevance</span>
          <span className="font-medium text-white/70">{scorePercent}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
            style={{ width: `${scorePercent}%` }}
          />
        </div>
      </div>

      {/* Description */}
      <p className="mb-4 text-sm leading-relaxed text-white/60">{channel.description}</p>

      {/* Badges */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/60">
          {channel.audienceSize}
        </span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs ${effortColors[channel.effort]}`}>
          {channel.effort} effort
        </span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs ${costColors[channel.cost]}`}>
          {channel.cost === 'free' ? 'Free' : `${channel.cost} cost`}
        </span>
      </div>

      {/* Why recommended */}
      <div className="mb-4 rounded-xl bg-white/5 p-3">
        <h4 className="mb-1 text-xs font-medium text-white/40">Why recommended</h4>
        <p className="text-sm text-white/70">{reason}</p>
      </div>

      {/* Action items */}
      <div>
        <h4 className="mb-2 text-xs font-medium text-white/40">Action items</h4>
        <ul className="space-y-1.5">
          {actionItems.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <button
                onClick={() => toggleItem(index)}
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                  checkedItems[index]
                    ? 'border-purple-500 bg-purple-500 text-white'
                    : 'border-white/20 bg-transparent hover:border-white/40'
                }`}
              >
                {checkedItems[index] && (
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <span
                className={`text-sm transition-colors ${
                  checkedItems[index] ? 'text-white/30 line-through' : 'text-white/60'
                }`}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default React.memo(ChannelCard);

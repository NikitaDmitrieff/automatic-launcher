'use client';

import React, { useState } from 'react';
import { ChannelRecommendation } from '@/types/recommendation';

function ChannelCard({ recommendation }: { recommendation: ChannelRecommendation }) {
  const { channel, relevanceScore, reason, actionItems } = recommendation;
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleItem = (index: number) => {
    setCheckedItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const scorePercent = Math.round(relevanceScore * 100);

  return (
    <div role="article" className="group relative rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <a
          href={channel.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${channel.name} (opens in new tab)`}
          className="flex items-center gap-2 text-sm font-bold text-zinc-100 transition-colors hover:text-white"
        >
          {channel.name}
          <svg
            className="h-3.5 w-3.5 shrink-0 text-zinc-600 transition-colors group-hover:text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          <span className="sr-only">(opens in new tab)</span>
        </a>
        <span className="shrink-0 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-zinc-500">
          {channel.type}
        </span>
      </div>

      {/* Relevance score bar */}
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-zinc-600">Relevance</span>
          <span className="font-medium font-[family-name:var(--font-code)] text-zinc-500">{scorePercent}%</span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-white/30 transition-all duration-500"
            style={{ width: `${scorePercent}%` }}
          />
        </div>
      </div>

      {/* Description */}
      <p className="mb-4 text-sm leading-relaxed text-zinc-500">{channel.description}</p>

      {/* Badges */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-white/[0.04] border border-white/[0.06] px-2.5 py-0.5 text-[11px] text-zinc-500">
          {channel.audienceSize}
        </span>
        <span className="rounded-full bg-white/[0.04] border border-white/[0.06] px-2.5 py-0.5 text-[11px] text-zinc-500">
          {channel.effort} effort
        </span>
        <span className="rounded-full bg-white/[0.04] border border-white/[0.06] px-2.5 py-0.5 text-[11px] text-zinc-500">
          {channel.cost === 'free' ? 'Free' : `${channel.cost} cost`}
        </span>
      </div>

      {/* Why recommended */}
      <div className="mb-4 rounded-lg bg-white/[0.03] border border-white/[0.04] p-3">
        <h4 className="mb-1 text-[11px] font-medium text-zinc-600 uppercase tracking-wider">Why recommended</h4>
        <p className="text-sm text-zinc-400">{reason}</p>
      </div>

      {/* Action items */}
      <div>
        <h4 className="mb-2 text-[11px] font-medium text-zinc-600 uppercase tracking-wider">Action items</h4>
        <ul className="space-y-1.5">
          {actionItems.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <button
                onClick={() => toggleItem(index)}
                aria-label={`Mark "${item}" as ${checkedItems[index] ? 'incomplete' : 'complete'}`}
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                  checkedItems[index]
                    ? 'border-zinc-500 bg-white text-black'
                    : 'border-white/[0.12] bg-transparent hover:border-white/[0.25]'
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
                  checkedItems[index] ? 'text-zinc-700 line-through' : 'text-zinc-500'
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

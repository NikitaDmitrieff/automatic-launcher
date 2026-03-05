'use client';

import React, { useState } from 'react';
import { ChannelRecommendation } from '@/types/recommendation';

function ChannelCard({ recommendation }: { recommendation: ChannelRecommendation }) {
  const { channel, relevanceScore, reason, actionItems } = recommendation;
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleItem = (index: number) => {
    setCheckedItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const scorePercent = Math.round(relevanceScore);

  return (
    <div role="article" className="group relative rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-6 transition-all duration-300 hover:border-[var(--border-hover)] hover:bg-[var(--surface-4)]">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <a
          href={channel.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${channel.name} (opens in new tab)`}
          className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)] transition-colors hover:text-[var(--text-primary)]"
        >
          {channel.name}
          <svg
            className="h-3.5 w-3.5 shrink-0 text-[var(--text-muted)] transition-colors group-hover:text-[var(--text-tertiary)]"
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
        <span className="shrink-0 rounded-full border border-[var(--border-medium)] bg-[var(--surface-4)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--text-muted)]">
          {channel.type}
        </span>
      </div>

      {/* Relevance score bar */}
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-[var(--text-muted)]">Relevance</span>
          <span className="font-medium font-[family-name:var(--font-code)] text-[var(--text-secondary)]">{scorePercent}%</span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--surface-6)]">
          <div
            className="h-full rounded-full bg-[var(--progress-fill)] transition-all duration-500"
            style={{ width: `${scorePercent}%` }}
          />
        </div>
      </div>

      {/* Description */}
      <p className="mb-4 text-sm leading-relaxed text-[var(--text-secondary)]">{channel.description}</p>

      {/* Badges */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-[var(--surface-4)] border border-[var(--border)] px-2.5 py-0.5 text-[11px] text-[var(--text-muted)]">
          {channel.audienceSize}
        </span>
        <span className="rounded-full bg-[var(--surface-4)] border border-[var(--border)] px-2.5 py-0.5 text-[11px] text-[var(--text-muted)]">
          {channel.effort} effort
        </span>
        <span className="rounded-full bg-[var(--surface-4)] border border-[var(--border)] px-2.5 py-0.5 text-[11px] text-[var(--text-muted)]">
          {channel.cost === 'free' ? 'Free' : `${channel.cost} cost`}
        </span>
      </div>

      {/* Why recommended */}
      <div className="mb-4 rounded-lg bg-[var(--surface-3)] border border-[var(--border-subtle)] p-3">
        <h4 className="mb-1 text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">Why recommended</h4>
        <p className="text-sm text-[var(--text-tertiary)]">{reason}</p>
      </div>

      {/* Action items */}
      <div>
        <h4 className="mb-2 text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">Action items</h4>
        <ul className="space-y-1.5">
          {actionItems.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <button
                onClick={() => toggleItem(index)}
                aria-label={`Mark "${item}" as ${checkedItems[index] ? 'incomplete' : 'complete'}`}
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                  checkedItems[index]
                    ? 'border-[var(--text-secondary)] bg-[var(--accent-bg)] text-[var(--accent-text)]'
                    : 'border-[var(--border-hover)] bg-transparent hover:border-[var(--border-focus)]'
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
                  checkedItems[index] ? 'text-[var(--text-faint)] line-through' : 'text-[var(--text-secondary)]'
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

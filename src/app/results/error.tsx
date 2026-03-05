'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ResultsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Results error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center px-4">
      <div className="glass max-w-md w-full rounded-2xl p-8 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
          <svg
            className="h-8 w-8 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          Failed to load your launch plan
        </h1>
        <p className="text-[var(--text-muted)] mb-8">
          Something went wrong while generating your recommendations. Please try
          again or go back to update your project details.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 rounded-lg bg-red-500/5 border border-red-500/10 p-4 text-left">
            <p className="text-sm font-mono text-red-300/80 break-words">
              {error.message}
            </p>
            {error.digest && (
              <p className="mt-2 text-xs text-[var(--text-faint)]">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--surface-8)] px-6 py-3 text-sm font-medium text-[var(--text-primary)] transition-all duration-300 hover:bg-[var(--surface-6)] border border-[var(--border-medium)] hover:border-[var(--border-hover)]"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try again
          </button>

          <Link
            href="/launch"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--surface-4)] px-6 py-3 text-sm font-medium text-[var(--text-secondary)] transition-all duration-300 hover:bg-[var(--surface-8)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)]"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to launch
          </Link>
        </div>
      </div>
    </div>
  );
}

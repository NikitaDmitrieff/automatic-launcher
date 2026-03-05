'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ChannelList from '@/components/ChannelList';
import ExportPanel from '@/components/ExportPanel';
import { generateRecommendations } from '@/lib/engine';
import type { ProjectInput } from '@/types/project';
import type { ChannelRecommendation } from '@/types/recommendation';

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('id');

  const [channels, setChannels] = useState<ChannelRecommendation[] | null>(null);
  const [projectName, setProjectName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPlan() {
      // If we have a plan ID, fetch from API
      if (planId) {
        try {
          const res = await fetch(`/api/plans/${planId}`);
          if (res.ok) {
            const plan = await res.json();
            setProjectName(plan.input.projectName);
            if (plan.recommendations?.channels) {
              setChannels(plan.recommendations.channels);
            } else {
              // Regenerate from stored input if recommendations missing
              const recs = generateRecommendations(plan.input);
              setChannels(recs.channels);
            }
            return;
          }
          setError('Plan not found. It may have expired or been deleted.');
          return;
        } catch {
          setError('Failed to load plan. Please try again.');
          return;
        }
      }

      // Fallback: load from sessionStorage (backward compat)
      const raw = sessionStorage.getItem('projectInput');
      if (!raw) {
        router.push('/launch');
        return;
      }

      try {
        const input: ProjectInput = JSON.parse(raw);
        setProjectName(input.projectName);
        const plan = generateRecommendations(input);
        setChannels(plan.channels);
      } catch {
        router.push('/launch');
      }
    }

    loadPlan();
  }, [router, planId]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">&#x26A0;</div>
          <h2 className="text-xl font-semibold text-white mb-2">Plan Not Found</h2>
          <p className="text-white/50 mb-6">{error}</p>
          <Link
            href="/launch"
            className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/20"
          >
            Create a new plan
          </Link>
        </div>
      </div>
    );
  }

  if (!channels) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white/80" />
          <p className="mt-4 text-white/50">Generating your launch plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/launch"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-600 transition-colors hover:text-zinc-400"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to launch
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Launch Plan for {projectName}
          </h1>
          <p className="mt-3 text-lg text-zinc-500">
            Personalized recommendations sorted by relevance to your project.
          </p>
        </div>

        {/* Channel list */}
        <ChannelList recommendations={channels} />

        {/* Export & Share */}
        <div className="mt-10">
          <ExportPanel
            data={{
              projectName,
              channels: channels.map((c) => ({
                name: c.channel.name,
                url: c.channel.url,
                reason: c.reason,
                actionItems: c.actionItems,
              })),
              timeline: [],
              templates: [],
            }}
            planId={planId ?? undefined}
          />
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white/80" />
            <p className="mt-4 text-white/50">Loading...</p>
          </div>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}

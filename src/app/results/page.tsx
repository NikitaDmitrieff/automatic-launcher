'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ChannelList from '@/components/ChannelList';
import { generateRecommendations } from '@/lib/engine';
import type { ProjectInput } from '@/types/project';
import type { ChannelRecommendation } from '@/types/recommendation';

export default function ResultsPage() {
  const router = useRouter();
  const [channels, setChannels] = useState<ChannelRecommendation[] | null>(null);
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
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
  }, [router]);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/launch"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/40 transition-colors hover:text-white/70"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to launch
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Launch Plan for {projectName}
          </h1>
          <p className="mt-3 text-lg text-white/50">
            Personalized recommendations sorted by relevance to your project.
          </p>
        </div>

        {/* Channel list */}
        <ChannelList recommendations={channels} />
      </div>
    </div>
  );
}

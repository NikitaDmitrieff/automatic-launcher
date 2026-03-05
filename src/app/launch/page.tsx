'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ProjectForm from '@/components/ProjectForm';
import type { ProjectInput } from '@/types/project';

export default function LaunchPage() {
  const router = useRouter();
  const [, setProjectData] = useState<ProjectInput | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(data: ProjectInput) {
    setIsSubmitting(true);
    setProjectData(data);

    // Always store in sessionStorage as fallback
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('projectInput', JSON.stringify(data));
    }

    // Try to persist via API for shareable URL
    try {
      const res = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const plan = await res.json();
        router.push(`/results?id=${plan.id}`);
        return;
      }
    } catch {
      // API failed — fall back to sessionStorage-only flow
    }

    router.push('/results');
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4 py-16">
      <ProjectForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </main>
  );
}

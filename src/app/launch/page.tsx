'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ProjectForm from '@/components/ProjectForm';
import type { ProjectInput } from '@/types/project';

export default function LaunchPage() {
  const router = useRouter();
  const [, setProjectData] = useState<ProjectInput | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(data: ProjectInput) {
    setIsSubmitting(true);
    setProjectData(data);
    // Store in sessionStorage so /results can read it
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('projectInput', JSON.stringify(data));
    }
    router.push('/results');
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4 py-16">
      <ProjectForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </main>
  );
}

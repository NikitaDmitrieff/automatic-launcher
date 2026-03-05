'use client';

import { useState } from 'react';
import type { ProjectInput } from '@/types/project';

interface ProjectFormProps {
  onSubmit: (data: ProjectInput) => void;
}

export default function ProjectForm({ onSubmit }: ProjectFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectInput, string>>>({});

  const [formData, setFormData] = useState<ProjectInput>({
    projectName: '',
    description: '',
    repoUrl: '',
    demoUrl: '',
  });

  function updateField<K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  function validate(): boolean {
    const next: Partial<Record<keyof ProjectInput, string>> = {};

    if (!formData.projectName.trim()) next.projectName = 'Project name is required';
    if (!formData.description.trim()) next.description = 'Description is required';
    if (!formData.repoUrl.trim()) next.repoUrl = 'Repository URL is required';
    if (!formData.demoUrl.trim()) next.demoUrl = 'Demo URL is required';

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  }

  const inputClass =
    'w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition-all duration-200 focus:border-white/30 focus:ring-2 focus:ring-white/20 focus:bg-white/10';

  const labelClass = 'block text-sm font-medium text-white/70 mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <h2 className="text-2xl font-bold text-white mb-1">Launch your project</h2>
        <p className="text-white/50 mb-8 text-sm">
          Fill in the details and get a personalized launch plan.
        </p>

        <div className="space-y-5">
          {/* Project Name */}
          <div>
            <label htmlFor="projectName" className={labelClass}>
              Project Name
            </label>
            <input
              id="projectName"
              type="text"
              placeholder="My Awesome App"
              className={inputClass}
              value={formData.projectName}
              onChange={(e) => updateField('projectName', e.target.value)}
            />
            {errors.projectName && <p className="mt-1 text-sm text-red-400">{errors.projectName}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className={labelClass}>
              Short Description
            </label>
            <textarea
              id="description"
              rows={3}
              placeholder="Describe what your project does in 1-2 sentences"
              className={inputClass + ' resize-none'}
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-400">{errors.description}</p>
            )}
          </div>

          {/* Repo URL */}
          <div>
            <label htmlFor="repoUrl" className={labelClass}>
              Repository URL
            </label>
            <input
              id="repoUrl"
              type="url"
              placeholder="https://github.com/you/project"
              className={inputClass}
              value={formData.repoUrl}
              onChange={(e) => updateField('repoUrl', e.target.value)}
            />
            {errors.repoUrl && <p className="mt-1 text-sm text-red-400">{errors.repoUrl}</p>}
          </div>

          {/* Demo URL */}
          <div>
            <label htmlFor="demoUrl" className={labelClass}>
              Demo URL
            </label>
            <input
              id="demoUrl"
              type="url"
              placeholder="https://myproject.vercel.app"
              className={inputClass}
              value={formData.demoUrl}
              onChange={(e) => updateField('demoUrl', e.target.value)}
            />
            {errors.demoUrl && <p className="mt-1 text-sm text-red-400">{errors.demoUrl}</p>}
          </div>
        </div>

        {/* Advanced Options */}
        <div className="mt-8 border-t border-white/10 pt-6">
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors duration-200"
          >
            <svg
              className={`h-4 w-4 transition-transform duration-200 ${showAdvanced ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            Advanced Options
          </button>

          {showAdvanced && (
            <div className="mt-4 space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Target Audience */}
              <div>
                <label htmlFor="targetAudience" className={labelClass}>
                  Target Audience
                </label>
                <select
                  id="targetAudience"
                  className={inputClass}
                  value={formData.targetAudience ?? ''}
                  onChange={(e) =>
                    updateField(
                      'targetAudience',
                      (e.target.value || undefined) as ProjectInput['targetAudience'],
                    )
                  }
                >
                  <option value="">Select target audience</option>
                  <option value="developers">Developers</option>
                  <option value="designers">Designers</option>
                  <option value="marketers">Marketers</option>
                  <option value="founders">Founders</option>
                  <option value="general">General</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className={labelClass}>
                  Category
                </label>
                <select
                  id="category"
                  className={inputClass}
                  value={formData.category ?? ''}
                  onChange={(e) =>
                    updateField(
                      'category',
                      (e.target.value || undefined) as ProjectInput['category'],
                    )
                  }
                >
                  <option value="">Select a category</option>
                  <option value="saas">SaaS</option>
                  <option value="devtool">Developer Tool</option>
                  <option value="mobile-app">Mobile App</option>
                  <option value="marketplace">Marketplace</option>
                  <option value="content">Content / Media</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Budget */}
              <div>
                <label htmlFor="budget" className={labelClass}>
                  Budget
                </label>
                <select
                  id="budget"
                  className={inputClass}
                  value={formData.budget ?? ''}
                  onChange={(e) =>
                    updateField(
                      'budget',
                      (e.target.value || undefined) as ProjectInput['budget'],
                    )
                  }
                >
                  <option value="">Select budget</option>
                  <option value="zero">Free ($0)</option>
                  <option value="low">Low (&lt; $100)</option>
                  <option value="medium">Medium ($100 - $500)</option>
                </select>
              </div>

              {/* Timeline */}
              <div>
                <label htmlFor="timeline" className={labelClass}>
                  Timeline
                </label>
                <select
                  id="timeline"
                  className={inputClass}
                  value={formData.timeline ?? ''}
                  onChange={(e) =>
                    updateField(
                      'timeline',
                      (e.target.value || undefined) as ProjectInput['timeline'],
                    )
                  }
                >
                  <option value="">Select timeline</option>
                  <option value="rush">Rush (24 hours)</option>
                  <option value="standard">Standard (1 week)</option>
                  <option value="relaxed">Relaxed (2 weeks)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-8 w-full rounded-lg bg-white/90 px-6 py-3 text-sm font-semibold text-gray-900 transition-all duration-200 hover:bg-white hover:shadow-lg hover:shadow-white/20 active:scale-[0.98]"
        >
          Generate Launch Plan
        </button>
      </div>
    </form>
  );
}

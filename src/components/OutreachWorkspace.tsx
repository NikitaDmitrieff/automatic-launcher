'use client';

import { useState, useMemo, useCallback } from 'react';
import { outreachTemplates, fillTemplate } from '../lib/templates';
import type { OutreachTemplate } from '../types/outreach';
import OutreachEditor from './OutreachEditor';

interface OutreachWorkspaceProps {
  projectName?: string;
  description?: string;
  demoUrl?: string;
}

export default function OutreachWorkspace({
  projectName = '{{projectName}}',
  description = '{{description}}',
  demoUrl = '{{demoUrl}}',
}: OutreachWorkspaceProps) {
  const [activeTemplateId, setActiveTemplateId] = useState(
    outreachTemplates[0].id
  );
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());

  const filledTemplates = useMemo(
    () =>
      outreachTemplates.map((t) =>
        fillTemplate(t, { projectName, description, demoUrl })
      ),
    [projectName, description, demoUrl]
  );

  const activeTemplate = filledTemplates.find(
    (t) => t.id === activeTemplateId
  )!;

  const handleMarkDone = useCallback((id: string) => {
    setDoneIds((prev) => new Set(prev).add(id));
  }, []);

  const progress = doneIds.size;
  const total = outreachTemplates.length;
  const progressPercent = Math.round((progress / total) * 100);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Outreach Workspace
          </h2>
          <p className="text-sm text-zinc-600">
            Customize and copy launch templates for each channel. Edit the
            placeholders, then copy when ready.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-500">Launch progress</span>
            <span className="text-sm font-[family-name:var(--font-code)] text-zinc-600">
              {progress}/{total} channels ready
            </span>
          </div>
          <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
            <div
              className="h-full bg-white/30 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Channel Tabs */}
        <div className="flex flex-wrap gap-2">
          {outreachTemplates.map((template: OutreachTemplate) => {
            const isActive = template.id === activeTemplateId;
            const isDone = doneIds.has(template.id);

            return (
              <button
                key={template.id}
                onClick={() => setActiveTemplateId(template.id)}
                className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                  isActive
                    ? 'bg-white/[0.08] border-white/[0.12] text-white'
                    : 'border-white/[0.04] text-zinc-600 hover:text-zinc-400 hover:border-white/[0.08]'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {template.channelName}
                  {isDone && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-zinc-400" />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Editor */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 md:p-6">
          <OutreachEditor
            key={activeTemplate.id}
            template={activeTemplate}
            onMarkDone={handleMarkDone}
            isDone={doneIds.has(activeTemplate.id)}
          />
        </div>
      </div>
    </div>
  );
}

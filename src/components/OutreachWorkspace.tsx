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

  const activeTemplate =
    filledTemplates.find((t) => t.id === activeTemplateId) ??
    filledTemplates[0];

  const handleMarkDone = useCallback((id: string) => {
    setDoneIds((prev) => new Set(prev).add(id));
  }, []);

  const progress = doneIds.size;
  const total = outreachTemplates.length;
  const progressPercent = Math.round((progress / total) * 100);

  return (
    <div className="text-[var(--text-primary)]">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Outreach Workspace
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            Customize and copy launch templates for each channel. Edit the
            placeholders, then copy when ready.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-[var(--surface-3)] border border-[var(--border)] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[var(--text-secondary)]">Launch progress</span>
            <span className="text-sm font-[family-name:var(--font-code)] text-[var(--text-muted)]">
              {progress}/{total} channels ready
            </span>
          </div>
          <div className="h-1.5 bg-[var(--surface-4)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--progress-fill)] rounded-full transition-all duration-500 ease-out"
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
                    ? 'bg-[var(--surface-8)] border-[var(--border-hover)] text-[var(--text-primary)]'
                    : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-tertiary)] hover:border-[var(--border-medium)]'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {template.channelName}
                  {isDone && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--text-tertiary)]" />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Editor */}
        <div className="bg-[var(--surface-3)] border border-[var(--border)] rounded-2xl p-5 md:p-6">
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

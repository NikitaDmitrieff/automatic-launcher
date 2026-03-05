'use client';

import { useState, useMemo, useCallback } from 'react';
import { outreachTemplates, fillTemplate } from '../lib/templates';
import type { OutreachTemplate } from '../types/outreach';
import OutreachEditor from './OutreachEditor';

const channelTabColors: Record<OutreachTemplate['channelType'], string> = {
  reddit: 'bg-orange-500/20 border-orange-500/40 text-orange-300',
  hackernews: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
  producthunt: 'bg-red-500/20 border-red-500/40 text-red-300',
  twitter: 'bg-sky-500/20 border-sky-500/40 text-sky-300',
  linkedin: 'bg-blue-500/20 border-blue-500/40 text-blue-300',
  email: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
  community: 'bg-violet-500/20 border-violet-500/40 text-violet-300',
};

const channelTabInactive: Record<OutreachTemplate['channelType'], string> = {
  reddit: 'hover:bg-orange-500/10 hover:border-orange-500/20 text-white/50',
  hackernews: 'hover:bg-amber-500/10 hover:border-amber-500/20 text-white/50',
  producthunt: 'hover:bg-red-500/10 hover:border-red-500/20 text-white/50',
  twitter: 'hover:bg-sky-500/10 hover:border-sky-500/20 text-white/50',
  linkedin: 'hover:bg-blue-500/10 hover:border-blue-500/20 text-white/50',
  email: 'hover:bg-emerald-500/10 hover:border-emerald-500/20 text-white/50',
  community:
    'hover:bg-violet-500/10 hover:border-violet-500/20 text-white/50',
};

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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-white/90">
            Outreach Workspace
          </h2>
          <p className="text-sm text-white/40">
            Customize and copy launch templates for each channel. Edit the
            placeholders, then copy when ready.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/60">Launch progress</span>
            <span className="text-sm font-mono text-white/40">
              {progress}/{total} channels ready
            </span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Channel Tabs */}
        <div className="flex flex-wrap gap-2">
          {outreachTemplates.map((template) => {
            const isActive = template.id === activeTemplateId;
            const isDone = doneIds.has(template.id);

            return (
              <button
                key={template.id}
                onClick={() => setActiveTemplateId(template.id)}
                className={`px-3 py-2 text-sm rounded-lg border transition-all backdrop-blur-sm ${
                  isActive
                    ? channelTabColors[template.channelType]
                    : `border-white/5 ${channelTabInactive[template.channelType]}`
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {template.channelName}
                  {isDone && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Editor */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 backdrop-blur-md">
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

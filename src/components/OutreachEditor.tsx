'use client';

import { useState, useCallback } from 'react';
import type { OutreachTemplate } from '../types/outreach';

const channelIcons: Record<OutreachTemplate['channelType'], string> = {
  reddit: 'R',
  hackernews: 'Y',
  producthunt: 'P',
  twitter: 'X',
  linkedin: 'in',
  email: '@',
  community: '#',
  devto: 'D',
  indiehackers: 'IH',
};

interface OutreachEditorProps {
  template: OutreachTemplate;
  onMarkDone: (id: string) => void;
  isDone: boolean;
}

export default function OutreachEditor({
  template,
  onMarkDone,
  isDone,
}: OutreachEditorProps) {
  const [subject, setSubject] = useState(template.subject ?? '');
  const [body, setBody] = useState(template.body);
  const [copied, setCopied] = useState(false);
  const [showTips, setShowTips] = useState(true);

  const characterCount = body.length;
  const isOverLimit =
    template.characterLimit !== undefined &&
    characterCount > template.characterLimit;

  const resetToTemplate = useCallback(() => {
    setSubject(template.subject ?? '');
    setBody(template.body);
  }, [template]);

  const copyToClipboard = useCallback(async () => {
    const fullText = subject ? `${subject}\n\n${body}` : body;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      onMarkDone(template.id);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = fullText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      onMarkDone(template.id);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [subject, body, template.id, onMarkDone]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      {/* Editor Panel */}
      <div className="flex-1 flex flex-col gap-3">
        {/* Channel Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] text-sm font-bold font-[family-name:var(--font-code)] text-zinc-400">
              {channelIcons[template.channelType]}
            </span>
            <h3 className="text-zinc-100 font-medium text-lg">
              {template.channelName}
            </h3>
            {isDone && (
              <span className="text-[11px] bg-white/[0.06] text-zinc-400 px-2 py-0.5 rounded-full border border-white/[0.08]">
                Done
              </span>
            )}
          </div>
          <button
            onClick={() => setShowTips(!showTips)}
            aria-label={showTips ? 'Hide tips' : 'Show tips'}
            className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors lg:hidden"
          >
            {showTips ? 'Hide tips' : 'Show tips'}
          </button>
        </div>

        {/* Subject Field */}
        {template.subject !== undefined && (
          <div>
            <label className="block text-[11px] text-zinc-600 mb-1 uppercase tracking-wider">
              Subject / Title
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-zinc-100 font-[family-name:var(--font-code)] text-sm focus:outline-none focus:border-white/[0.2] focus:ring-1 focus:ring-white/[0.1] placeholder-zinc-700"
              placeholder="Subject line..."
            />
          </div>
        )}

        {/* Body Editor */}
        <div className="flex-1 flex flex-col">
          <label className="block text-[11px] text-zinc-600 mb-1 uppercase tracking-wider">
            Body
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            aria-describedby="outreach-char-count"
            className="flex-1 min-h-[280px] w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-zinc-100 font-[family-name:var(--font-code)] text-sm leading-relaxed focus:outline-none focus:border-white/[0.2] focus:ring-1 focus:ring-white/[0.1] placeholder-zinc-700 resize-none"
            placeholder="Write your outreach message..."
          />
        </div>

        {/* Footer Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              id="outreach-char-count"
              className={`text-xs font-[family-name:var(--font-code)] ${
                isOverLimit
                  ? 'text-red-400'
                  : template.characterLimit
                    ? 'text-zinc-600'
                    : 'text-zinc-700'
              }`}
            >
              {characterCount}
              {template.characterLimit
                ? ` / ${template.characterLimit}`
                : ' chars'}
            </span>
            {isOverLimit && (
              <span className="text-xs text-red-400">
                Over limit by {characterCount - template.characterLimit!}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetToTemplate}
              className="px-3 py-1.5 text-xs text-zinc-600 hover:text-zinc-400 border border-white/[0.06] hover:border-white/[0.12] rounded-lg transition-all"
            >
              Reset to template
            </button>
            <button
              onClick={copyToClipboard}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                copied
                  ? 'bg-white/[0.08] text-zinc-300 border border-white/[0.12]'
                  : 'bg-white text-black hover:bg-zinc-200 active:scale-[0.97]'
              }`}
            >
              {copied ? 'Copied!' : 'Copy to clipboard'}
            </button>
          </div>
        </div>
      </div>

      {/* Tips Sidebar */}
      {showTips && (
        <div className="lg:w-72 shrink-0">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
            <h4 className="text-[11px] font-medium text-zinc-500 mb-3 uppercase tracking-wider">
              Tips for {template.channelName}
            </h4>
            <ul className="space-y-2">
              {template.tips.map((tip, i) => {
                const isDo = tip.startsWith('DO:');
                const isDont = tip.startsWith("DON'T:");
                return (
                  <li
                    key={i}
                    className={`text-xs leading-relaxed ${
                      isDo
                        ? 'text-zinc-400'
                        : isDont
                          ? 'text-zinc-600'
                          : 'text-zinc-500'
                    }`}
                  >
                    {tip}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

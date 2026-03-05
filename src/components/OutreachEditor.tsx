'use client';

import { useState, useCallback } from 'react';
import type { OutreachTemplate } from '../types/outreach';

const channelColors: Record<OutreachTemplate['channelType'], string> = {
  reddit: 'from-orange-500/20 to-orange-600/10 border-orange-500/30',
  hackernews: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
  producthunt: 'from-red-500/20 to-red-600/10 border-red-500/30',
  twitter: 'from-sky-500/20 to-sky-600/10 border-sky-500/30',
  linkedin: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
  email: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
  community: 'from-violet-500/20 to-violet-600/10 border-violet-500/30',
};

const channelIcons: Record<OutreachTemplate['channelType'], string> = {
  reddit: 'R',
  hackernews: 'Y',
  producthunt: 'P',
  twitter: 'X',
  linkedin: 'in',
  email: '@',
  community: '#',
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
      // Fallback for older browsers
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

  const colorClass = channelColors[template.channelType];

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      {/* Editor Panel */}
      <div className="flex-1 flex flex-col gap-3">
        {/* Channel Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br ${colorClass} text-sm font-bold font-mono`}
            >
              {channelIcons[template.channelType]}
            </span>
            <h3 className="text-white/90 font-medium text-lg">
              {template.channelName}
            </h3>
            {isDone && (
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Done
              </span>
            )}
          </div>
          <button
            onClick={() => setShowTips(!showTips)}
            className="text-sm text-white/40 hover:text-white/70 transition-colors lg:hidden"
          >
            {showTips ? 'Hide tips' : 'Show tips'}
          </button>
        </div>

        {/* Subject Field */}
        {template.subject !== undefined && (
          <div>
            <label className="block text-xs text-white/40 mb-1 uppercase tracking-wider">
              Subject / Title
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/90 font-mono text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/10 placeholder-white/20 backdrop-blur-sm"
              placeholder="Subject line..."
            />
          </div>
        )}

        {/* Body Editor */}
        <div className="flex-1 flex flex-col">
          <label className="block text-xs text-white/40 mb-1 uppercase tracking-wider">
            Body
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="flex-1 min-h-[280px] w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white/90 font-mono text-sm leading-relaxed focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/10 placeholder-white/20 resize-none backdrop-blur-sm"
            placeholder="Write your outreach message..."
          />
        </div>

        {/* Footer Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Character Counter */}
            <span
              className={`text-xs font-mono ${
                isOverLimit
                  ? 'text-red-400'
                  : template.characterLimit
                    ? 'text-white/40'
                    : 'text-white/20'
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
              className="px-3 py-1.5 text-xs text-white/40 hover:text-white/70 border border-white/10 hover:border-white/20 rounded-lg transition-all backdrop-blur-sm"
            >
              Reset to template
            </button>
            <button
              onClick={copyToClipboard}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all backdrop-blur-sm ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-white/10 text-white/90 hover:bg-white/20 border border-white/10 hover:border-white/20'
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
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md">
            <h4 className="text-sm font-medium text-white/70 mb-3 uppercase tracking-wider">
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
                        ? 'text-emerald-400/80'
                        : isDont
                          ? 'text-red-400/70'
                          : 'text-white/50'
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

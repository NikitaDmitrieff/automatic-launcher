'use client';

import React, { useState, useCallback } from 'react';
import {
  type ExportData,
  exportToMarkdown,
  exportToJSON,
  copyToClipboard,
  downloadFile,
} from '@/lib/exporters';

type CopyState = 'idle' | 'copied';

interface ExportPanelProps {
  data: ExportData;
  planId?: string;
}

function ExportPanel({ data, planId }: ExportPanelProps) {
  const [markdownCopyState, setMarkdownCopyState] = useState<CopyState>('idle');
  const [linkCopyState, setLinkCopyState] = useState<CopyState>('idle');

  const handleCopyMarkdown = useCallback(async () => {
    const md = exportToMarkdown(data);
    await copyToClipboard(md);
    setMarkdownCopyState('copied');
    setTimeout(() => setMarkdownCopyState('idle'), 2000);
  }, [data]);

  const handleDownloadMarkdown = useCallback(() => {
    const md = exportToMarkdown(data);
    const filename = `${data.projectName.toLowerCase().replace(/\s+/g, '-')}-launch-plan.md`;
    downloadFile(md, filename, 'text/markdown');
  }, [data]);

  const handleDownloadJSON = useCallback(() => {
    const json = exportToJSON(data);
    const filename = `${data.projectName.toLowerCase().replace(/\s+/g, '-')}-launch-plan.json`;
    downloadFile(json, filename, 'application/json');
  }, [data]);

  const handleCopyLink = useCallback(async () => {
    const shareUrl = planId
      ? `${window.location.origin}/results?id=${planId}`
      : window.location.href;
    await copyToClipboard(shareUrl);
    setLinkCopyState('copied');
    setTimeout(() => setLinkCopyState('idle'), 2000);
  }, [planId]);

  const btnClass =
    'inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:bg-white/[0.08] hover:border-white/[0.12] active:scale-[0.97]';

  return (
    <div className="relative rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl">
      <h3 className="mb-4 text-sm font-bold text-zinc-100 uppercase tracking-wider">
        Export &amp; Share
      </h3>

      {/* Export buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleCopyMarkdown}
          aria-label="Copy launch plan as Markdown"
          className={btnClass}
        >
          {markdownCopyState === 'copied' ? (
            <>
              <CheckIcon />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <ClipboardIcon />
              <span>Copy as Markdown</span>
            </>
          )}
        </button>

        <button
          onClick={handleDownloadMarkdown}
          aria-label="Download launch plan as Markdown file"
          className={btnClass}
        >
          <DownloadIcon />
          <span>Download .md</span>
        </button>

        <button
          onClick={handleDownloadJSON}
          aria-label="Download launch plan as JSON file"
          className={btnClass}
        >
          <DownloadIcon />
          <span>Download .json</span>
        </button>
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-white/[0.06]" />

      {/* Share section */}
      <div>
        <p className="mb-2 text-xs text-zinc-600 uppercase tracking-wider">Share your launch plan</p>
        <button
          onClick={handleCopyLink}
          aria-label="Copy shareable link to clipboard"
          className={btnClass}
        >
          {linkCopyState === 'copied' ? (
            <>
              <CheckIcon />
              <span>Link copied!</span>
            </>
          ) : (
            <>
              <LinkIcon />
              <span>Copy link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default React.memo(ExportPanel);

/* ---------- Inline SVG icons ---------- */

function ClipboardIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="2" width="6" height="4" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-zinc-300"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

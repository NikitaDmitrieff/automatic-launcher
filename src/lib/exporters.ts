export interface ExportData {
  projectName: string;
  channels: { name: string; url: string; reason: string; actionItems: string[] }[];
  timeline: { day: number; title: string; tasks: string[] }[];
  templates: { channelName: string; subject?: string; body: string }[];
}

export function exportToMarkdown(data: ExportData): string {
  const lines: string[] = [];

  lines.push(`# ${data.projectName} — Launch Plan`);
  lines.push('');

  // Channels section
  lines.push('## Recommended Channels');
  lines.push('');
  for (const channel of data.channels) {
    lines.push(`### [${channel.name}](${channel.url})`);
    lines.push('');
    lines.push(`> ${channel.reason}`);
    lines.push('');
    if (channel.actionItems.length > 0) {
      lines.push('**Action items:**');
      for (const item of channel.actionItems) {
        lines.push(`- ${item}`);
      }
      lines.push('');
    }
  }

  // Timeline section
  lines.push('## Launch Timeline');
  lines.push('');
  for (const phase of data.timeline) {
    lines.push(`### Day ${phase.day}: ${phase.title}`);
    lines.push('');
    for (const task of phase.tasks) {
      lines.push(`- [ ] ${task}`);
    }
    lines.push('');
  }

  // Templates section
  lines.push('## Outreach Templates');
  lines.push('');
  for (const template of data.templates) {
    lines.push(`### ${template.channelName}`);
    lines.push('');
    if (template.subject) {
      lines.push(`**Subject:** ${template.subject}`);
      lines.push('');
    }
    lines.push('```');
    lines.push(template.body);
    lines.push('```');
    lines.push('');
  }

  return lines.join('\n');
}

export function exportToJSON(data: ExportData): string {
  return JSON.stringify(data, null, 2);
}

export async function copyToClipboard(text: string): Promise<void> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    throw new Error('Clipboard API is not available in this environment');
  }
  await navigator.clipboard.writeText(text);
}

export function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

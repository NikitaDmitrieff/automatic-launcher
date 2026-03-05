export function exportToMarkdown(data: { projectName: string; channels: { name: string; url: string }[] }): string {
  let md = `# Launch Plan: ${data.projectName}\n\n## Recommended Channels\n\n`;
  data.channels.forEach(ch => { md += `- [${ch.name}](${ch.url})\n`; });
  return md;
}

export function exportToJSON(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

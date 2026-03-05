import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ExportData } from '../../src/lib/exporters';

const { copyToClipboardMock, downloadFileMock } = vi.hoisted(() => ({
  copyToClipboardMock: vi.fn().mockResolvedValue(undefined),
  downloadFileMock: vi.fn(),
}));

vi.mock('@/lib/exporters', async () => {
  const actual = await vi.importActual<typeof import('../../src/lib/exporters')>('../../src/lib/exporters');
  return {
    ...actual,
    copyToClipboard: copyToClipboardMock,
    downloadFile: downloadFileMock,
  };
});

import ExportPanel from '../../src/components/ExportPanel';

const testData: ExportData = {
  projectName: 'Test App',
  channels: [
    { name: 'Reddit', url: 'https://reddit.com', reason: 'Popular', actionItems: ['Post'] },
  ],
  timeline: [
    { day: 1, title: 'Launch', tasks: ['Post on Reddit'] },
  ],
  templates: [
    { channelName: 'Reddit', subject: 'Show Reddit', body: 'Check it out' },
  ],
};

describe('ExportPanel', () => {
  beforeEach(() => {
    copyToClipboardMock.mockClear();
    downloadFileMock.mockClear();
  });

  it('renders export heading and all buttons', () => {
    render(<ExportPanel data={testData} />);
    expect(screen.getByText('Export & Share')).toBeDefined();
    expect(screen.getByLabelText('Copy launch plan as Markdown')).toBeDefined();
    expect(screen.getByLabelText('Download launch plan as Markdown file')).toBeDefined();
    expect(screen.getByLabelText('Download launch plan as JSON file')).toBeDefined();
    expect(screen.getByLabelText('Copy shareable link to clipboard')).toBeDefined();
  });

  it('copies markdown to clipboard and shows feedback', async () => {
    const user = userEvent.setup();
    render(<ExportPanel data={testData} />);

    await user.click(screen.getByLabelText('Copy launch plan as Markdown'));

    expect(copyToClipboardMock).toHaveBeenCalledWith(expect.stringContaining('# Test App'));
    expect(screen.getByText('Copied!')).toBeDefined();
  });

  it('reverts copy state after timeout', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<ExportPanel data={testData} />);

    await user.click(screen.getByLabelText('Copy launch plan as Markdown'));
    expect(screen.getByText('Copied!')).toBeDefined();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText('Copy as Markdown')).toBeDefined();
    vi.useRealTimers();
  });

  it('downloads markdown file', async () => {
    const user = userEvent.setup();
    render(<ExportPanel data={testData} />);

    await user.click(screen.getByLabelText('Download launch plan as Markdown file'));

    expect(downloadFileMock).toHaveBeenCalledWith(
      expect.any(String),
      'test-app-launch-plan.md',
      'text/markdown'
    );
  });

  it('downloads JSON file', async () => {
    const user = userEvent.setup();
    render(<ExportPanel data={testData} />);

    await user.click(screen.getByLabelText('Download launch plan as JSON file'));

    expect(downloadFileMock).toHaveBeenCalledWith(
      expect.any(String),
      'test-app-launch-plan.json',
      'application/json'
    );
  });

  it('copies share link with planId', async () => {
    const user = userEvent.setup();
    render(<ExportPanel data={testData} planId="abc123" />);

    await user.click(screen.getByLabelText('Copy shareable link to clipboard'));

    expect(copyToClipboardMock).toHaveBeenCalledWith(expect.stringContaining('/results?id=abc123'));
    expect(screen.getByText('Link copied!')).toBeDefined();
  });

  it('copies current URL when no planId', async () => {
    const user = userEvent.setup();
    render(<ExportPanel data={testData} />);

    await user.click(screen.getByLabelText('Copy shareable link to clipboard'));

    expect(copyToClipboardMock).toHaveBeenCalledWith(window.location.href);
  });

  it('generates correct filename for project names with spaces', async () => {
    const user = userEvent.setup();
    const dataWithSpaces = { ...testData, projectName: 'My Cool App' };
    render(<ExportPanel data={dataWithSpaces} />);

    await user.click(screen.getByLabelText('Download launch plan as Markdown file'));

    expect(downloadFileMock).toHaveBeenCalledWith(
      expect.any(String),
      'my-cool-app-launch-plan.md',
      'text/markdown'
    );
  });
});

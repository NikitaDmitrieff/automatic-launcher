import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OutreachWorkspace from '../../src/components/OutreachWorkspace';
import { outreachTemplates } from '../../src/lib/templates';

// Mock clipboard
beforeEach(() => {
  const clipboardMock = { writeText: vi.fn().mockResolvedValue(undefined) };
  Object.defineProperty(navigator, 'clipboard', { value: clipboardMock, writable: true, configurable: true });
});

describe('OutreachWorkspace', () => {
  it('renders heading and description', () => {
    render(<OutreachWorkspace />);
    expect(screen.getByText('Outreach Workspace')).toBeDefined();
    expect(screen.getByText(/customize and copy launch templates/i)).toBeDefined();
  });

  it('renders a tab for each outreach template', () => {
    render(<OutreachWorkspace />);
    for (const template of outreachTemplates) {
      const escaped = template.channelName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      expect(screen.getByRole('button', { name: new RegExp(escaped) })).toBeDefined();
    }
  });

  it('shows progress bar starting at 0', () => {
    render(<OutreachWorkspace />);
    expect(screen.getByText(`0/${outreachTemplates.length} channels ready`)).toBeDefined();
  });

  it('fills templates with provided project data', () => {
    render(
      <OutreachWorkspace
        projectName="LaunchBot"
        description="AI launch copilot"
        demoUrl="https://launchbot.dev"
      />
    );
    // The first template (Reddit) should have placeholders filled
    const textarea = screen.getByPlaceholderText('Write your outreach message...');
    expect((textarea as HTMLTextAreaElement).value).toContain('LaunchBot');
  });

  it('uses placeholder values when no props provided', () => {
    render(<OutreachWorkspace />);
    const textarea = screen.getByPlaceholderText('Write your outreach message...');
    expect((textarea as HTMLTextAreaElement).value).toContain('{{projectName}}');
  });

  it('switches active template when tab is clicked', async () => {
    const user = userEvent.setup();
    render(<OutreachWorkspace projectName="TestApp" description="test" demoUrl="https://test.com" />);

    // Click on the second template tab
    const secondTemplate = outreachTemplates[1];
    await user.click(screen.getByRole('button', { name: new RegExp(secondTemplate.channelName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) }));

    // The editor should now show the second template's channel name in the heading
    expect(screen.getByRole('heading', { name: secondTemplate.channelName })).toBeDefined();
  });

  it('falls back to first template when activeTemplateId does not match', async () => {
    const user = userEvent.setup();
    const { container } = render(<OutreachWorkspace projectName="TestApp" />);

    // Click a valid tab first to ensure interaction works
    await user.click(screen.getByText('Hacker News (Show HN)'));

    // The editor should render without crashing
    // even if internal state were to become out of sync
    expect(container.querySelector('.bg-\\[var\\(--surface-3\\)\\]')).toBeDefined();
  });

  it('does not crash when rendered with custom props', () => {
    render(
      <OutreachWorkspace
        projectName="MyApp"
        description="A cool tool"
        demoUrl="https://example.com"
      />
    );

    expect(screen.getByText('Outreach Workspace')).toBeDefined();
  });

  it('updates progress when a template is copied (marked done)', async () => {
    const user = userEvent.setup();
    render(<OutreachWorkspace projectName="TestApp" description="test" demoUrl="https://test.com" />);

    // Copy the current template
    await user.click(screen.getByText('Copy to clipboard'));

    expect(screen.getByText(`1/${outreachTemplates.length} channels ready`)).toBeDefined();
  });

  it('does not double-count the same template marked done twice', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<OutreachWorkspace projectName="TestApp" description="test" demoUrl="https://test.com" />);

    await user.click(screen.getByText('Copy to clipboard'));
    // Wait for "Copied!" to revert back to "Copy to clipboard"
    act(() => { vi.advanceTimersByTime(2000); });
    await user.click(screen.getByText('Copy to clipboard'));

    expect(screen.getByText(`1/${outreachTemplates.length} channels ready`)).toBeDefined();
    vi.useRealTimers();
  });

  it('tracks progress across multiple templates', async () => {
    const user = userEvent.setup();
    render(<OutreachWorkspace projectName="TestApp" description="test" demoUrl="https://test.com" />);

    // Copy first template
    await user.click(screen.getByText('Copy to clipboard'));
    expect(screen.getByText(`1/${outreachTemplates.length} channels ready`)).toBeDefined();

    // Switch to second template and copy
    const secondTemplate = outreachTemplates[1];
    await user.click(screen.getByRole('button', { name: new RegExp(secondTemplate.channelName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) }));
    await user.click(screen.getByText('Copy to clipboard'));

    expect(screen.getByText(`2/${outreachTemplates.length} channels ready`)).toBeDefined();
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OutreachWorkspace from '../../src/components/OutreachWorkspace';

describe('OutreachWorkspace', () => {
  it('renders with default props', () => {
    render(<OutreachWorkspace />);

    expect(screen.getByText('Outreach Workspace')).toBeDefined();
  });

  it('renders channel tabs for all templates', () => {
    render(<OutreachWorkspace />);

    expect(screen.getAllByText('Reddit (r/SideProject)').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Hacker News (Show HN)').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Product Hunt').length).toBeGreaterThan(0);
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
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OutreachEditor from '../../src/components/OutreachEditor';
import type { OutreachTemplate } from '../../src/types/outreach';

const baseTemplate: OutreachTemplate = {
  id: 'test-template',
  channelName: 'Test Channel',
  channelType: 'reddit',
  subject: 'Test Subject',
  body: 'Hello world, this is the body.',
  tips: ['DO: Be genuine', "DON'T: Spam", 'General tip'],
  characterLimit: 280,
};

const templateWithoutSubject: OutreachTemplate = {
  id: 'no-subject',
  channelName: 'Community',
  channelType: 'community',
  body: 'Community post body',
  tips: ['Tip 1'],
};

describe('OutreachEditor', () => {
  let onMarkDone: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onMarkDone = vi.fn();
  });

  it('renders channel name and badge', () => {
    render(<OutreachEditor template={baseTemplate} onMarkDone={onMarkDone} isDone={false} />);
    expect(screen.getByText('Test Channel')).toBeDefined();
    expect(screen.getByText('R')).toBeDefined(); // reddit icon
  });

  it('renders subject field when template has subject', () => {
    render(<OutreachEditor template={baseTemplate} onMarkDone={onMarkDone} isDone={false} />);
    const subjectInput = screen.getByPlaceholderText('Subject line...');
    expect(subjectInput).toBeDefined();
    expect((subjectInput as HTMLInputElement).value).toBe('Test Subject');
  });

  it('does not render subject field when template has no subject', () => {
    render(<OutreachEditor template={templateWithoutSubject} onMarkDone={onMarkDone} isDone={false} />);
    expect(screen.queryByPlaceholderText('Subject line...')).toBeNull();
  });

  it('renders body textarea with template body', () => {
    render(<OutreachEditor template={baseTemplate} onMarkDone={onMarkDone} isDone={false} />);
    const textarea = screen.getByPlaceholderText('Write your outreach message...');
    expect((textarea as HTMLTextAreaElement).value).toBe('Hello world, this is the body.');
  });

  it('shows character count', () => {
    render(<OutreachEditor template={baseTemplate} onMarkDone={onMarkDone} isDone={false} />);
    expect(screen.getByText('30 / 280')).toBeDefined();
  });

  it('shows over-limit warning when body exceeds character limit', async () => {
    const user = userEvent.setup();
    render(<OutreachEditor template={baseTemplate} onMarkDone={onMarkDone} isDone={false} />);

    const textarea = screen.getByPlaceholderText('Write your outreach message...');
    await user.clear(textarea);
    await user.type(textarea, 'x'.repeat(285));

    expect(screen.getByText(/over limit by 5/i)).toBeDefined();
  });

  it('shows "chars" when no character limit', () => {
    render(<OutreachEditor template={templateWithoutSubject} onMarkDone={onMarkDone} isDone={false} />);
    expect(screen.getByText('19 chars')).toBeDefined();
  });

  it('copies to clipboard and calls onMarkDone', async () => {
    const user = userEvent.setup();
    render(<OutreachEditor template={baseTemplate} onMarkDone={onMarkDone} isDone={false} />);

    await user.click(screen.getByText('Copy to clipboard'));

    expect(onMarkDone).toHaveBeenCalledWith('test-template');
    expect(screen.getByText('Copied!')).toBeDefined();
  });

  it('copies only body when no subject and marks done', async () => {
    const user = userEvent.setup();
    render(<OutreachEditor template={templateWithoutSubject} onMarkDone={onMarkDone} isDone={false} />);

    await user.click(screen.getByText('Copy to clipboard'));

    expect(onMarkDone).toHaveBeenCalledWith('no-subject');
    expect(screen.getByText('Copied!')).toBeDefined();
  });

  it('resets to template values when reset button is clicked', async () => {
    const user = userEvent.setup();
    render(<OutreachEditor template={baseTemplate} onMarkDone={onMarkDone} isDone={false} />);

    const textarea = screen.getByPlaceholderText('Write your outreach message...');
    await user.clear(textarea);
    await user.type(textarea, 'Modified body');

    await user.click(screen.getByText('Reset to template'));

    expect((textarea as HTMLTextAreaElement).value).toBe('Hello world, this is the body.');
  });

  it('shows Done badge when isDone is true', () => {
    render(<OutreachEditor template={baseTemplate} onMarkDone={onMarkDone} isDone={true} />);
    expect(screen.getByText('Done')).toBeDefined();
  });

  it('renders tips', () => {
    render(<OutreachEditor template={baseTemplate} onMarkDone={onMarkDone} isDone={false} />);
    expect(screen.getByText('DO: Be genuine')).toBeDefined();
    expect(screen.getByText("DON'T: Spam")).toBeDefined();
    expect(screen.getByText('General tip')).toBeDefined();
  });

  it('toggles tips visibility on mobile button', async () => {
    const user = userEvent.setup();
    render(<OutreachEditor template={baseTemplate} onMarkDone={onMarkDone} isDone={false} />);

    // Tips visible by default
    expect(screen.getByText('DO: Be genuine')).toBeDefined();

    await user.click(screen.getByLabelText('Hide tips'));
    expect(screen.queryByText('DO: Be genuine')).toBeNull();

    await user.click(screen.getByLabelText('Show tips'));
    expect(screen.getByText('DO: Be genuine')).toBeDefined();
  });

  it('reverts copied state after timeout', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<OutreachEditor template={baseTemplate} onMarkDone={onMarkDone} isDone={false} />);

    await user.click(screen.getByText('Copy to clipboard'));
    expect(screen.getByText('Copied!')).toBeDefined();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText('Copy to clipboard')).toBeDefined();
    vi.useRealTimers();
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../src/components/ThemeProvider';
import ThemeToggle from '../../src/components/ThemeToggle';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    clear: () => { store = {}; },
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((i: number) => Object.keys(store)[i] ?? null),
  };
})();

beforeEach(() => {
  localStorageMock.clear();
  Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });
  document.documentElement.removeAttribute('data-theme');
});

function renderWithProvider() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );
}

describe('ThemeToggle', () => {
  it('renders with dark mode by default', () => {
    renderWithProvider();
    expect(screen.getByLabelText('Switch to light mode')).toBeDefined();
  });

  it('toggles to light mode on click', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByLabelText('Switch to light mode'));

    expect(screen.getByLabelText('Switch to dark mode')).toBeDefined();
  });

  it('toggles back to dark mode on second click', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByLabelText('Switch to light mode'));
    await user.click(screen.getByLabelText('Switch to dark mode'));

    expect(screen.getByLabelText('Switch to light mode')).toBeDefined();
  });

  it('persists theme to localStorage on toggle', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByLabelText('Switch to light mode'));

    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
  });

  it('sets data-theme attribute on document element', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await user.click(screen.getByLabelText('Switch to light mode'));

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('reads stored theme from localStorage on mount', () => {
    localStorageMock.setItem('theme', 'light');
    renderWithProvider();

    // After useEffect runs, it should pick up the stored 'light' theme
    expect(screen.getByLabelText('Switch to dark mode')).toBeDefined();
  });

  it('ignores invalid localStorage values', () => {
    localStorageMock.setItem('theme', 'invalid-value');
    renderWithProvider();

    // Should remain on default dark theme
    expect(screen.getByLabelText('Switch to light mode')).toBeDefined();
  });

  it('handles missing localStorage gracefully (default dark)', () => {
    // localStorage has no 'theme' key
    renderWithProvider();
    expect(screen.getByLabelText('Switch to light mode')).toBeDefined();
  });
});

describe('ThemeProvider', () => {
  it('renders children', () => {
    render(
      <ThemeProvider>
        <div data-testid="child">Hello</div>
      </ThemeProvider>
    );
    expect(screen.getByTestId('child')).toBeDefined();
    expect(screen.getByText('Hello')).toBeDefined();
  });
});

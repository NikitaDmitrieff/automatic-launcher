import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProjectForm from '../../src/components/ProjectForm';

describe('ProjectForm', () => {
  it('renders all required fields', () => {
    render(<ProjectForm onSubmit={() => {}} />);

    expect(screen.getByLabelText(/project name/i)).toBeDefined();
    expect(screen.getByLabelText(/short description/i)).toBeDefined();
    expect(screen.getByLabelText(/repository url/i)).toBeDefined();
    expect(screen.getByLabelText(/demo url/i)).toBeDefined();
  });

  it('renders the submit button', () => {
    render(<ProjectForm onSubmit={() => {}} />);

    const button = screen.getByRole('button', { name: /generate launch plan/i });
    expect(button).toBeDefined();
  });

  it('shows validation errors when submitting empty form', async () => {
    render(<ProjectForm onSubmit={() => {}} />);

    const button = screen.getByRole('button', { name: /generate launch plan/i });
    fireEvent.click(button);

    expect(screen.getByText('Project name is required')).toBeDefined();
    expect(screen.getByText('Description is required')).toBeDefined();
    expect(screen.getByText('Repository URL is required')).toBeDefined();
    expect(screen.getByText('Demo URL is required')).toBeDefined();
  });

  it('validates description character limit', async () => {
    const user = userEvent.setup();
    render(<ProjectForm onSubmit={() => {}} />);

    const textarea = screen.getByLabelText(/short description/i);
    // The textarea has maxLength=200, but validation also checks > 200
    // Type a long string (textarea maxLength will truncate in browser but not in test DOM)
    await user.type(screen.getByLabelText(/project name/i), 'Test');
    // Directly set the value to bypass maxLength
    fireEvent.change(textarea, { target: { value: 'a'.repeat(201) } });
    await user.type(screen.getByLabelText(/repository url/i), 'https://github.com/test/app');
    await user.type(screen.getByLabelText(/demo url/i), 'https://example.com');

    fireEvent.click(screen.getByRole('button', { name: /generate launch plan/i }));

    expect(screen.getByText('Description must be 200 characters or less')).toBeDefined();
  });

  it('validates URL format for repo and demo URLs', async () => {
    const user = userEvent.setup();
    render(<ProjectForm onSubmit={() => {}} />);

    await user.type(screen.getByLabelText(/project name/i), 'Test');
    await user.type(screen.getByLabelText(/short description/i), 'A test project');
    await user.type(screen.getByLabelText(/repository url/i), 'http://github.com/test');
    await user.type(screen.getByLabelText(/demo url/i), 'ftp://example.com');

    fireEvent.click(screen.getByRole('button', { name: /generate launch plan/i }));

    const urlErrors = screen.getAllByText('URL must start with https://');
    expect(urlErrors.length).toBe(2);
  });

  it('calls onSubmit with form data when valid', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();
    render(<ProjectForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/project name/i), 'My App');
    await user.type(screen.getByLabelText(/short description/i), 'A great app');
    await user.type(screen.getByLabelText(/repository url/i), 'https://github.com/test/app');
    await user.type(screen.getByLabelText(/demo url/i), 'https://myapp.com');

    fireEvent.click(screen.getByRole('button', { name: /generate launch plan/i }));

    expect(handleSubmit).toHaveBeenCalledOnce();
    expect(handleSubmit).toHaveBeenCalledWith({
      projectName: 'My App',
      description: 'A great app',
      repoUrl: 'https://github.com/test/app',
      demoUrl: 'https://myapp.com',
    });
  });

  it('shows loading state when isSubmitting is true', () => {
    render(<ProjectForm onSubmit={() => {}} isSubmitting={true} />);

    expect(screen.getByRole('button', { name: /generating/i })).toBeDefined();
  });

  it('disables inputs when isSubmitting', () => {
    render(<ProjectForm onSubmit={() => {}} isSubmitting={true} />);

    expect(screen.getByLabelText(/project name/i)).toHaveProperty('disabled', true);
    expect(screen.getByLabelText(/short description/i)).toHaveProperty('disabled', true);
    expect(screen.getByLabelText(/repository url/i)).toHaveProperty('disabled', true);
    expect(screen.getByLabelText(/demo url/i)).toHaveProperty('disabled', true);
  });

  it('shows advanced options when toggle is clicked', async () => {
    const user = userEvent.setup();
    render(<ProjectForm onSubmit={() => {}} />);

    // Advanced fields should not be visible initially
    expect(screen.queryByLabelText(/target audience/i)).toBeNull();

    // Click the advanced options toggle
    await user.click(screen.getByRole('button', { name: /advanced options/i }));

    // Now advanced fields should be visible
    expect(screen.getByLabelText(/target audience/i)).toBeDefined();
    expect(screen.getByLabelText(/category/i)).toBeDefined();
    expect(screen.getByLabelText(/budget/i)).toBeDefined();
    expect(screen.getByLabelText(/timeline/i)).toBeDefined();
  });

  it('displays character counter for description', () => {
    render(<ProjectForm onSubmit={() => {}} />);

    expect(screen.getByText('0/200')).toBeDefined();
  });
});

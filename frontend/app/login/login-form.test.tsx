import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from './login-form';
import { useLogin } from '@/hooks';

jest.mock('@/hooks', () => ({
  useLogin: jest.fn(),
}));

describe('LoginForm', () => {
  const mockSubmit = jest.fn();
  const mockChange = jest.fn();

  beforeEach(() => {
    (useLogin as jest.Mock).mockReturnValue({
      email: 'test@example.com',
      password: 'secret',
      isLoading: false,
      onChange: mockChange,
      onSubmit: mockSubmit,
    });
  });

  it('renders email and password fields', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it('handles input change and form submission', () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText(/login/i));

    expect(mockChange).toHaveBeenCalled();
    expect(mockSubmit).toHaveBeenCalled();
  });
});

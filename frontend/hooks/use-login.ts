import { useState, ChangeEvent, FormEvent } from 'react';

import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { useLoginMutation } from '@/redux/features/authApiSlice';
import { setAuthenticated } from '@/redux/features/authSlice';
import { useAppDispatch } from '@/redux/hooks';

export default function useLogin() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    try {
      const result = await login(formData).unwrap(); // Calls /jwt/create/

      const { access, refresh } = result;

      if (access && refresh) {
        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);
        dispatch(setAuthenticated()); // optional: update Redux state

        router.push('/dashboard');

        // Optional backup redirect
        setTimeout(() => {
          if (window.location.pathname !== '/dashboard') {
            window.location.href = '/dashboard';
          }
        }, 1000);
      } else {
        toast.error('Login response missing tokens.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.data?.detail) {
        toast.error(`Login failed: ${error.data.detail}`);
      } else if (error.status === 401) {
        toast.error(
          'Invalid credentials. Please check your email and password.',
        );
      } else {
        toast.error('Failed to login. Please try again later.');
      }
    }
  };

  return {
    email,
    password,
    isLoading,
    onChange,
    onSubmit,
  };
}

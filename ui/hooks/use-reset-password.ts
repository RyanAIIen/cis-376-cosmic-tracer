import { useState, ChangeEvent, FormEvent } from 'react';

import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { useResetPasswordMutation } from '@/redux/features/authApiSlice';
import { useAppDispatch } from '@/redux/hooks';

export default function useResetPassword() {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const [email, setEmail] = useState('');

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetPassword(email)
      .unwrap()
      .then(() => {
        toast.success('Request sent. Check your email for a reset link.');
      })
      .catch((error) => {
        console.error(error.data);
        toast.error('Failed to send request.');
      });
  };

  return {
    email,
    isLoading,
    onChange,
    onSubmit,
  };
}

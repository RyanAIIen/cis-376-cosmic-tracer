import { useState, ChangeEvent, FormEvent } from 'react';

import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { useResetPasswordConfirmMutation } from '@/redux/features/authApiSlice';

export default function useRegister(uid: string, token: string) {
  const router = useRouter();

  const [resetPasswordConfirm, { isLoading }] =
    useResetPasswordConfirmMutation();

  const [formData, setFormData] = useState({
    new_password: '',
    re_new_password: '',
  });

  const { new_password, re_new_password } = formData;

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetPasswordConfirm({ uid, token, new_password, re_new_password })
      .unwrap()
      .then(() => {
        toast.info('Password reset successful. Please log in.');
        router.push('/login');
      })
      .catch((error) => {
        console.error(error.data);
        toast.error('Failed to reset password.');
      });
  };

  return {
    new_password,
    re_new_password,
    isLoading,
    onChange,
    onSubmit,
  };
}

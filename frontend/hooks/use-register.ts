import { useState, ChangeEvent, FormEvent } from 'react';

import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { useRegisterMutation } from '@/redux/features/authApiSlice';

export default function useRegister() {
  const router = useRouter();

  const [register, { isLoading }] = useRegisterMutation();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    re_password: '',
  });

  const { first_name, last_name, email, password, re_password } = formData;

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    register(formData)
      .unwrap()
      .then(() => {
        toast.info(
          'Account created. Please check your email to verify the account.',
        );
        router.push('/login');
      })
      .catch((error) => {
        console.error(error.data);
        toast.error('Failed to create account.');
      });
  };

  return {
    first_name,
    last_name,
    email,
    password,
    re_password,
    isLoading,
    onChange,
    onSubmit,
  };
}

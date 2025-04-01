'use client';

import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import KeyIcon from '@mui/icons-material/Key';
import InputAdornment from '@mui/material/InputAdornment';

import { useLogin } from '@/hooks';
import Form from '@/app/components/forms/form';

export default function LoginForm() {
  const { email, password, isLoading, onChange, onSubmit } = useLogin();

  const inputs = [
    {
      label: 'Email',
      name: 'email',
      type: 'email',
      value: email,
      required: true,
      InputProps: {
        startAdornment: (
          <InputAdornment position='start'>
            <AlternateEmailIcon />
          </InputAdornment>
        ),
      },
    },
    {
      label: 'Password',
      name: 'password',
      type: 'password',
      value: password,
      required: true,
      InputProps: {
        startAdornment: (
          <InputAdornment position='start'>
            <KeyIcon />
          </InputAdornment>
        ),
      },
    },
  ];

  return (
    <Form
      header='Log in.'
      inputs={inputs}
      isLoading={isLoading}
      submitText='Login'
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
}

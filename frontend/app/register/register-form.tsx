'use client';

import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import KeyIcon from '@mui/icons-material/Key';
import InputAdornment from '@mui/material/InputAdornment';

import { useRegister } from '@/hooks';
import Form from '@/app/components/forms/form';

export default function RegisterForm() {
  const {
    first_name,
    last_name,
    email,
    password,
    re_password,
    isLoading,
    onChange,
    onSubmit,
  } = useRegister();

  const inputs = [
    {
      label: 'First Name',
      name: 'first_name',
      value: first_name,
    },
    {
      label: 'Last Name',
      name: 'last_name',
      value: last_name,
    },
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
    {
      label: 'Confirm Password',
      name: 're_password',
      type: 'password',
      value: re_password,
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
      header='Create an account'
      inputs={inputs}
      isLoading={isLoading}
      submitText='Register'
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
}

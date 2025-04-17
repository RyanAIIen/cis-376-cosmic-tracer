'use client';

import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import InputAdornment from '@mui/material/InputAdornment';

import { useResetPassword } from '@/hooks';
import Form from '@/app/components/forms/form';

export default function ResetPasswordForm() {
  const { email, isLoading, onChange, onSubmit } = useResetPassword();

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
  ];

  return (
    <Form
      header='Reset your password'
      inputs={inputs}
      isLoading={isLoading}
      submitText='Reset'
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
}

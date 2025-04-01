'use client';

import KeyIcon from '@mui/icons-material/Key';
import InputAdornment from '@mui/material/InputAdornment';

import { useResetPasswordConfirm } from '@/hooks';
import Form from '@/app/components/forms/form';

interface PasswordResetConfirmFormProps {
  uid: string;
  token: string;
}

export default function PasswordResetConfirmForm({
  uid,
  token,
}: PasswordResetConfirmFormProps) {
  const { new_password, re_new_password, isLoading, onChange, onSubmit } =
    useResetPasswordConfirm(uid, token);

  const inputs = [
    {
      label: 'New Password',
      name: 'new_password',
      type: 'password',
      value: new_password,
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
      label: 'Confirm New Password',
      name: 're_new_password',
      type: 'password',
      value: re_new_password,
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
      header='Choose a new password.'
      inputs={inputs}
      isLoading={isLoading}
      submitText='Set new password'
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
}

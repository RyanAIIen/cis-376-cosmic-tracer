'use client';

import { useEffect } from 'react';

import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { useActivationMutation } from '@/redux/features/authApiSlice';

interface PageProps {
  params: {
    uid: string;
    token: string;
  };
}

export default function Page({ params }: PageProps) {
  const router = useRouter();

  const [activation] = useActivationMutation();

  useEffect(() => {
    const { uid, token } = params;
    activation({ uid, token })
      .unwrap()
      .then(() => {
        toast.success('Account activated. You can now log in.');
      })
      .catch((error) => {
        console.error(error.data);
        toast.error('Failed to activate account.');
      })
      .finally(() => {
        router.push('/login');
      });
  });

  return <Typography variant='h2'>Activating your account...</Typography>;
}

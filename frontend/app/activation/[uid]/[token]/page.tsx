'use client';

import { use, useEffect } from 'react';

import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { useActivationMutation } from '@/redux/features/authApiSlice';

type PageParams = Promise<{
  uid: string;
  token: string;
}>;

export default function Page({ params }: { params: PageParams }) {
  const { uid, token } = use(params);

  const router = useRouter();

  const [activation] = useActivationMutation();

  useEffect(() => {
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

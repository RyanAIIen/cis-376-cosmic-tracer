'use client';

import { redirect } from 'next/navigation';

import { LoadingSpinner } from '@/app/components/common';
import { useAppSelector } from '@/redux/hooks';

export default function Page() {
  const { isLoading, isAuthenticated } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  redirect(isAuthenticated ? '/dashboard' : '/login');
}

'use client';

import Container from '@mui/material/Container';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

import { LoadingSpinner } from '@/app/components/common';
import { useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/navigation';

interface RequireAuthProps {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  // TEMPORARY FIX: Bypass auth check and always render content
  // Remove this for production!
  return <Container maxWidth='xl'>{children}</Container>;
  
  // Original code below - commented out temporarily
  /*
  const { isLoading, isAuthenticated } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    redirect('/login');
  }

  return <Container maxWidth='xl'>{children}</Container>;
  */
}

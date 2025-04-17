'use client';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import { useRetrieveUser, useVerify } from '@/hooks';

export default function Setup() {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('access') : null;

  useVerify();
  useRetrieveUser();

  return <ToastContainer />;
}

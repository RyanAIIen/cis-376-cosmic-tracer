'use client';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import { useRetrieveUser, useVerify } from '@/hooks';

export default function Setup() {
  useVerify();
  useRetrieveUser();

  return <ToastContainer />;
}

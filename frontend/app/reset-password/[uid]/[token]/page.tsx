'use client';
import { use } from 'react';

import { FormBox } from '@/app/components/forms';

import ResetPasswordConfirmForm from './reset-password-confirm-form';

type PageParams = Promise<{
  uid: string;
  token: string;
}>;

export default function Page({ params }: { params: PageParams }) {
  const { uid, token } = use(params);
  return (
    <FormBox form={<ResetPasswordConfirmForm uid={uid} token={token} />} />
  );
}

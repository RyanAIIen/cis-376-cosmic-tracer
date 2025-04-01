'use client';

import { FormBox } from '@/app/components/forms';
import ResetPasswordConfirmForm from './reset-password-confirm-form';

interface PageProps {
  params: {
    uid: string;
    token: string;
  };
}

export default function Page({ params: { uid, token } }: PageProps) {
  return (
    <FormBox form={<ResetPasswordConfirmForm uid={uid} token={token} />} />
  );
}

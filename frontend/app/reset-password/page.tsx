import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';

import { FormBox } from '@/app/components/forms';
import ResetPasswordForm from './reset-password-form';

export const metadata: Metadata = {
  title: 'Cosmic Tracer | Reset Password',
};

export default function Page() {
  return (
    <FormBox form={<ResetPasswordForm />}>
      <Typography variant='body2' color='text.secondary' align='center'>
        Don&apos;t worry. Everything is going to be ok!
      </Typography>
    </FormBox>
  );
}

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import type { Metadata } from 'next';

import { FormBox } from '@/app/components/forms';
import RegisterForm from './register-form';

export const metadata: Metadata = {
  title: 'Cosmic Tracer | Register',
};

export default function Page() {
  return (
    <FormBox form={<RegisterForm />}>
      <Box display='flex' flexDirection='row' justifyContent='space-evenly'>
        <Link href='/login'>
          <Typography variant='body2'>I Already Have an Account</Typography>
        </Link>
      </Box>
    </FormBox>
  );
}

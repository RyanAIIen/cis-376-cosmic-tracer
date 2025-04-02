'use client';

import GoogleIcon from '@mui/icons-material/Google';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import { FormBox } from '@/app/components/forms';
import LoginForm from './login-form';

export default function Page() {
  const continueWithGoogle = async () => {};

  return (
    <FormBox form={<LoginForm />}>
      <>
        <Box display='flex' flexDirection='row' justifyContent='space-evenly'>
          <Link href='/register'>
            <Typography variant='body2'>Create an Account</Typography>
          </Link>

          <Link href='/reset-password'>
            <Typography variant='body2'>Forgot Password?</Typography>
          </Link>
        </Box>

        {/* <Divider>or</Divider> */}

        {/* <Button
          onClick={continueWithGoogle}
          startIcon={<GoogleIcon />}
          color='error'
        >
          Authenticate with Google
        </Button> */}
      </>
    </FormBox>
  );
}

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
  // const continueWithGoogle = async () => {
  //   try {
  //     const redirectUri = `${window.location.origin}/auth/google`;

  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_HOST}/o/google-oauth2/?redirect_uri=${encodeURIComponent(redirectUri)}`,
  //       {
  //         method: 'GET',
  //         headers: {
  //           Accept: 'application/json',
  //         },
  //       },
  //     );

  //     const data = await res.json();
  //     const { authorization_url } = data;

  //     const stateFromUrl = new URL(authorization_url).searchParams.get('state');
  //     if (stateFromUrl) {
  //       localStorage.setItem('oauth_state', stateFromUrl);
  //     }

  //     if (authorization_url) {
  //       window.location.href = authorization_url;
  //     } else {
  //       throw new Error('Missing authorization_url in response');
  //     }
  //   } catch (err) {
  //     console.error('OAuth redirect failed:', err);
  //   }
  // };

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

        {/* TODO: Add Google auth when feasible */}
        {/* <Button
          onClick={continueWithGoogle}
          startIcon={<GoogleIcon />}
          color='error'
        >
          Sign in with Google
        </Button> */}
      </>
    </FormBox>
  );
}

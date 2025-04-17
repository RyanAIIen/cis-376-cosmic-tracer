'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

import { useSocialAuthenticateMutation } from '@/redux/features/authApiSlice';
import { useAppDispatch } from '@/redux/hooks';
import { setAuthenticated, setUser } from '@/redux/features/authSlice';

export default function OAuthCallback() {
  const params = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [socialAuth] = useSocialAuthenticateMutation();

  useEffect(() => {
    const code = params.get('code');
    const state = params.get('state');

    console.log('OAuth callback received');
    console.log('code:', code);
    console.log('state:', state);

    if (!code || !state) {
      toast.error('Missing OAuth code or state.');
      router.push('/login');
      return;
    }

    socialAuth({
      provider: 'google-oauth2',
      code,
      state,
    })
      .unwrap()
      .then((response) => {
        const { access, refresh, user } = response;

        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);
        dispatch(setAuthenticated());
        dispatch(setUser(user));

        toast.success('Logged in with Google!');
        router.push('/dashboard');
      })
      .catch((err) => {
        console.error('OAuth login failed:', err);
        toast.error('OAuth login failed. Please try again.');
        router.push('/login');
      });
  }, [params, router, dispatch, socialAuth]);

  return <p>Logging you in with Google...</p>;
}

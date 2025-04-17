import { useEffect } from 'react';

import { useAppDispatch } from '@/redux/hooks';
import { useVerifyMutation } from '@/redux/features/authApiSlice';
import {
  setAuthenticated,
  finishInitialLoad,
  logout,
} from '@/redux/features/authSlice';

export default function useVerify() {
  const dispatch = useAppDispatch();
  const [verify] = useVerifyMutation();

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      dispatch(logout());
      dispatch(finishInitialLoad());
      return;
    }

    console.log('Verifying token:', token);

    verify(token)
      .unwrap()
      .then(() => {
        dispatch(setAuthenticated());
      })
      .catch(() => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        dispatch(logout());
      })
      .finally(() => {
        dispatch(finishInitialLoad());
      });
  }, [dispatch, verify]);
}

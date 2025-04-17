import { useEffect } from 'react';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setUser } from '@/redux/features/authSlice';

export default function useRetrieveUser() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const { data, isSuccess } = useRetrieveUserQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (!isSuccess || !data) return;

    const user = {
      ...data,
      display_name:
        [data.first_name, data.last_name].filter(Boolean).join(' ').trim() ||
        data.email,
    };

    dispatch(setUser(user));
  }, [isSuccess, data, dispatch]);
}

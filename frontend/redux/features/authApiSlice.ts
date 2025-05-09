import { apiSlice } from '@/redux/services/apiSlice';

import { User } from '@/redux/features/types';

interface SocialAuthArgs {
  provider: string;
  code: string;
  state?: string;
}

interface CreateUserResponse {
  access: string;
  refresh: string;
  user: User;
}

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    retrieveUser: builder.query<User, void>({
      query: () => '/users/me/',
    }),

    socialAuthenticate: builder.mutation<CreateUserResponse, SocialAuthArgs>({
      query: ({ provider, code, state }) => {
        const queryParams = new URLSearchParams({ code });
        if (state) queryParams.append('state', state);

        return {
          url: `/o/${provider}/?${queryParams.toString()}`,
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        };
      },
    }),

    login: builder.mutation({
      query: ({ email, password }) => ({
        url: '/jwt/create/',
        method: 'POST',
        body: { email, password },
      }),
    }),

    register: builder.mutation({
      query: ({ first_name, last_name, email, password, re_password }) => ({
        url: '/users/',
        method: 'POST',
        body: { first_name, last_name, email, password, re_password },
      }),
    }),

    verify: builder.mutation({
      query: (token: string) => ({
        url: '/jwt/verify/',
        method: 'POST',
        body: { token },
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: '/logout/',
        method: 'POST',
      }),
    }),

    activation: builder.mutation({
      query: ({ uid, token }) => ({
        url: '/users/activation/',
        method: 'POST',
        body: { uid, token },
      }),
    }),

    resetPassword: builder.mutation({
      query: (email) => ({
        url: '/users/reset_password/',
        method: 'POST',
        body: { email },
      }),
    }),

    resetPasswordConfirm: builder.mutation({
      query: ({ uid, token, new_password, re_new_password }) => ({
        url: '/users/reset_password_confirm/',
        method: 'POST',
        body: { uid, token, new_password, re_new_password },
      }),
    }),
  }),
});

export const {
  useRetrieveUserQuery,
  useSocialAuthenticateMutation,
  useLoginMutation,
  useRegisterMutation,
  useVerifyMutation,
  useLogoutMutation,
  useActivationMutation,
  useResetPasswordMutation,
  useResetPasswordConfirmMutation,
} = authApiSlice;

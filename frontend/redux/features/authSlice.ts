import { createSlice } from '@reduxjs/toolkit';

import { User } from '@/redux/features/types';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: User;
}

const initialState = {
  isAuthenticated: false,
  isLoading: true,
} as AuthState;

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state) => {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
    },
    finishInitialLoad: (state) => {
      state.isLoading = false;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setAuth, logout, finishInitialLoad, setUser } =
  authSlice.actions;
export default authSlice.reducer;

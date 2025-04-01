'use client';

import { Provider } from 'react-redux';

import { makeStore } from './store';

interface ProviderProps {
  children: React.ReactNode;
}

export default function ReduxProvider({ children }: ProviderProps) {
  return <Provider store={makeStore()}>{children}</Provider>;
}

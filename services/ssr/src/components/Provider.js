'use client';

import { makeClientSideStore } from '@/redux/client-side-store';
import { useRef } from 'react';
import { Provider as ReactReduxProvider } from 'react-redux';

function Provider({ storeState, children }) {
  const store = useRef(makeClientSideStore(storeState));

  return (
    <ReactReduxProvider store={store.current}>{children}</ReactReduxProvider>
  );
}

export default Provider;

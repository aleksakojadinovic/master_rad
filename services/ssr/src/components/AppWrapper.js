import { wrapper } from '@/redux/store';
import React from 'react';

function AppWrapper({ Component, pageProps }) {
  wrapper.useHydration(pageProps);

  return <Component {...pageProps} />;
}

export default AppWrapper;

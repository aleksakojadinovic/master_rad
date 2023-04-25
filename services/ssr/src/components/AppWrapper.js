import React from 'react';

import { wrapper } from 'redux/store';

function AppWrapper({ Component, pageProps }) {
  wrapper.useHydration(pageProps);

  return <Component {...pageProps} />;
}

export default AppWrapper;

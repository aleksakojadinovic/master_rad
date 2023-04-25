import { wrapper } from '@/redux/store';
import React, { Fragment } from 'react';
import NavigationBar from './Navigation/NavigationBar';

function AppWrapper({ Component, pageProps }) {
  wrapper.useHydration(pageProps);

  return (
    <Fragment>
      <NavigationBar />
      <Component {...pageProps} />
    </Fragment>
  );
}

export default AppWrapper;

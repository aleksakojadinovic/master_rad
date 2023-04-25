import { wrapper } from '@/redux/store';
import React, { Fragment } from 'react';
import NavigationBar from './Navigation/NavigationBar';
import { Box } from '@mui/material';

function AppWrapper({ Component, pageProps }) {
  wrapper.useHydration(pageProps);

  return (
    <Fragment>
      <NavigationBar />
      <Box sx={{ marginTop: '12px' }}>
        <Component {...pageProps} />
      </Box>
    </Fragment>
  );
}

export default AppWrapper;

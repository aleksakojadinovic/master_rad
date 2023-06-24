import { wrapper } from '@/redux/store';
import React, { Fragment } from 'react';
import NavigationBar from './Navigation/NavigationBar';
import { Box } from '@mui/material';
import Footer from './Footer/Footer';

function AppWrapper({ Component, pageProps }) {
  wrapper.useHydration(pageProps);

  return (
    <Fragment>
      <NavigationBar />
      <Box sx={{ marginTop: '24px', minHeight: '800px' }}>
        <Component {...pageProps} />
      </Box>
      <Footer />
    </Fragment>
  );
}

export default AppWrapper;

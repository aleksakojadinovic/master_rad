import { wrapper } from '@/redux/store';
import React, { Fragment } from 'react';
import NavigationBar from './Navigation/NavigationBar';
import { Box } from '@mui/material';
import Footer from './Footer/Footer';

function AppWrapper({ Component, pageProps }) {
  wrapper.useHydration(pageProps);
  const PageLayoutComponent = Component.Layout || (({ children }) => children);

  return (
    <Fragment>
      <NavigationBar />
      <Box sx={{ marginTop: '24px', minHeight: '800px' }}>
        <PageLayoutComponent {...pageProps}>
          <Component {...pageProps} />
        </PageLayoutComponent>
      </Box>
      <Box sx={{ marginTop: '36px' }}>
        <Footer />
      </Box>
    </Fragment>
  );
}

export default AppWrapper;

import { wrapper } from '@/redux/store';
import React from 'react';
import NavigationBar from './Navigation/NavigationBar';
import { Box } from '@mui/material';
import Footer from './Footer/Footer';
import { FirebaseWrapper } from '@/context/FirebaseWrapper';

function AppWrapper({ Component, pageProps }) {
  wrapper.useHydration(pageProps);
  const PageLayoutComponent = Component.Layout || (({ children }) => children);

  return (
    <FirebaseWrapper>
      <NavigationBar />
      <Box sx={{ marginTop: '24px', minHeight: '800px' }}>
        <PageLayoutComponent {...pageProps}>
          <Component {...pageProps} />
        </PageLayoutComponent>
      </Box>
      <Box sx={{ marginTop: '36px' }}>
        <Footer />
      </Box>
    </FirebaseWrapper>
  );
}

export default AppWrapper;

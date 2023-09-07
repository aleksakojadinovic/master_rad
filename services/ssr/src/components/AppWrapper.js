import React from 'react';
import NavigationBar from '../features/navigation/NavigationBar';
import { Box } from '@mui/material';
import Footer from './Footer/Footer';
import { FirebaseProvider } from '@/features/firebase/FirebaseProvider';
import { wrapper } from '@/redux/store';

function AppWrapper({ Component, pageProps }) {
  wrapper.useHydration(pageProps);
  const PageLayoutComponent = Component.Layout || (({ children }) => children);

  return (
    <FirebaseProvider>
      <NavigationBar />
      <Box marginTop="24px" minHeight="800px">
        <PageLayoutComponent {...pageProps}>
          <Component {...pageProps} />
        </PageLayoutComponent>
      </Box>
      <Box marginTop="36px">
        <Footer />
      </Box>
    </FirebaseProvider>
  );
}

export default AppWrapper;

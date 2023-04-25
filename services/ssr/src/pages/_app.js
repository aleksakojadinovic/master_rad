import { authSlice } from '@/api/auth';
import AppWrapper from '@/components/AppWrapper';
import PageContainer from '@/components/PageContainer/PageContainer';
import { wrapper } from '@/redux/store';
import App from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';

function MyApp({ Component, pageProps }) {
  const store = wrapper.useStore();

  return (
    <Provider store={store}>
      <PageContainer>
        <AppWrapper Component={Component} pageProps={pageProps} />
      </PageContainer>
    </Provider>
  );
}

MyApp.getInitialProps = wrapper.getInitialAppProps(
  (store) => async (context) => {
    store.dispatch(authSlice.endpoints.getMe.initiate());

    await Promise.all(store.dispatch(authSlice.util.getRunningQueriesThunk()));

    const appProps = await App.getInitialProps(context);
    return { ...appProps };
  },
);

export default MyApp;

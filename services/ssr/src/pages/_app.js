import AppWrapper from '@/components/AppWrapper';
import { wrapper } from '@/redux/store';
import App from 'next/app';
import React from 'react';
import { Provider } from 'react-redux';

function MyApp({ Component, pageProps }) {
  const store = wrapper.useStore();

  return (
    <Provider store={store}>
      <AppWrapper Component={Component} pageProps={pageProps} />
    </Provider>
  );
}

MyApp.getInitialProps = wrapper.getInitialAppProps(() => async (context) => {
  const appProps = await App.getInitialProps(context);
  return { ...appProps };
});

export default MyApp;

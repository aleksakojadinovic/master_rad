import { authSlice } from '@/api/auth';
import AppWrapper from '@/components/AppWrapper';
import PageContainer from '@/components/PageContainer/PageContainer';
import { wrapper } from '@/redux/store';
import App from 'next/app';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import English from '../../content/compiled-locales/en.json';

function MyApp({ Component, pageProps }) {
  const store = wrapper.useStore();
  const { locale } = useRouter();
  const [shortLocale] = locale ? locale.split('-') : ['en'];

  const messages = useMemo(() => {
    switch (shortLocale) {
      case 'en':
        return English;
    }
  }, [shortLocale]);

  return (
    <IntlProvider messages={messages} locale={shortLocale}>
      <Provider store={store}>
        <PageContainer>
          <AppWrapper Component={Component} pageProps={pageProps} />
        </PageContainer>
      </Provider>
    </IntlProvider>
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

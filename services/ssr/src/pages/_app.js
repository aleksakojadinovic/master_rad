import { authSlice } from '@/api/auth';
import AppWrapper from '@/components/AppWrapper';
import PageContainer from '@/components/PageContainer/PageContainer';
import { wrapper } from '@/redux/store';
import App from 'next/app';
import React, { useMemo } from 'react';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import English from '../../content/compiled-locales/en.json';
import Serbian from '../../content/compiled-locales/sr.json';
import { isServer } from '@/utils';
import Cookies from 'js-cookie';
import { LanguageProvider } from '@/context/LanguageContext';
import api from '@/services/api';

function MyApp({ Component, pageProps, languageCode }) {
  const store = wrapper.useStore();

  const messages = useMemo(() => {
    switch (languageCode) {
      case 'en':
        return English;
      case 'sr':
        return Serbian;
    }
  }, [languageCode]);

  return (
    <IntlProvider messages={messages} locale={languageCode} onError={() => {}}>
      <LanguageProvider value={languageCode}>
        <Provider store={store}>
          <PageContainer>
            <AppWrapper Component={Component} pageProps={pageProps} />
          </PageContainer>
        </Provider>
      </LanguageProvider>
    </IntlProvider>
  );
}

MyApp.getInitialProps = wrapper.getInitialAppProps(
  (store) => async (context) => {
    let languageCode = isServer()
      ? context.ctx?.req?.cookies.language_code ?? 'en'
      : Cookies.get('accessToken');

    if (!['en', 'sr'].includes(languageCode)) {
      languageCode = 'en';
    }

    store.dispatch(authSlice.endpoints.getMe.initiate());

    await Promise.all(store.dispatch(api.util.getRunningQueriesThunk()));

    const appProps = await App.getInitialProps(context);
    return { ...appProps, languageCode };
  },
);

export default MyApp;

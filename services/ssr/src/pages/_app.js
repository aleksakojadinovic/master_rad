import { authSlice } from '@/api/auth';
import AppWrapper from '@/components/AppWrapper';
import PageContainer from '@/components/PageContainer/PageContainer';
import { wrapper } from '@/redux/store';
import App from 'next/app';
import React, { useEffect, useMemo, useRef } from 'react';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import English from '../../content/compiled-locales/en.json';
import Serbian from '../../content/compiled-locales/sr.json';
import { isServer } from '@/utils';
import Cookies from 'js-cookie';
import { LanguageProvider } from '@/context/LanguageContext';
import { notificationsSlice } from '@/api/notifications';
import { getNotificationsParams } from '@/utils/params';
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';
import { FirebaseProvider } from '@/context/FirebaseContext';

function MyApp({ Component, pageProps, languageCode }) {
  const store = wrapper.useStore();
  const firebaseRef = useRef(null);
  const firebaseMessagingRef = useRef(null);

  const messages = useMemo(() => {
    switch (languageCode) {
      case 'en':
        return English;
      case 'sr':
        return Serbian;
    }
  }, [languageCode]);

  useEffect(() => {
    // Import the functions you need from the SDKs you need

    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: 'AIzaSyCOwVQ3oA68dZkxoaRKwDMW043rajFjOmo',
      authDomain: 'sts-local.firebaseapp.com',
      projectId: 'sts-local',
      storageBucket: 'sts-local.appspot.com',
      messagingSenderId: '577034751186',
      appId: '1:577034751186:web:5c5433f6feead36928310b',
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);

    firebaseRef.current = app;
    firebaseMessagingRef.current = messaging;
  }, []);

  return (
    <FirebaseProvider
      value={{
        firebaseApp: firebaseRef.current,
        firebaseMessaging: firebaseMessagingRef.current,
      }}
    >
      <IntlProvider
        messages={messages}
        locale={languageCode}
        onError={() => {}}
      >
        <LanguageProvider value={languageCode}>
          <Provider store={store}>
            <PageContainer>
              <AppWrapper Component={Component} pageProps={pageProps} />
            </PageContainer>
          </Provider>
        </LanguageProvider>
      </IntlProvider>
    </FirebaseProvider>
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

    store.dispatch(
      notificationsSlice.endpoints.getNotifications.initiate(
        getNotificationsParams(),
      ),
    );

    await Promise.all(store.dispatch(authSlice.util.getRunningQueriesThunk()));

    const appProps = await App.getInitialProps(context);
    return { ...appProps, languageCode };
  },
);

export default MyApp;

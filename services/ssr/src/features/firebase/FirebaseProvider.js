const { createContext, useEffect, useRef, useContext } = require('react');

const FirebaseContext = createContext();

import { useRegsterFirebaseTokenMutation } from '@/api/users';
import useUser from '@/hooks/useUser';
import api from '@/services/api';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { useDispatch } from 'react-redux';

// Initialize Firebase Cloud Messaging and get a reference to the service

const firebaseConfig = {
  apiKey: 'AIzaSyCOwVQ3oA68dZkxoaRKwDMW043rajFjOmo',
  authDomain: 'sts-local.firebaseapp.com',
  projectId: 'sts-local',
  storageBucket: 'sts-local.appspot.com',
  messagingSenderId: '577034751186',
  appId: '1:577034751186:web:5c5433f6feead36928310b',
};

const FIREBASE_PUBLIC_VAPID_KEY =
  'BIvJSahmqHBUvGlpTGNxES68my7IOd_bqPk2z6H6jaVHtDRKuWglrhqEmCXDK70TZ3wpi_sv5n-QmApFZohqsI8';

const registerSw = () => {
  if ('serviceWorker' in navigator) {
    return navigator.serviceWorker.register('/firebase-messaging-sw.js');
  }
  return Promise.reject();
};

export function FirebaseProvider({ children }) {
  const dispatch = useDispatch();
  const { id, isLoggedIn } = useUser();

  const [triggerRegisterFirebaseTokenMutation] =
    useRegsterFirebaseTokenMutation();

  const firebaseRef = useRef(null);
  const firebaseMessagingRef = useRef(null);

  const registerFirebase = () => {
    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);
    registerSw()
      .then(() => {
        getToken(messaging, { vapidKey: FIREBASE_PUBLIC_VAPID_KEY }).then(
          (token) => {
            console.log({ registeringToken: token });
            triggerRegisterFirebaseTokenMutation({ userId: id, token });
          },
        );

        onMessage(messaging, () => {
          dispatch(api.util.invalidateTags(['notifications']));
        });

        firebaseRef.current = app;
        firebaseMessagingRef.current = messaging;
      })
      .catch((e) => {
        console.log('error', { e });
      });
  };

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    if (!('Notification' in window)) {
      // Check if the browser supports notifications
      return;
    }

    if (Notification.permission === 'granted') {
      registerFirebase();
      return;
    }

    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        registerFirebase();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FirebaseContext.Provider value={{ firebaseRef, firebaseMessagingRef }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const { firebaseRef, firebaseMessagingRef } = useContext(FirebaseContext);

  const isLoaded =
    firebaseRef.current !== null && firebaseMessagingRef.current !== null;

  const firebaseApp = firebaseRef?.current ?? null;
  const firebaseMessaging = firebaseMessagingRef?.current ?? null;

  return { isLoaded, firebaseApp, firebaseMessaging };
}

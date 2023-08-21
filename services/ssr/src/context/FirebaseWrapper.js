const { createContext, useEffect, useRef, useContext } = require('react');

const FirebaseContext = createContext();
const FirebaseProvider = FirebaseContext.Provider;

import { selectGetMeQueryResponse } from '@/api/auth';
import { useRegsterFirebaseTokenMutation } from '@/api/users';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import { useSelector } from 'react-redux';

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

export function FirebaseWrapper({ children }) {
  const user = useSelector(selectGetMeQueryResponse);
  console.log({ user });

  const [triggerRegisterFirebaseTokenMutation] =
    useRegsterFirebaseTokenMutation();

  const firebaseRef = useRef(null);
  const firebaseMessagingRef = useRef(null);

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);

    getToken(messaging, { vapidKey: FIREBASE_PUBLIC_VAPID_KEY }).then(
      (token) => {
        triggerRegisterFirebaseTokenMutation({ userId: user.Id, token });
      },
    );

    firebaseRef.current = app;
    firebaseMessagingRef.current = messaging;
  }, [triggerRegisterFirebaseTokenMutation, user]);

  return (
    <FirebaseProvider value={{ firebaseRef, firebaseMessagingRef }}>
      {children}
    </FirebaseProvider>
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

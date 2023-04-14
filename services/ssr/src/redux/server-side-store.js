import { authSlice } from '@/api/auth/server';
import { serverSideApi } from '@/services/server-side-api';
import { configureStore } from '@reduxjs/toolkit';
import { cache } from 'react';

const makeServerSideStore = async (cookies) => {
  const store = configureStore({
    reducer: {
      [serverSideApi.reducerPath]: serverSideApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: cookies,
        },
      }).concat(serverSideApi.middleware),
  });

  store.dispatch(authSlice.endpoints.getMe.initiate());

  await Promise.all(store.dispatch(authSlice.util.getRunningQueriesThunk()));

  return store;
};

export const obtainStore = cache(async (cookies) => {
  console.log('Calling obtainStore:', Math.floor(Math.random() * 100));
  const store = await makeServerSideStore(cookies);
  return store;
});

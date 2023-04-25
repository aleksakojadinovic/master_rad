import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

import globals from './globals';
import api from '@/services/api';

const makeStore = ({ context, reduxWrapperMiddleware }) => {
  const store = configureStore({
    reducer: {
      globals,
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: context,
        },
      }).concat([reduxWrapperMiddleware, api.middleware]),
  });

  return store;
};

export const wrapper = createWrapper(makeStore);

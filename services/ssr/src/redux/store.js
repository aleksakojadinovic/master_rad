import { api, authSlice } from "@/slices/api";
import { globalReducer, setUser } from "@/slices/global";
import { configureStore } from "@reduxjs/toolkit";
import { cache } from "react";

export const makeClientSideStore = (preload) => {
  console.log("[makeCLientSideStore] accepting preload:", preload);
  const store = configureStore({
    reducer: {
      global: globalReducer,
      [api.reducerPath]: api.reducer,
    },
    preloadedState: preload,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });
  console.log(
    "[makeCLientSideStore] created store with state:",
    store.getState()
  );
  return store;
};

export const makeStore = async (cookies) => {
  const store = configureStore({
    reducer: {
      global: globalReducer,
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: cookies,
        },
      }).concat(api.middleware),
  });

  store.dispatch(authSlice.endpoints.getMe.initiate());

  await Promise.all(store.dispatch(authSlice.util.getRunningQueriesThunk()));

  return store;
};

export const obtainStore = cache(async (cookies) => {
  const store = await makeStore(cookies);
  return store;
});

export const useServerSideStore = async (cookies) => {
  const store = await obtainStore(cookies);
  return store;
};

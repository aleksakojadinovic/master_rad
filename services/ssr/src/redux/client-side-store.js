import { clientSideApi } from "@/services/client-side-api";
import { configureStore } from "@reduxjs/toolkit";

export const makeClientSideStore = (preload) => {
  const store = configureStore({
    reducer: {
      [clientSideApi.reducerPath]: clientSideApi.reducer,
    },
    preloadedState: preload,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(clientSideApi.middleware),
  });

  return store;
};

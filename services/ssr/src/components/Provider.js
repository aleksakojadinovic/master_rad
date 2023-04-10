"use client";

import { makeClientSideStore } from "@/redux/store";
import { useRef } from "react";
import { Provider as ReactReduxProvider } from "react-redux";

function Provider({ storeState, children }) {
  console.log(
    "[Provider] Creating client side store with the following state:",
    storeState
  );
  const store = useRef(makeClientSideStore(storeState));
  console.log("[Provider] Got store with state:", store.current.getState());

  return (
    <ReactReduxProvider store={store.current}>{children}</ReactReduxProvider>
  );
}

export default Provider;

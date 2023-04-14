import Provider from "@/components/Provider";
import { makeStore, obtainStore } from "@/redux/store";
import { setUser } from "@/slices/global";
import { cookies } from "next/headers";
import React from "react";
import useServerSideStore from "./useServerSideStore";

export const metadata = {
  title: "STS",
  description: "STS - Simple Ticket Service",
};

export default async function RootLayout({ children }) {
  const store = await useServerSideStore();

  return (
    <html lang="en">
      <Provider storeState={store.getState()}>
        <body>{children}</body>
      </Provider>
    </html>
  );
}

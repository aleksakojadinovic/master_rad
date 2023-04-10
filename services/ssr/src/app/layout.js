import Provider from "@/components/Provider";
import { makeStore, obtainStore, useServerSideStore } from "@/redux/store";
import { setUser } from "@/slices/global";
import { cookies } from "next/headers";
import React from "react";

export const metadata = {
  title: "STS",
  description: "STS - Simple Ticket Service",
};

export default async function RootLayout({ children }) {
  const cookieList = cookies();
  const store = await useServerSideStore(cookieList);

  return (
    <html lang="en">
      <Provider storeState={store.getState()}>
        <body>{children}</body>
      </Provider>
    </html>
  );
}

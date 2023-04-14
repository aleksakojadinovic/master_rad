import Provider from "@/components/Provider";
import React from "react";
import useServerSideStore from "./useServerSideStore";
import NavigationBar from "@/components/Navigation/NavigationBar";

export const metadata = {
  title: "STS",
  description: "STS - Simple Ticket Service",
};

export default async function RootLayout({ children }) {
  const store = await useServerSideStore();

  return (
    <html lang="en">
      <Provider storeState={store.getState()}>
        <body>
          <NavigationBar />
          {children}
        </body>
      </Provider>
    </html>
  );
}

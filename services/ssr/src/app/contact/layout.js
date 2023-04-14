import { cookies } from "next/headers";
import React from "react";
import useServerSideStore from "../useServerSideStore";

async function SubrouteLayout({ children }) {
  const store = await useServerSideStore();

  return <div>{children}</div>;
}

export default SubrouteLayout;

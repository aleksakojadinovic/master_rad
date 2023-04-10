import { useServerSideStore } from "@/redux/store";
import { cookies } from "next/headers";
import React from "react";

async function SubrouteLayout({ children }) {
  const cookiesList = cookies();
  const store = await useServerSideStore(cookiesList);

  return <div>{children}</div>;
}

export default SubrouteLayout;

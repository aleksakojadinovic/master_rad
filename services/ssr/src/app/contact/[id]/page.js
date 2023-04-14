import useServerSideStore from "@/app/useServerSideStore";
import { cookies } from "next/headers";
import React from "react";

async function ContactId({ params: { id } }) {
  const store = await useServerSideStore();

  // store.dispatch('......');

  const user = store.getState().api.queries["getMe(undefined)"].data;

  return (
    <div>
      <div>Contact {id}</div>
      <hr />
      <div>{JSON.stringify(user, null, 4)}</div>
    </div>
  );
}

export default ContactId;

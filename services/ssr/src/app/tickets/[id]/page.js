import { ticketsSlice, ticketsSliceSelectors } from '@/api/tickets/server';
import useServerSideStore from '@/app/useServerSideStore';
import Ticket from '@/components/Ticket/Ticket';
import React from 'react';

export default async function TicketView({ params: { id } }) {
  const store = await useServerSideStore();

  store.dispatch(ticketsSlice.endpoints.getTicket.initiate({ id }));
  await Promise.all(store.dispatch(ticketsSlice.util.getRunningQueriesThunk()));

  const ticket = ticketsSliceSelectors.selectGetTicketData(
    store.getState(),
    id,
  );

  return <Ticket ticket={ticket} />;
}

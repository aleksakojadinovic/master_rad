import { ticketsSlice, ticketsSliceSelectors } from '@/api/tickets/server';
import useServerSideStore from '@/app/useServerSideStore';
import React from 'react';
import NotFound from './not-found';
import TicketViewPage from './TicketViewPage';

export default async function TicketView({ params: { id } }) {
  const store = await useServerSideStore();

  store.dispatch(ticketsSlice.endpoints.getTicket.initiate({ id }));

  console.log(
    'awaitng for',
    store.dispatch(ticketsSlice.util.getRunningQueriesThunk()),
  );

  await Promise.all(store.dispatch(ticketsSlice.util.getRunningQueriesThunk()));

  console.log(
    'done waiting for',
    store.dispatch(ticketsSlice.util.getRunningQueriesThunk()),
  );

  const { isError } = ticketsSliceSelectors.selectGetTicketIndicators(
    store.getState(),
    id,
  );

  if (isError) {
    return <NotFound />;
  }

  return <TicketViewPage id={id} />;
}

'use client';

import { ticketsSliceSelectors, useGetTicketQuery } from '@/api/tickets/client';
import React from 'react';
import NotFound from './not-found';
import { useSelector } from 'react-redux';
import Ticket from '@/components/Ticket/Ticket';

export default function TicketViewPage({ id }) {
  const { isError, isLoading } = useGetTicketQuery({ id });
  const ticket = useSelector((state) => {
    console.log({ state });
    console.log(state.api.queries);
    return ticketsSliceSelectors.selectGetTicketData(state, id);
  });

  if (isLoading) {
    return 'Loading...';
  }

  if (isError) {
    return <NotFound />;
  }

  return <Ticket ticket={ticket} />;
}

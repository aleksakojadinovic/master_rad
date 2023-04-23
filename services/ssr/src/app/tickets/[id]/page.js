import React from 'react';
import Ticket from '@/components/Ticket/Ticket';
import { useServerSideFetch } from '@/app/serverSideFetch';

export default async function TicketView({ params: { id } }) {
  const ticket = await useServerSideFetch(`/api/tickets/${id}`);

  return <Ticket ticket={ticket} />;
}

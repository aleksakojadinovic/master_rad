import React from 'react';
import TicketViewPage from './TicketViewPage';

export default async function TicketView({ params: { id } }) {
  return <TicketViewPage id={id} />;
}

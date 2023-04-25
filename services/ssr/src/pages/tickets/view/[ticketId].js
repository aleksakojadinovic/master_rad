import { useRouter } from 'next/router';
import React from 'react';

function TicketViewPage() {
  const router = useRouter();
  const id = router.query.ticketId;
  return <div>{id}</div>;
}

export default TicketViewPage;

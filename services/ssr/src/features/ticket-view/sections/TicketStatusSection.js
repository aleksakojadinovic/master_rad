import { TICKET_STATUS_GRAPH } from '@/constants/status-map';
import useUser from '@/hooks/useUser';
import React from 'react';

function TicketStatusSection({ ticket }) {
  const { hasRole } = useUser();

  const statusChangesExplained = TICKET_STATUS_GRAPH[ticket.status].map(
    (entry) => {
      const isAllowed = hasRole(entry.roles);
      return { ...entry, isAllowed };
    },
  );

  console.log({ statusChangesExplained });

  return <div>TicketStatusSection</div>;
}

export default TicketStatusSection;

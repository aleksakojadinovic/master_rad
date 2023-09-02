import useUser from '@/hooks/useUser';
import React from 'react';

function TicketStatusSection({ ticket }) {
  const user = useUser();
  console.log({ user });
  return <div>TicketStatusSection</div>;
}

export default TicketStatusSection;

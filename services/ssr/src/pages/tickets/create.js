import CreateTicket from '@/features/create-ticket/CreateTicket';
import Head from 'next/head';
import React, { Fragment } from 'react';

function TicketsCreatePage() {
  return (
    <Fragment>
      <Head>
        <title>Create a ticket | STS</title>
      </Head>
      <CreateTicket />
    </Fragment>
  );
}

export default TicketsCreatePage;

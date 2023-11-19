import { useStoreUser } from '@/api/auth';
import CreateTicket from '@/features/create-ticket/CreateTicket';
import { wrapper } from '@/redux/store';
import { createTicketMessages } from '@/translations/create-ticket';
import Head from 'next/head';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';

function TicketsCreatePage() {
  const intl = useIntl();
  return (
    <Fragment>
      <Head>
        <title>{intl.formatMessage(createTicketMessages.pageHeadTitle)}</title>
      </Head>
      <CreateTicket />
    </Fragment>
  );
}

export default TicketsCreatePage;

export const getServerSideProps = wrapper.getServerSideProps((store) => () => {
  const { isLoggedIn } = useStoreUser(store);

  if (!isLoggedIn) {
    return {
      notFound: true,
    };
  }
});

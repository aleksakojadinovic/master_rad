import { useStoreUser } from '@/api/auth';
import { ticketsSlice } from '@/api/tickets';
import CustomerDashboard from '@/features/customer-dashboard/CustomerDashboard';
import { myActiveParams } from '@/features/customer-dashboard/utils';
import { wrapper } from '@/redux/store';
import api from '@/services/api';
import { customerDashboardMessages } from '@/translations/customer-dashboard';
import Head from 'next/head';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';

function CustomerDashboardPage() {
  const intl = useIntl();

  return (
    <Fragment>
      <Head>
        <title>
          {intl.formatMessage(customerDashboardMessages.pageHeadTitle)}
        </title>
      </Head>
      <CustomerDashboard />
    </Fragment>
  );
}

export default CustomerDashboardPage;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    const { id, isCustomer } = useStoreUser(store);

    if (!isCustomer) {
      return {
        redirect: {
          notFound: true,
        },
      };
    }

    const params = myActiveParams(id);
    store.dispatch(ticketsSlice.endpoints.getTickets.initiate(params));

    await Promise.all(store.dispatch(api.util.getRunningQueriesThunk()));
  },
);

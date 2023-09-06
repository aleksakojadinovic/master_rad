import { useStoreUser } from '@/api/auth';
import CustomerDashboard from '@/features/customer-dashboard/CustomerDashboard';
import { wrapper } from '@/redux/store';
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

export const getServerSideProps = wrapper.getServerSideProps((store) => () => {
  const { isCustomer } = useStoreUser(store);

  if (!isCustomer) {
    return {
      redirect: {
        destination: '/404',
      },
    };
  }
});

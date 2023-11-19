import { useStoreUser } from '@/api/auth';
import AgentDashboard from '@/features/agent-dashboard/AgentDashboard';
import { wrapper } from '@/redux/store';
import { adminDashboardMessages } from '@/translations/admin.dash';
import Head from 'next/head';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';

function AdminDashboardPage() {
  const intl = useIntl();
  return (
    <Fragment>
      <Head>
        <title>{intl.formatMessage(adminDashboardMessages.title)}</title>
      </Head>
      <AgentDashboard />
    </Fragment>
  );
}

export default AdminDashboardPage;

export const getServerSideProps = wrapper.getServerSideProps((store) => () => {
  const { isAdministrator } = useStoreUser(store);

  if (!isAdministrator) {
    return {
      notFound: true,
    };
  }

  return {};
});

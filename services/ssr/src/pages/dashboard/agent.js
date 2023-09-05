import { useStoreUser } from '@/api/auth';
import AgentDashboard from '@/features/agent-dashboard/AgentDashboard';
import { wrapper } from '@/redux/store';
import { agentDashboardMessages } from '@/translations/agent-dashboard';
import Head from 'next/head';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';

function AgentDashboardPage() {
  const intl = useIntl();
  return (
    <Fragment>
      <Head>
        <title>{intl.formatMessage(agentDashboardMessages.title)}</title>
      </Head>
      <AgentDashboard />
    </Fragment>
  );
}

export default AgentDashboardPage;

export const getServerSideProps = wrapper.getServerSideProps((store) => () => {
  const { isAgent } = useStoreUser(store);

  if (!isAgent) {
    return {
      redirect: {
        destination: '/404',
      },
    };
  }
});

import { useStoreUser } from '@/api/auth';
import { ticketsSlice } from '@/api/tickets';
import AgentDashboard from '@/features/agent-dashboard/AgentDashboard';
import { getPredefinedParams } from '@/features/agent-dashboard/utils';
import { wrapper } from '@/redux/store';
import api from '@/services/api';
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

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    const { isAgent, isAdministrator, id } = useStoreUser(store);

    if (!isAgent && !isAdministrator) {
      return {
        redirect: {
          notFound: true,
        },
      };
    }

    getPredefinedParams(id).forEach((params) => {
      store.dispatch(ticketsSlice.endpoints.getTickets.initiate(params));
    });

    await Promise.all(store.dispatch(api.util.getRunningQueriesThunk()));
  },
);

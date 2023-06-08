import { selectGetMeQueryResponse } from '@/api/auth';
import { ticketsSlice, useGetTicketsQuery } from '@/api/tickets';
import AgentDashboard from '@/features/agent-dashboard/AgentDashboard';
import { wrapper } from '@/redux/store';
import { agentDashboardTitle } from '@/translations/agent-dashboard';
import { getAgentDashboardTicketsParams } from '@/utils/params';
import { Box, Typography } from '@mui/material';
import Head from 'next/head';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';

function DashboardPage({ page, perPage, filters, ...rest }) {
  wrapper.useHydration(rest);

  const intl = useIntl();

  const { isLoading, isFetching } = useGetTicketsQuery(
    getAgentDashboardTicketsParams(page, perPage, filters),
  );

  if (isLoading || isFetching) {
    return 'Loading...';
  }
  return (
    <Fragment>
      <Head>
        <title>{intl.formatMessage(agentDashboardTitle)}</title>
      </Head>
      <Typography variant="h3">
        {intl.formatMessage(agentDashboardTitle)}
      </Typography>
      <Box sx={{ marginTop: '12px' }}>
        <AgentDashboard page={page} perPage={perPage} filters={filters} />
      </Box>
    </Fragment>
  );
}

export default DashboardPage;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const { page: pageParam, perPage: perPageParam, ...rest } = context.query;

    const filters = rest ?? {};

    const page = parseInt(pageParam, 10) || 1;
    const perPage = parseInt(perPageParam, 10) || 10;

    const user = selectGetMeQueryResponse(store.getState());
    if (user == null) {
      return {
        redirect: {
          destination: '/',
        },
      };
    }
    if (!user.roles.map(({ name }) => name).includes('agent')) {
      return {
        redirect: {
          destination: '/404',
        },
      };
    }

    store.dispatch(
      ticketsSlice.endpoints.getTickets.initiate(
        getAgentDashboardTicketsParams(page, perPage, filters),
      ),
    );

    await Promise.all(
      store.dispatch(ticketsSlice.util.getRunningQueriesThunk()),
    );

    // TODO: Validate filters

    return {
      props: {
        page,
        perPage,
        filters,
      },
    };
  },
);

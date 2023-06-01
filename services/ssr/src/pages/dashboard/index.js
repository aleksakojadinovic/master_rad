import { selectGetMeQueryResponse } from '@/api/auth';
import { ticketsSlice, useGetTicketsQuery } from '@/api/tickets';
import AgentDashboard from '@/features/agent-dashboard/AgentDashboard';
import { wrapper } from '@/redux/store';
import { getAgentDashboardTicketsParams } from '@/utils/params';
import { Box, Typography } from '@mui/material';
import Head from 'next/head';
import React, { Fragment } from 'react';

function DashboardPage({ page, perPage, filters, ...rest }) {
  wrapper.useHydration(rest);
  const { isLoading, isFetching } = useGetTicketsQuery(
    getAgentDashboardTicketsParams(page, perPage),
  );

  if (isLoading || isFetching) {
    return 'Loading...';
  }

  return (
    <Fragment>
      <Head>
        <title>Agent Dashboard | STS</title>
      </Head>
      <Typography variant="h3">Dashboard</Typography>
      <Box sx={{ marginTop: '12px' }}>
        <AgentDashboard page={page} perPage={perPage} filters={filters} />
      </Box>
    </Fragment>
  );
}

export default DashboardPage;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const {
      page: pageParam,
      perPage: perPageParam,
      ...filters
    } = context.query;

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
        getAgentDashboardTicketsParams(page, perPage),
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

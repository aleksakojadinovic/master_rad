import { selectGetMeQueryResponse } from '@/api/auth';
import { ticketsSlice, useGetTicketsQuery } from '@/api/tickets';
import AgentDashboard from '@/features/agent-dashboard/AgentDashboard';
import { wrapper } from '@/redux/store';
import { getAgentDashboardTicketsParams } from '@/utils/params';
import { Box, Typography } from '@mui/material';
import Head from 'next/head';
import React, { Fragment } from 'react';

function DashboardPage() {
  const { isLoading, isFetching } = useGetTicketsQuery(
    getAgentDashboardTicketsParams(),
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
        <AgentDashboard />
      </Box>
    </Fragment>
  );
}

export default DashboardPage;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
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
        getAgentDashboardTicketsParams(),
      ),
    );

    await Promise.all(
      store.dispatch(ticketsSlice.util.getRunningQueriesThunk()),
    );

    return {};
  },
);

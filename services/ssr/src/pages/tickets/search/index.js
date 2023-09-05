import { useStoreUser } from '@/api/auth';
import { ticketsSlice, useGetTicketsQuery } from '@/api/tickets';
import TicketSearch from '@/features/ticket-search/TicketSearch';
import { wrapper } from '@/redux/store';
import { queryStatusMessages } from '@/translations/query-statuses';
import { ticketSearchMessages } from '@/translations/ticket-search';
import { getTicketSearchTicketsParams } from '@/utils/params';
import { Box, Typography } from '@mui/material';
import Head from 'next/head';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';

function TicketSearchPage({ page, perPage, filters }) {
  const intl = useIntl();

  const { isLoading, isFetching } = useGetTicketsQuery(
    getTicketSearchTicketsParams(page, perPage, filters),
  );

  if (isLoading || isFetching) {
    return intl.formatMessage(queryStatusMessages.loading);
  }

  return (
    <Fragment>
      <Head>
        <title>{intl.formatMessage(ticketSearchMessages.pageHeadTitle)}</title>
      </Head>
      <Typography variant="h3">
        {intl.formatMessage(ticketSearchMessages.pageTitle)}
      </Typography>
      <Box marginTop="12px">
        <TicketSearch page={page} perPage={perPage} filters={filters} />
      </Box>
    </Fragment>
  );
}

export default TicketSearchPage;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const { page: pageParam, perPage: perPageParam, ...rest } = context.query;

    const filters = rest ?? {};

    const page = parseInt(pageParam, 10) || 1;
    const perPage = parseInt(perPageParam, 10) || 10;

    const { isLoggedIn, isAdministator, isSuperAdministrator, isAgent } =
      useStoreUser(store);

    if (!isLoggedIn) {
      return {
        redirect: {
          destination: '/404',
        },
      };
    }

    const isAuthorized = isAdministator || isSuperAdministrator || isAgent;

    if (!isAuthorized) {
      return {
        redirect: {
          destination: '/404',
        },
      };
    }

    store.dispatch(
      ticketsSlice.endpoints.getTickets.initiate(
        getTicketSearchTicketsParams(page, perPage, filters),
      ),
    );

    await Promise.all(
      store.dispatch(ticketsSlice.util.getRunningQueriesThunk()),
    );

    return {
      props: {
        page,
        perPage,
        filters,
      },
    };
  },
);

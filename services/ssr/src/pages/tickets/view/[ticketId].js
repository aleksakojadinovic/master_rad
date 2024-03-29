import {
  selectGetTicketQueryIndicators,
  selectGetTicketQueryResponse,
  ticketsSlice,
  useGetTicketQuery,
} from '@/api/tickets';
import TicketView from '@/features/ticket-view/TicketView';
import { wrapper } from '@/redux/store';
import { getTicketViewQueryParams } from '@/utils/params';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';

function TicketViewPage() {
  const router = useRouter();
  const id = router.query.ticketId;

  const { isLoading, isFetching, isError } = useGetTicketQuery({
    id,
    ...getTicketViewQueryParams(),
  });

  const ticket = useSelector((state) =>
    selectGetTicketQueryResponse(state, { id, ...getTicketViewQueryParams() }),
  );

  const title = `${ticket?.title} | STS`;

  if (!ticket && (isLoading || isFetching)) {
    return 'Loading';
  }

  if (isError) {
    return 'Error';
  }

  return (
    <Fragment>
      <Head>
        <title>{title}</title>
      </Head>
      <TicketView ticket={ticket} />
    </Fragment>
  );
}

export default TicketViewPage;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const ticketId = context.params.ticketId;
    store.dispatch(
      ticketsSlice.endpoints.getTicket.initiate({
        id: ticketId,
        ...getTicketViewQueryParams(),
      }),
    );

    await Promise.all(
      store.dispatch(ticketsSlice.util.getRunningQueriesThunk()),
    );

    const indicators = selectGetTicketQueryIndicators(store.getState(), {
      id: ticketId,
      ...getTicketViewQueryParams(),
    });

    // TOOD: This doesnt work for some reason
    if (indicators.isError) {
      return {
        notFound: true,
      };
    }

    return {};
  },
);

import {
  selectGetTicketQueryIndicators,
  selectGetTicketQueryResponse,
  ticketsSlice,
  useGetTicketQuery,
} from '@/api/tickets';
import Ticket from '@/components/Ticket/Ticket';
import { wrapper } from '@/redux/store';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';

function TicketViewPage(props) {
  wrapper.useHydration(props);
  const router = useRouter();
  const id = router.query.ticketId;

  useGetTicketQuery({ id });

  const ticket = useSelector((state) =>
    selectGetTicketQueryResponse(state, id),
  );

  const title = `${ticket.state.title} | STS`;

  return (
    <Fragment>
      <Head>
        <title>{title}</title>
      </Head>
      <Ticket ticket={ticket} />
    </Fragment>
  );
}

export default TicketViewPage;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const ticketId = context.params.ticketId;
    store.dispatch(ticketsSlice.endpoints.getTicket.initiate({ id: ticketId }));

    await Promise.all(
      store.dispatch(ticketsSlice.util.getRunningQueriesThunk()),
    );

    const { isError } = selectGetTicketQueryIndicators(
      store.getState(),
      ticketId,
    );

    if (isError) {
      return {
        redirect: {
          destination: '/404',
        },
      };
    }

    return {};
  },
);

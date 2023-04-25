import api from '@/services/api';
import { createSelector } from '@reduxjs/toolkit';

export const ticketsSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getTicket: builder.query({
      query: ({ id }) => ({
        url: `/tickets/${id}`,
      }),
    }),
  }),
});

export const { useGetTicketQuery } = ticketsSlice;

const selectGetTicketQueryResult = createSelector(
  [(state) => state, (_, id) => id],
  (state, id) => ticketsSlice.endpoints.getTicket.select({ id })(state),
);

export const selectGetTicketQueryIndicators = createSelector(
  [selectGetTicketQueryResult],
  ({ isLoading, isError, isUninitialized, isSuccess }) => ({
    isLoading,
    isError,
    isUninitialized,
    isSuccess,
  }),
);

export const selectGetTicketQueryResponse = createSelector(
  [selectGetTicketQueryResult],
  (queryResult) => queryResult.data,
);

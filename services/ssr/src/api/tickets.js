import api from '@/services/api';
import { createSelector } from '@reduxjs/toolkit';

export const ticketsSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getTicket: builder.query({
      query: ({ id }) => ({
        url: `/tickets/${id}`,
      }),
      providesTags: ({ id }) => {
        return [{ type: 'getTicket', id }];
      },
    }),
    updateTicket: builder.mutation({
      query: ({ id, ...update }) => ({
        url: `/tickets/${id}`,
        method: 'PATCH',
        body: update,
      }),
      invalidatesTags: ({ id }) => [{ type: 'getTicket', id }],
    }),
  }),
});

export const { useGetTicketQuery, useUpdateTicketMutation } = ticketsSlice;

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

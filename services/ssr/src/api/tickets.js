import api from '@/services/api';
import { createSelector } from '@reduxjs/toolkit';

export const ticketsSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getTicket: builder.query({
      query: ({ id, ...params }) => ({
        url: `/tickets/${id}`,
        params,
      }),
      providesTags: (res) => {
        return res ? [{ type: 'getTicket', id: res.id }] : [];
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
    getTickets: builder.query({
      query: (params) => ({
        url: '/tickets',
        params,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetTicketQuery,
  useUpdateTicketMutation,
  useGetTicketsQuery,
} = ticketsSlice;

const selectGetTicketQueryResult = createSelector(
  [(state) => state, (_, params) => params],
  (state, params) => ticketsSlice.endpoints.getTicket.select(params)(state),
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

const selectGetTicketsQueryResult = createSelector(
  [(state) => state, (_, params) => params],
  (state, params) => ticketsSlice.endpoints.getTickets.select(params)(state),
);

export const selectGetTicketsQueryResponse = createSelector(
  [selectGetTicketsQueryResult],
  (queryResult) => queryResult.data ?? [],
);

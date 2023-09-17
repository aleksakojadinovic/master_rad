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
    createTicket: builder.mutation({
      query: (body) => ({
        url: '/tickets',
        method: 'POST',
        body,
      }),
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
    updateComment: builder.mutation({
      query: ({ id, commentId, body }) => ({
        url: `/tickets/${id}/comment/${commentId}/update`,
        method: 'PATCH',
        body: { body },
      }),
      invalidatesTags: ({ id }) => [{ type: 'getTicket', id }],
    }),
    deleteComment: builder.mutation({
      query: ({ id, commentId }) => ({
        url: `/tickets/${id}/comment/${commentId}/delete`,
        method: 'DELETE',
      }),
      invalidatesTags: ({ id }) => [{ type: 'getTicket', id }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetTicketQuery,
  useUpdateTicketMutation,
  useGetTicketsQuery,
  useCreateTicketMutation,
  useUpdateCommentMutation,
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

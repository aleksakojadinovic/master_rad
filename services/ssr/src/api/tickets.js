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
    addComment: builder.mutation({
      query: ({ id, body, isInternal }) => ({
        url: `/tickets/${id}/comment/add`,
        method: 'PATCH',
        body: { body, isInternal },
      }),
      invalidatesTags: ({ id }) => [{ type: 'getTicket', id }],
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
    addTags: builder.mutation({
      query: ({ id, tagIds }) => ({
        url: `/tickets/${id}/tags/add`,
        method: 'PATCH',
        body: { tags: tagIds },
      }),
      invalidatesTags: ({ id }) => [{ type: 'getTicket', id }],
    }),
    removeTags: builder.mutation({
      query: ({ id, tagIds }) => ({
        url: `/tickets/${id}/tags/remove`,
        method: 'PATCH',
        body: { tags: tagIds },
      }),
      invalidatesTags: ({ id }) => [{ type: 'getTicket', id }],
    }),
    addAssignees: builder.mutation({
      query: ({ id, assigneeIds }) => ({
        url: `/tickets/${id}/assignees/add`,
        method: 'PATCH',
        body: { assignees: assigneeIds },
      }),
      invalidatesTags: ({ id }) => [{ type: 'getTicket', id }],
    }),
    removeAssignees: builder.mutation({
      query: ({ id, assigneeIds }) => ({
        url: `/tickets/${id}/assignees/remove`,
        method: 'PATCH',
        body: { assignees: assigneeIds },
      }),
      invalidatesTags: ({ id }) => [{ type: 'getTicket', id }],
    }),
    editTitle: builder.mutation({
      query: ({ id, title }) => ({
        url: `/tickets/${id}/title`,
        method: 'PATCH',
        body: { title },
      }),
      invalidatesTags: ({ id }) => [{ type: 'getTicket', id }],
    }),
    editBody: builder.mutation({
      query: ({ id, body }) => ({
        url: `/tickets/${id}/body`,
        method: 'PATCH',
        body: { body },
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
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useAddTagsMutation,
  useRemoveTagsMutation,
  useAddAssigneesMutation,
  useRemoveAssigneesMutation,
  useEditTitleMutation,
  useEditBodyMutation,
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

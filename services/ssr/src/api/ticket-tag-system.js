import api from '@/services/api';
import { createSelector } from '@reduxjs/toolkit';
import { selectGetRolesQueryResponse } from './roles';

export const ticketTagSystemSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getTicketTagGroups: builder.query({
      query: (params) => ({
        url: '/ticket-tag-group',
        params,
      }),
      providesTags: ['ticket-tag-groups'],
    }),
    getTicketTagGroup: builder.query({
      query: ({ id, ...params }) => ({
        url: `/ticket-tag-group/${id}`,
        params,
      }),
      providesTags: (_result, error, args) => {
        return error ? [] : [{ type: 'ticket-tag-group', id: args.id }];
      },
    }),
    updateTicketTagGroup: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/ticket-tag-group/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_result, error, args) => {
        return error
          ? []
          : [{ type: 'ticket-tag-group', id: args.id }, 'ticket-tag-group'];
      },
    }),
    createTicketTagGroup: builder.mutation({
      query: ({ ...body }) => ({
        url: '/ticket-tag-group/',
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, error, args) => {
        return error
          ? []
          : [{ type: 'ticket-tag-group', id: args.id }, 'ticket-tag-group'];
      },
    }),
    getTicketTags: builder.query({
      query: (params) => ({
        url: '/ticket-tag/',
        params,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetTicketTagGroupsQuery,
  useGetTicketTagGroupQuery,
  useUpdateTicketTagGroupMutation,
  useCreateTicketTagGroupMutation,
  useGetTicketTagsQuery,
} = ticketTagSystemSlice;

const selectGetTicketTagGroupsQueryResult = createSelector(
  [(state) => state, (_, params) => params],
  (state, params) => {
    return ticketTagSystemSlice.endpoints.getTicketTagGroups.select(params)(
      state,
    );
  },
);

export const selectGetTicketTagGroupsQueryIndicators = createSelector(
  [selectGetTicketTagGroupsQueryResult],
  ({ isLoading, isError, isUninitialized, isSuccess }) => ({
    isLoading,
    isError,
    isUninitialized,
    isSuccess,
  }),
);

export const selectGetTicketTagGroupsQueryResponse = createSelector(
  [selectGetTicketTagGroupsQueryResult],
  (queryResult) => queryResult.data ?? [],
);

export const selectTicketTagGroups = createSelector(
  [selectGetTicketTagGroupsQueryResult, selectGetRolesQueryResponse],
  (queryResult, roles) => {
    const groups = queryResult.data ?? [];
    const result = groups.map((group) => ({
      ...group,
      permissions: {
        ...group.permission,
        canAddRoles: group.permissions.canAddRoles.map((roleId) =>
          roles.find(({ id }) => id == roleId),
        ),
        canRemoveRoles: group.permissions.canRemoveRoles.map((roleId) =>
          roles.find(({ id }) => id == roleId),
        ),
      },
    }));

    return result;
  },
);

const selectGetTicketTagGroupQueryResult = createSelector(
  [(state) => state, (_, params) => params],
  (state, params) => {
    return ticketTagSystemSlice.endpoints.getTicketTagGroup.select(params)(
      state,
    );
  },
);

export const selectGetTicketTagGroupQueryResponse = createSelector(
  [selectGetTicketTagGroupQueryResult],
  (queryResult) => queryResult.data ?? [],
);

const selectGetTicketTagsQueryResult = createSelector(
  [(state) => state, (_, params) => params],
  (state, params) => {
    return ticketTagSystemSlice.endpoints.getTicketTags.select(params)(state);
  },
);

export const selectGetTicketTagsQueryIndicators = createSelector(
  [selectGetTicketTagsQueryResult],
  ({ isLoading, isError, isUninitialized, isSuccess }) => ({
    isLoading,
    isError,
    isUninitialized,
    isSuccess,
  }),
);

export const selectGetTicketTagsQueryResponse = createSelector(
  [selectGetTicketTagsQueryResult],
  (queryResult) => queryResult.data ?? [],
);

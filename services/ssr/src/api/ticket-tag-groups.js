import api from '@/services/api';
import { createSelector } from '@reduxjs/toolkit';
import { selectGetRolesQueryResponse } from './roles';

export const ticketTagGroupsSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getTicketTagGroups: builder.query({
      query: (params) => ({
        url: '/ticket-tag-group',
        params,
      }),
    }),
    getTicketTagGroup: builder.query({
      query: ({ id, ...params }) => ({
        url: `/ticket-tag-group/${id}`,
        params,
      }),
    }),
    updateTicketTagGroup: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/ticket-tag-group/${id}`,
        method: 'PATCH',
        body: patch,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetTicketTagGroupsQuery,
  useGetTicketTagGroupQuery,
  useUpdateTicketTagGroupMutation,
} = ticketTagGroupsSlice;

const selectGetTicketTagGroupsQueryResult = createSelector(
  [(state) => state, (_, params) => params],
  (state, params) => {
    return ticketTagGroupsSlice.endpoints.getTicketTagGroups.select(params)(
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
    return ticketTagGroupsSlice.endpoints.getTicketTagGroup.select(params)(
      state,
    );
  },
);

export const selectGetTicketTagGroupQueryResponse = createSelector(
  [selectGetTicketTagGroupQueryResult],
  (queryResult) => queryResult.data ?? [],
);

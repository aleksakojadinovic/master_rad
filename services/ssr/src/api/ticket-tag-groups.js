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
  }),
  overrideExisting: true,
});

export const { useGetTicketTagGroupsQuery } = ticketTagGroupsSlice;

const selectGetTicketTagGroupsQueryResult = createSelector(
  [(state) => state, (_, params) => params],
  (state, params) =>
    ticketTagGroupsSlice.endpoints.getTicketTagGroups.select(params)(state),
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
    return groups.map((group) => ({
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
  },
);

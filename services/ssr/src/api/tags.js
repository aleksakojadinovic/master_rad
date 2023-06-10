import api from '@/services/api';
import { createSelector } from '@reduxjs/toolkit';

export const tagsSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getTicketTagGroups: builder.query({
      query: (params) => ({
        url: '/ticket-tag-groups',
        params,
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useGetTicketTagGroupsQuery } = tagsSlice;

const selectGetTicketTagGroupsQueryResult = createSelector(
  [(state) => state, (_, params) => params],
  (state, params) =>
    tagsSlice.endpoints.getTicketTagGroups.select(params)(state),
);

export const selectGetTicketsQueryResponse = createSelector(
  [selectGetTicketTagGroupsQueryResult],
  (queryResult) => queryResult.data ?? [],
);

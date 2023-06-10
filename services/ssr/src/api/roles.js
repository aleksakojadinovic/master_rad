import api from '@/services/api';
import { createSelector } from '@reduxjs/toolkit';

export const rolesSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query({
      query: (params) => ({
        url: '/roles',
        params,
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useGetRolesQuery } = rolesSlice;

const selectGetRolesQueryResult = createSelector([(state) => state], (state) =>
  rolesSlice.endpoints.getRoles.select()(state),
);

export const selectGetRolesQueryIndicators = createSelector(
  [selectGetRolesQueryResult],
  ({ isLoading, isError, isUninitialized, isSuccess }) => ({
    isLoading,
    isError,
    isUninitialized,
    isSuccess,
  }),
);

export const selectGetRolesQueryResponse = createSelector(
  [selectGetRolesQueryResult],
  (queryResult) => queryResult.data ?? [],
);

export const selectRoleById = createSelector(
  [selectGetRolesQueryResult, (_, id) => id],
  (roles, _id) => roles.find(({ id }) => id == _id),
);

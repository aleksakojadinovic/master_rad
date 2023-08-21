import api from '@/services/api';
import { createSelector } from '@reduxjs/toolkit';

export const usersSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (params) => ({
        url: '/users',
        params,
      }),
    }),
    regsterFirebaseToken: builder.mutation({
      query: ({ userId, token }) => ({
        method: 'PATCH',
        url: `/users/${userId}`,
        body: {
          action: 'register_firebase_token',
          token,
        },
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useGetUsersQuery, useRegsterFirebaseTokenMutation } = usersSlice;

const selectGetUsersQueryResult = createSelector(
  [(state) => state, (_, params) => params],
  (state, params) => usersSlice.endpoints.getUsers.select(params)(state),
);

export const selectGetTicketsQueryResponse = createSelector(
  [selectGetUsersQueryResult],
  (queryResult) => queryResult.data ?? [],
);

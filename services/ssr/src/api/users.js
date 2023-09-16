import api from '@/services/api';
import { createSelector } from '@reduxjs/toolkit';

export const usersSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (params) => ({
        url: '/users',
        params,
      }),
      providesTags: ({ entities }) => [
        ...entities.map(({ id }) => ({ type: 'USERS_TAG', id })),
        'USERS_TAG',
      ],
    }),
    getUser: builder.query({
      query: ({ id }) => ({
        url: `/users/${id}`,
        params: { includes: ['roles'] },
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
    changeRole: builder.mutation({
      query: ({ userId, role }) => ({
        method: 'PATCH',
        url: `/users/${userId}`,
        body: { action: 'change_role', role },
      }),
      invalidatesTags: (_result, error, { userId }) =>
        error ? [] : [{ type: 'USERS_TAG', id: userId }, 'USERS_TAG'],
    }),
    changeStatus: builder.mutation({
      query: ({ userId, status }) => ({
        method: 'PATCH',
        url: `/users/${userId}`,
        body: { action: 'change_status', status },
      }),
      invalidatesTags: (_result, error, { userId }) =>
        error ? [] : [{ type: 'USERS_TAG', id: userId }, 'USERS_TAG'],
    }),
    changePassword: builder.mutation({
      query: ({ userId, oldPassword, newPassword }) => ({
        method: 'PATCH',
        url: `/users/${userId}`,
        body: { action: 'change_password', oldPassword, newPassword },
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useRegsterFirebaseTokenMutation,
  useChangeRoleMutation,
  useChangeStatusMutation,
  useChangePasswordMutation,
} = usersSlice;

const selectGetUsersQueryResult = createSelector(
  [(state) => state, (_, params) => params],
  (state, params) => usersSlice.endpoints.getUsers.select(params)(state),
);

export const selectGetUsersQueryResponse = createSelector(
  [selectGetUsersQueryResult],
  (queryResult) => queryResult.data ?? [],
);

export const selectUserById = createSelector(
  [(state) => state, (_, params) => params],
  (state, params) => {
    const { id, ...rest } = params;
    const users = selectGetUsersQueryResponse(state, rest);

    return users?.find((user) => user.id === id) ?? null;
  },
);

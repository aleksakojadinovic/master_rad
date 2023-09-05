import api from '@/services/api';
import { createSelector } from '@reduxjs/toolkit';

export const notificationsSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: ({ page }) => ({
        url: '/notifications',
        params: {
          page,
          perPage: 5,
          includes: ['ticket', 'user', 'tags'],
        },
      }),
      providesTags: ['notifications'],
    }),
    markNotificationAsRead: builder.mutation({
      query: ({ id }) => ({
        method: 'PATCH',
        url: `/notifications/${id}`,
        body: {
          action: 'mark_read',
        },
      }),
      invalidatesTags: ['notifications'],
    }),
  }),
  overrideExisting: true,
});

export const { useGetNotificationsQuery, useMarkNotificationAsReadMutation } =
  notificationsSlice;

export const selectNotificationsByPage = createSelector(
  [(state) => state, (_, page) => page],
  (state, page) => {
    return notificationsSlice.endpoints.getNotifications.select({ page });
  },
);

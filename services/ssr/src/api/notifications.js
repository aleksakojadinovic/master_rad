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
      // serializeQueryArgs: ({ endpointName }) => endpointName,
      // merge: (currentCache, newCache) => {
      //   return {
      //     notifications: [
      //       ...currentCache.notifications,
      //       ...newCache.notifications,
      //     ],
      //     unreadCount: newCache.unreadCount,
      //   };
      // },
      // forceRefetch: ({ currentArg, previousArg }) =>
      //   previousArg === undefined || previousArg.page !== currentArg.page,
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
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData('getNotifications', undefined, (draft) => {
            draft.notifications = draft.notifications.map((notification) =>
              notification.id !== id
                ? notification
                : { ...notification, readAt: new Date().toString() },
            );
            draft.unreadCount--;
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
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

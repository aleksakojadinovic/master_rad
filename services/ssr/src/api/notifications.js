import api from '@/services/api';

export const notificationsSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: (params) => ({
        url: '/notifications',
        params,
      }),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (currentCache, newCache) => {
        return {
          notifications: [
            ...currentCache.notifications,
            ...newCache.notifications,
          ],
          unreadCount: newCache.unreadCount,
        };
      },
      forceRefetch: ({ currentArg, previousArg }) =>
        previousArg === undefined || previousArg.page !== currentArg.page,
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

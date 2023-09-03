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
    }),
  }),
  overrideExisting: true,
});

export const { useGetNotificationsQuery, useMarkNotificationAsReadMutation } =
  notificationsSlice;

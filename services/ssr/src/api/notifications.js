import api from '@/services/api';

export const notificationsSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: (params) => ({
        url: '/notifications',
        params,
      }),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (currentNotifications, newNotifications) => {
        currentNotifications.push(...newNotifications);
      },
      forceRefetch({ currentArg: curr, previousArg: prev }) {
        return prev === undefined || curr.page !== prev.page;
      },
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

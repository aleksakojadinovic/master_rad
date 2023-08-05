import api from '@/services/api';

export const notificationsSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: (params) => ({
        url: '/notifications',
        params,
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useGetNotificationsQuery } = notificationsSlice;

import api from '@/services/api';

export const aiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getAISummary: builder.query({
      query: ({ ticketId }) => ({
        url: '/generative-ai/summarize',
        params: { ticketId },
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useGetAISummaryQuery, useLazyGetAISummaryQuery } = aiSlice;

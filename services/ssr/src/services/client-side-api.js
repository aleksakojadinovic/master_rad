import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import camelize from 'camelize';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers) => {
    headers.set('X-Requested-With', 'XMLHttpRequest');
    headers.set('Access-Control-Allow-Origin', '*');
  },
});

export const clientSideApi = createApi({
  reducerPath: 'api',
  baseQuery: async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    if (result.data) {
      return { ...result, data: camelize(result.data) };
    }
    return result;
  },
  keepUnusedFor: 86400,
  endpoints: () => ({}),
});

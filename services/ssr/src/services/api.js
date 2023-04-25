import { isServer } from '@/utils';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import camelize from 'camelize';

const baseQuery = fetchBaseQuery({
  baseUrl: isServer() ? 'http://host.docker.internal/api' : '/',
  prepareHeaders: (headers, api) => {
    const cookie = api?.extra?.ctx?.req?.headers?.cookie;
    if (cookie) {
      headers.set('Cookie', cookie);
    }
    headers.set('X-Requested-With', 'XMLHttpRequest');
    headers.set('Access-Control-Allow-Origin', '*');
    return headers;
  },
});

export default createApi({
  reducerPath: 'api',
  baseQuery: async (args, api, extraOptions) => {
    const resolvedArgs = { ...args };

    const result = await baseQuery(resolvedArgs, api, extraOptions);
    if (result.data) {
      return { ...result, data: camelize(result.data) };
    }
    return result;
  },
  keepUnusedFor: 10,
  endpoints: () => ({}),
});

import { isServer } from '@/utils';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import camelize from 'camelize';
import Cookies from 'js-cookie';

const parseCookie = (str) =>
  (str ?? '')
    .split(';')
    .map((v) => v.split('='))
    .reduce((acc, v) => {
      if (!v || !v[0]) {
        return acc;
      }
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});

const baseQuery = fetchBaseQuery({
  baseUrl: isServer() ? 'http://host.docker.internal/api' : '/api',
  prepareHeaders: (headers, api) => {
    const accessToken = isServer()
      ? parseCookie(api?.extra?.ctx?.req?.headers?.cookie).accessToken ?? ''
      : Cookies.get('accessToken');

    const languageCode =
      (isServer()
        ? parseCookie(api?.extra?.ctx?.req?.headers?.cookie).language_code ?? ''
        : Cookies.get('language_code')) ?? 'en';

    headers.set('Authorization', `Bearer ${accessToken}`);
    headers.set('X-Requested-With', 'XMLHttpRequest');
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Accept-Language', languageCode);
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
  keepUnusedFor: 1000,
  endpoints: () => ({}),
  tagTypes: [
    'getTicket',
    'ticket-tag-groups',
    'ticket-tag-group',
    'notifications',
  ],
});

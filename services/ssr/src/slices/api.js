import camelize from "camelize";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://host.docker.internal/api",
  prepareHeaders: (headers, api) => {
    headers.set("X-Requested-With", "XMLHttpRequest");
    headers.set("Access-Control-Allow-Origin", "*");
    const cookies = api.extra;
    if (cookies) {
      const FakeCookie = cookies.get("FakeCookie").value;
      headers.set("Cookie", `FakeCookie=${FakeCookie}`);
    }
  },
});

export const api = createApi({
  reducerPath: "api",
  baseQuery: async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    if (result.data) {
      return { ...result, data: camelize(result.data) };
    }
    return result;
  },
  keepUnusedFor: 1000,
  endpoints: () => ({}),
});

export const authSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => ({
        url: "/auth/me",
      }),
      transformResponse: (res) => {
        return res;
      },
    }),
  }),
});

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";
import camelize from "camelize";

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

export const serverSideApi = createApi({
  reducerPath: "api",
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

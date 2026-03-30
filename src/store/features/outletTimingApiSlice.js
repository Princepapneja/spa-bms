import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../utils/basequery";

export const outletTimingApi = createApi({
  reducerPath: "outletTimingApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getTimings: builder.query({
      query: (params) => ({
        url: "/outlet-timings",
        method: "GET",
        params,
      }),
    }),

  }),
});

export const {
  useGetTimingsQuery,
  useLazyGetTimingsQuery,
} = outletTimingApi;
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../utils/basequery";

export const therapistApi = createApi({
  reducerPath: "therapistApi",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    
    getTherapists: builder.query({
      query: (params) => ({
        url: "/therapists",
        method: "GET",
        params,
      }),
    }),

  }),
});

export const {
  useGetTherapistsQuery,
} = therapistApi;